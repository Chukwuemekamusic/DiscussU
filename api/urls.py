from django.urls import path
from .views import (
    RoomListCreateAPIView, CategoryListAPIView,
    RoomDetailAPIView, RoomParticipantsAPIView,
    RoomUpdateAPIView, CommentListCreateAPIView,
    RoomCommentDestroyAPIView, CreateUserAPIView, LoginUserView,
    LogoutUserView, UserDetailAPIView, SchoolListAPIView,
    RoomTestListCreateAPIView,
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
    path('users/login/', LoginUserView.as_view(), name='api-login-user'),
    path('users/logout/', LogoutUserView.as_view(), name='api-logout-user'),
    path('users/details/', UserDetailAPIView.as_view(), name='api-user-detail'),

    path('schools/', SchoolListAPIView.as_view(), name='api-school-list'),

    #for test without login
    path('rooms-test/', RoomTestListCreateAPIView.as_view(), name='api-test-room-list-create'),
]
