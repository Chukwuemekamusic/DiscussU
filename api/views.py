# from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import (
    UpdateAPIView, ListCreateAPIView, ListAPIView,
    RetrieveAPIView, DestroyAPIView,
    CreateAPIView, RetrieveUpdateAPIView
)
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.shortcuts import get_object_or_404
from base.models import (
    Room, User, Comment, Category, Participant, School)
from .serializers import (
    RoomSerializer, UserSerializer, CommentSerializer, CommentCreateSerializer,
    CategorySerializer, ParticipantSerializer,
    RoomUpdateSerializer, CommentCreateSerializer,
    CreateUserSerializer, UpdateUserSerializer, LoginUserSerializer,
    SchoolSerializer
)
from django.db.models import Q
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import login

from knox.views import (LoginView as KnoxLoginView,
                        LogoutView as KnoxLogoutView)
from knox.auth import TokenAuthentication
from knox.models import AuthToken


# participant function
from base.views import create_participants

# Create your views here.

# End point view


# Users API views

class CreateUserAPIView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = (AllowAny,)


class UserDetailView(RetrieveAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)

    def get_object(self):
        return self.request.user

    # def get_serializer_context(self):
    #     context = super().get_serializer_context()
    #     context['token'] = self.request.headers.get('Authorization').split(' ')[1]
    #     return context


class UpdateUserAPIView(LoginRequiredMixin, UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer


class LoginUserView(KnoxLoginView):
    permission_classes = (AllowAny,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = LoginUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        _, token = AuthToken.objects.create(user)
    #     return Response({'token': token})
        user_serializer = UserSerializer(user).data
        response_data = {
            'user': user_serializer,
            'token': token,

        }
        return Response(response_data)

        # return super(LoginUserView, self).post(request, format=None)


class LogoutUserView(KnoxLogoutView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

# End User API Views


# Room API Views

class RoomListCreateAPIView(ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        q = self.request.GET.get('q') or ''
        user_school = self.request.user.school if self.request.user.is_authenticated else None

        if user_school:
            queryset = Room.objects.filter(
                Q(category__name__icontains=q) | Q(
                    name__icontains=q) | Q(description__icontains=q),
                Q(school__isnull=True) | Q(school=user_school)
            )
        else:
            queryset = Room.objects.filter(
                Q(category__name__icontains=q) | Q(name__icontains=q),
            )
        return queryset

    def perform_create(self, serializer):
        category_id = self.request.data.get('category') or ''
        category_name = self.request.data.get('category_name') or ''

        if category_id:
            category, created = Category.objects.get_or_create(id=category_id)
        elif category_name:
            category, created = Category.objects.get_or_create(
                name=category_name)
        else:
            raise serializers.ValidationError(
                'Category ID or name is required.')

        # category_name = serializer.validated_data.get('category')
        # category, created = Category.objects.get_or_create(
        # name=category_name)
        serializer_data = serializer.validated_data
        serializer_data.pop('category_name', None)

        serializer.save(host=self.request.user,
                        category=category, **serializer_data)


class RoomTestListCreateAPIView(ListCreateAPIView):
    serializer_class = RoomSerializer
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        q = self.request.GET.get('q') or ''
        user_school = self.request.user.school if (
            self.request.user.is_authenticated) else None

        if user_school:
            queryset = Room.objects.filter(
                Q(category__name__icontains=q) | Q(
                    name__icontains=q) | Q(description__icontains=q),
                Q(school__isnull=True) | Q(school=user_school),

            )
        else:
            queryset = Room.objects.filter(
                Q(category__name__icontains=q) | Q(name__icontains=q),
            )
        return queryset

    def perform_create(self, serializer):
        category_id = self.request.data.get('category')
        category_name = self.request.data.get('category_name')

        if category_id:
            category, created = Category.objects.get_or_create(id=category_id)
        elif category_name:
            category, created = Category.objects.get_or_create(
                name=category_name)
        else:
            raise serializers.ValidationError(
                'Category ID or name is required.')

        # category_name = serializer.validated_data.get('category')
        # category, created = Category.objects.get_or_create(
        # name=category_name)
        serializer.save(host=self.request.user, category=category)


class RoomDetailAPIView(RetrieveAPIView, DestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.all()

    def get_object(self):
        room_id = self.kwargs.get('pk')
        # room = get_object_or_404(Room, id=room_id)
        room = self.get_queryset().get(id=room_id)
        user_school = self.request.user.school if self.request.user.is_authenticated else room.school

        if room.school.exists() and user_school not in room.school.all():
            self.permission_denied(
                self.request, message='Not permitted in this room!')

        return room

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class RoomCommentDestroyAPIView(DestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    permission_denied_message = (
        "You are not allowed to delete another user's comment!!!")

    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user)

    def get_object(self):
        comment_id = self.kwargs.get('pk')
        comment = self.get_queryset().get(id=comment_id)
        return comment

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class RoomDetail2APIView(LoginRequiredMixin, APIView):
    def get_object(self, pk):
        return get_object_or_404(Room, id=pk)

    def get_comment(self, pk):
        return get_object_or_404(Comment, id=pk)

    def get(self, request, pk):
        room = self.get_object(pk)
        user_school = request.user.school

        if room.school.exists() and user_school not in room.school.all():
            return Response(
                {'detail': 'Not permitted in the Room'},
                status=status.HTTP_403_FORBIDDEN
            )
            # raise PermissionDenied(
            # 'You do not have permssion to access this room')

        serializer = RoomSerializer(room)
        comments = Comment.objects.filter(room=room)
        comment_serializer = CommentSerializer(comments, many=True)
        data = {
            'room': serializer.data,
            'comment': comment_serializer.data
        }
        return Response(data)

    def post(self, request, pk):
        room = self.get_object(pk)
        new_content = request.data.get('content')
        comment_data = {
            'user': request.user.id, 'room': room.id, 'content': new_content
        }
        serializer = CommentCreateSerializer(data=comment_data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'detail': 'Comment added'}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment = self.get_comment(pk)
        if request.user != comment.user:
            return Response('You do not have permssion to delete this comment',
                            status=status.HTTP_403_FORBIDDEN)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentListCreateAPIView(ListCreateAPIView):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        room_id = self.kwargs.get('pk')
        queryset = Comment.objects.filter(room=room_id)
        return queryset

    def perform_create(self, serializer):
        room_id = self.kwargs.get('pk')
        room = Room.objects.get(id=room_id)
        user = self.request.user if (
            self.request.user.is_authenticated) else None
        serializer.save(user=user, room=room)

# Category API views


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# User API views
class UserDetailAPIView(APIView):
    # def get_object(self, pk):
    #     return get_object_or_404(User, id=pk)

    # def get(self, request, pk):
    #     user = self.get_object(pk)
    ...


class RoomParticipantsAPIView(LoginRequiredMixin, ListAPIView):
    serializer_class = ParticipantSerializer

    def get_queryset(self):
        room_id = self.kwargs.get('pk')
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            # return Response({'detail': 'Room not found'}, status=404)
            return []

        comments = Comment.objects.filter(room=room)
        queryset = create_participants(room, comments)
        return queryset


class RoomUpdateAPIView(UpdateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def get_object(self):
        pk = self.kwargs.get('pk')
        room = get_object_or_404(Room, id=pk)
        # if self.request.user != room.host:
        #     self.permission_denied(self.request)
        return room

    def perform_update(self, serializer):
        # return super().perform_update(serializer)
        serializer.save()


class SchoolListAPIView(ListAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
