from django.http import HttpResponse
from django.shortcuts import render, redirect
from .forms import RoomForm, RegisterForm
from .models import Category, Room, Comment, User, Participant
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

# from django.contrib.auth.models import User
from django.contrib import messages
from django.db.models import Q
from django.db import IntegrityError

from django.views.generic import DeleteView
from django.urls import reverse_lazy
# from django.shortcuts import get_object_or_404
# Create your views here.


def home(request):
    if not request.user.is_authenticated:
        return redirect('login')
    q = request.GET.get('q') or ''
    if request.user.school:
        user_school = request.user.school

    rooms = Room.objects.filter(
        Q(category__name__icontains=q) | Q(name__icontains=q),
        Q(school__isnull=True) | Q(school=user_school)
    )

    categories = Category.objects.all()
    context = {'rooms': rooms, 'categories': categories}
    return render(request, 'base/home.html', context)


def loginPage(request):
    if request.method == 'POST':
        username = request.POST.get('username').lower()
        password = request.POST.get('password')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            messages.error(request, 'Invalid username or password!')

        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Username or password does not exist!')

    return render(request, 'base/login.html')


def logoutPage(request):
    logout(request)
    return redirect('home')


def registerPage(request):
    form = RegisterForm()

    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            try:
                user = form.save()
                login(request, user)
                return redirect('home')
            except IntegrityError:
                messages.error(request, "User with this email already exists")
            except Exception:
                messages.error(request, "Something is wrong in saving this")
        else:
            messages.error(request, "Form is not Valid")
            existing_user = User.objects.filter(
                student_id=request.POST.get('student_id')
            ).exists()
            if existing_user:
                messages.error(
                    request, "User with this student ID already exists.")

    context = {'form': form}
    return render(request, 'base/register-user.html', context)


@login_required(login_url='login')
def roomDetail(request, pk):
    room = Room.objects.get(id=pk)
    user_school = request.user.school
    if room.school.exists() and user_school not in room.school.all():
        messages.error(request, 'Not permitted in the Room!')
        return redirect('home')

    if request.method == 'POST':
        newComment = request.POST.get('newComment')
        Comment.objects.create(
            user=request.user,
            room=room,
            content=newComment
        )
        return redirect('room-detail', pk=room.id)

    comments = Comment.objects.filter(room=room)
    participants = create_participants(room, comments)

    context = {'room': room, 'comments': comments,
               'participants': participants}
    return render(request, 'base/room-detail.html', context)


def create_participants(room, comments):
    participants = room.participant_set.all()

    for comment in comments:
        user = comment.user
        if not participants.filter(user=user).exists():
            Participant.objects.create(user=user, room=room)

    return room.participant_set.all()


@login_required(login_url='home')
def deleteComment(request, pk):
    try:
        comment = Comment.objects.get(id=pk)
    except Comment.DoesNotExist:
        return redirect('home')

    room_id = comment.room.id
    if request.user != comment.user:
        return HttpResponse('Not allowed!')

    if request.method == 'POST':
        comment.delete()
        return redirect('room-detail', pk=room_id)
        # return redirect('home')

    context = {'obj': comment}
    return render(request, 'base/delete.html', context)


@login_required(login_url='login')
def createRoom(request):
    form = RoomForm()
    categories = Category.objects.all()

    if request.method == 'POST':
        form = RoomForm(request.POST)
        if form.is_valid():
            room = form.save(commit=False)
            room.host = request.user

            category_name = form.cleaned_data.get('category')
            category, created = Category.objects.get_or_create(
                name=category_name)
            room.category = category
            room.save()
        return redirect('home')

    context = {'form': form, 'categories': categories}
    return render(request, 'base/create-room.html', context)


@login_required(login_url='login')
def editRoom(request, pk):
    try:
        room = Room.objects.get(id=pk)
    except Room.DoesNotExist:
        messages.error(request, 'Room does not exist')
        return redirect('home')
    categories = Category.objects.all()

    if request.user != room.host:
        messages.error(request, 'Only host can edit a room info!')
        return redirect('home')
    form = RoomForm(instance=room)

    if request.method == 'POST':
        form = RoomForm(data=request.POST)
        if form.is_valid():
            category_name = form.cleaned_data.get('category')
            category, created = Category.objects.get_or_create(
                name=category_name)
            room.category = category
            room.name = request.POST.get('name')
            room.description = request.POST.get('description')
            room.host = request.user
            try:
                room.save()
                return redirect('room-detail', pk=room.id)
            except Exception as e:
                messages.error(request, 'An error occured while saving!')
                print(str(e))
                # TODO or maybe back to room-detail page.
                return redirect('home')

        else:
            messages.error(request, 'form not valid')

    context = {'form': form, 'categories': categories, 'room': room}
    return render(request, 'base/edit-room.html', context)


class RoomDeleteView(DeleteView):
    model = Room
    template_name = "base/delete.html"
    success_url = reverse_lazy('home')
