from django.urls import path
from .views import (
    RoomListCreateAPIView, CategoryListAPIView,
    RoomDetailAPIView, RoomParticipantsAPIView,
    RoomUpdateAPIView, CommentListCreateAPIView,
    RoomCommentDestroyAPIView, CreateUserAPIView, LoginUserView,
    LogoutUserView, UserDetailAPIView, UserUpdateAPIView, SchoolListAPIView,
    RoomTestListCreateAPIView, UserAvatarUpload,
    UserParticipatedRoomsAPIView, AllUsersListView,
    FollowAPIView, UnfollowAPIView, FollowListAPIView,
    ReportCategoryListAPIView, ReportCommentAPIView,
    MessageListCreateView, ConversationListView, MessageDeleteAPIView
    # CreateFollowAPIView
)
# from rest_framework.routers import SimpleRouter
app_name = 'api'
# TODO learn about api schema https://github.com/tfranzel/drf-spectacular

# router = DefaultRouter()
# router.register('rooms', RoomDetailAPIView, basename='room-detail')
# router.register('comments', CommentListCreateAPIView, basename='room-comment')

urlpatterns = [
    path('rooms/', RoomListCreateAPIView.as_view(), name='api-room-list-create'),
    path('categories/', CategoryListAPIView.as_view(), name='api-category-list'),

    path('rooms/<str:pk>/comments/', CommentListCreateAPIView.as_view(), name='api-room-comment-list'),
    path('comments/<str:pk>/delete/', RoomCommentDestroyAPIView.as_view(), name='api-room-comment-delete'),

    path('rooms/<str:pk>/', RoomDetailAPIView.as_view(), name='api-room-detail'),
    path('rooms/<str:pk>/update/', RoomUpdateAPIView.as_view(), name='api-room-update'),
    path('rooms/<str:pk>/participants/', RoomParticipantsAPIView.as_view(), name='api-room-participants'),

    path('users/create/', CreateUserAPIView.as_view(), name='api-create-user'),
    path('avatar/create/', UserAvatarUpload.as_view(), name='api-create-avatar'),
    path('users/login/', LoginUserView.as_view(), name='api-login-user'),
    path('users/logout/', LogoutUserView.as_view(), name='api-logout-user'),    
    path('users/<str:pk>/update/', UserUpdateAPIView.as_view(), name='api-user-update'),
    path('users/details/', UserDetailAPIView.as_view(), name='api-user-detail'),
    path('users/profiles/', AllUsersListView.as_view(), name='api-student-profiles'),
    path('user/participated-rooms/', UserParticipatedRoomsAPIView.as_view(), name='api-user-participated-rooms'),
    path('users/follow/', FollowAPIView.as_view(), name='api-follow'),
    path('users/follow/', FollowAPIView.as_view(), name='api-follow'),
    path('users/follow-status/', FollowListAPIView.as_view(), name='api-follow-status'),
    # path('follow/<int:pk>/', CreateFollowAPIView.as_view(), name='api-follow-unfollow'),

    path('users/unfollow/<str:pk>/', UnfollowAPIView.as_view(), name='api-unfollow'),

    path('schools/', SchoolListAPIView.as_view(), name='api-school-list'),

    # for test without login
    path('rooms-test/', RoomTestListCreateAPIView.as_view(), name='api-test-room-list-create'),

    # flag comments
    path('flag-comment/', ReportCommentAPIView.as_view(), name='api-flag-comment'),
    path('report-categories/', ReportCategoryListAPIView.as_view(), name='api-report-categories'),

    # inbox
    path('inbox/', MessageListCreateView.as_view(), name='api-inbox'),
    path('inbox/<int:pk>/', ConversationListView.as_view(), name='api-inbox'),
    path('inbox/<str:pk>/delete/', MessageDeleteAPIView.as_view(), name='api-inbox'),

]
