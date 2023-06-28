from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.loginPage, name='login'),
    path('logout/', views.logoutPage, name='logout'),
    path('create-room/', views.createRoom, name='create-room'),
    path('room-detail/<str:pk>/', views.roomDetail, name='room-detail'),
    path('delete-comment/<str:pk>/', views.deleteComment, name='delete-comment'),
]
