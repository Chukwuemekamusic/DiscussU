from django.shortcuts import render

# Create your views here.


def home(request):
    context = {}
    return render(request, 'base/home.html', context)


def createRoom(request):
    context = {}
    return render(request, 'base/create-room.html', context)
