from django.urls import path
from .views import (
    RoomListCreateAPIView, CategoryListAPIView,
    RoomDetailAPIView, RoomParticipantsAPIView,
    RoomUpdateAPIView, CommentListCreateAPIView,
    CreateUserAPIView, LoginUserView, LogoutUserView,
    SchoolListAPIView, APIEndpointListView
)
app_name = 'api'
urlpatterns = [
    path('rooms/', RoomListCreateAPIView.as_view(), name='api-room-list-create'),
    path('categories/', CategoryListAPIView.as_view(), name='api-category-list'),
    path('rooms/<str:pk>/comment/', CommentListCreateAPIView.as_view(), name='api-room-comment-list'),

    path('rooms/<str:pk>', RoomDetailAPIView.as_view(), name='api-room-detail'),
    path('rooms/<str:pk>/update', RoomUpdateAPIView.as_view(), name='api-room-update'),
    path('rooms/<str:pk>/participants/', RoomParticipantsAPIView.as_view(), name='api-room-participants'),

    path('users/create/', CreateUserAPIView.as_view(), name='api-create-user'),
    path('users/login', LoginUserView.as_view(), name='api-login-user'),
    path('users/logout', LogoutUserView.as_view(), name='api-logout-user'),

    path('schools/', SchoolListAPIView.as_view(), name='api-school-list'),

    path('endpoints/', APIEndpointListView.as_view(), name='api-endpoint-list'),
]
