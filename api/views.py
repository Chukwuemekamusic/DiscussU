from django.http import Http404
from rest_framework.views import APIView
from rest_framework.generics import (
    UpdateAPIView, ListCreateAPIView, ListAPIView,
    RetrieveAPIView, DestroyAPIView, CreateAPIView
)
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.shortcuts import get_object_or_404
from base.models import (
    Room, User, Comment, Category, School, Follow,
    ReportCategory, ReportComment, Message)
from .serializers import (
    RoomSerializer, UserSerializer, CommentSerializer, CommentCreateSerializer,
    CategorySerializer, ParticipantSerializer,  # RoomUpdateSerializer,
    CreateUserSerializer, UpdateUserSerializer, LoginUserSerializer,
    ProfileSerializer, SchoolSerializer, FollowSerializer,
    ReportCategorySerializer, ReportCommentSerializer,
    MessageSerializer
)
from django.db.models import Q
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import login

from knox.views import (LoginView as KnoxLoginView,
                        LogoutView as KnoxLogoutView)
from knox.auth import TokenAuthentication

# participant function
from base.views import create_participants

# image
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

# End point view


# Users API views


class UserAvatarUpload(APIView):    # no longer used
    permission_classes = (AllowAny,)
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response()


class CreateUserAPIView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = (AllowAny,)
    parser_classes = [MultiPartParser, FormParser]
    # new additions


class AllUsersListView(ListAPIView):
    serializer_class = ProfileSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()


class UserDetailAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_object(self):
        # Return the currently logged-in user
        return self.request.user


class UserUpdateAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer
    parser_classes = [MultiPartParser, FormParser]


class LoginUserView(KnoxLoginView):
    permission_classes = (AllowAny,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = LoginUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginUserView, self).post(request, format=None)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

        # return super(LoginUserView, self).post(request, format=None)


class LogoutUserView(KnoxLogoutView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


# not used though
class UserParticipatedRoomsAPIView(ListAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        # Retrieve the rooms where the current user is a member
        return Room.objects.filter(participant__user=self.request.user)
# End User API Views


# Room API Views

class RoomListCreateAPIView(ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    # authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        q = self.request.GET.get('q') or ''
        user = self.request.user
        user_school = user.school if user.is_authenticated else None

        if user_school:
            queryset = Room.objects.filter(
                Q(category__name__icontains=q) |
                Q(name__icontains=q) | Q(description__icontains=q),
                Q(school__isnull=True) | Q(school=user_school) |
                Q(permit_all=True) | Q(host=user)
            ).distinct()
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

        serializer_data = serializer.validated_data
        serializer_data.pop('category_name', None)

        serializer.save(category=category, **serializer_data)


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
        category_id = self.request.data.get('category') or ''
        category_name = self.request.data.get('category_name') or ''

        if category_id:
            category, _ = Category.objects.get_or_create(id=category_id)
        elif category_name:
            category, _ = Category.objects.get_or_create(
                name=category_name)
        else:
            serializer.save()

        serializer_data = serializer.validated_data
        serializer_data.pop('category_name', None)

        serializer.save(category=category, **serializer_data)


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
        user = self.request.user
        user_school = user.school if user.is_authenticated else room.school

        if user == room.host:
            return room

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
        return Comment.objects.filter(user=self.request.user.id)

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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    # parser_classes = [MultiPartParser, FormParser]

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


class SchoolListAPIView(ListAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

# Follow API


class FollowAPIView(CreateAPIView):
    serializer_class = FollowSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


class UnfollowAPIView(DestroyAPIView):
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        follower = self.request.user
        followed_user = self.kwargs['pk']
        return Follow.objects.get(follower=follower, followed_user=followed_user)


class FollowListAPIView(ListAPIView):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        # Filter the follow data based on the logged-in user
        logged_in_user = self.request.user
        queryset = Follow.objects.filter(follower=logged_in_user)
        return queryset


class CreateFollowAPIView(CreateAPIView):
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
        # Get the authenticated user as the follower
        follower = self.get_object()[1]

        # Get the user to be followed based on the provided 'pk' URL parameter
        followed_user = self.get_object()[0]

        # Set the follower and followed_user fields in the serializer data
        serializer.validated_data['follower'] = follower
        serializer.validated_data['followed_user'] = followed_user

        serializer.save()

    def get_object(self):
        # Get the user to be followed based on the 'pk' URL parameter
        followed_user = get_object_or_404(User, pk=self.kwargs['pk'])
        return followed_user, self.request.user


class ReportCategoryListAPIView(ListAPIView):
    serializer_class = ReportCategorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    queryset = ReportCategory.objects.all()


class ReportCommentAPIView(ListCreateAPIView):
    serializer_class = ReportCommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    queryset = ReportComment.objects.all()


class MessageListCreateView(ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(receiver=user)


class MessageDeleteAPIView(DestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    permission_denied_message = (
        "You are not allowed to delete another user's comment!!!")

    def get_queryset(self):
        return Message.objects.filter(sender=self.request.user.id)

    def get_object(self):
        message_id = self.kwargs.get('pk')
        # message = self.get_queryset().get(id=message_id)
        message = get_object_or_404(self.get_queryset(), id=message_id)

        return message

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ConversationListView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_object(self):
        student_id = self.kwargs.get('pk')
        try:
            student = get_object_or_404(User, id=student_id)
            # student = User.objects.get(id=student_id)
            user = self.request.user
        except Http404:
            return None, None
        return student, user

    def get_queryset(self):
        student, user = self.get_object()

        queryset = Message.objects.filter(
            Q(sender=student, receiver=user) | Q(
                sender=user, receiver=student)
        )
        queryset = queryset.order_by('created')
        return queryset


# class LoginUserView(KnoxLoginView):
#     permission_classes = (AllowAny,)
#     authentication_classes = (TokenAuthentication,)
#     serializer_class = LoginUserSerializer

#     def post(self, request, format=None):
#         serializer = self.serializer_class(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         login(request, user)
#         _, token = AuthToken.objects.create(user)
#     #     return Response({'token': token})
#         user_serializer = UserSerializer(user).data
#         response_data = {
#             'user': user_serializer,
#             'token': token,

#         }
#         return Response(response_data)

#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context['request'] = self.request
#         return context

    # return super(LoginUserView, self).post(request, format=None)
