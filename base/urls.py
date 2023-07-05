from django.urls import path
from . import views
from .views import RoomDeleteView

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.loginPage, name='login'),
    path('logout/', views.logoutPage, name='logout'),
    path('register-user/', views.registerPage, name='register-user'),

    path('create-room/', views.createRoom, name='create-room'),
    path('room-detail/<str:pk>/', views.roomDetail, name='room-detail'),
    path('edit-room/<str:pk>/', views.editRoom, name='edit-room'),
    path('delete-comment/<str:pk>/', views.deleteComment, name='delete-comment'),
    path('delete-room/<str:pk>/', RoomDeleteView.as_view(), name='delete-room'),

]
