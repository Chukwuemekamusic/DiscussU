from django.http import HttpResponse
from django.shortcuts import render, redirect
from .forms import RoomForm
from .models import Category, Room, Comment
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
# from django.shortcuts import get_object_or_404
# Create your views here.


def home(request):
    rooms = Room.objects.all()
    context = {'rooms': rooms}
    return render(request, 'base/home.html', context)


def loginPage(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user = User.objects.get(username=username)
        except:
            messages.error(request, 'User not found!')

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


def createRoom(request):
    form = RoomForm()
    categories = Category.objects.all()

    if request.method == 'POST':
        # category_id = request.POST.get('category')
        # category = get_object_or_404(Category, pk=category_id)
        # Room.objects.create(
        #     host=request.user,
        #     name=request.POST.get('name'),
        #     category=category,
        #     description=request.POST.get('description')
        # )

        form = RoomForm(request.POST)
        if form.is_valid():
            room = form.save(commit=False)
            room.host = request.user
            room.save()
        return redirect('home')

    context = {'form': form, 'categories': categories}
    return render(request, 'base/create-room.html', context)


def roomDetail(request, pk):
    room = Room.objects.get(id=pk)

    if request.method == 'POST':
        newComment = request.POST.get('newComment')
        Comment.objects.create(
            user=request.user,
            room=room,
            content=newComment
        )
        # return redirect('room-detail')

    comments = Comment.objects.filter(room=room)
    context = {'room': room, 'comments': comments}
    return render(request, 'base/room-detail.html', context)


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
