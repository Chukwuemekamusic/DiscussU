from django.shortcuts import render

from .models import Participant

from django.views.generic import DeleteView
from django.urls import reverse_lazy
# from django.shortcuts import get_object_or_404
# Create your views here.


def create_participants(room, comments):
    participants = room.participant_set.all()

    for comment in comments:
        user = comment.user
        if not participants.filter(user=user).exists():
            Participant.objects.create(user=user, room=room)

    return room.participant_set.all()


def home(request):
    return render(request, 'base/home2.html')
