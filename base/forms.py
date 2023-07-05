from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from .models import Room, User


class RoomForm(ModelForm):
    class Meta:
        model = Room
        fields = '__all__'
        exclude = ['host', 'members']
        # exclude = ['members']


class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username',
                  'student_id', 'password1', 'password2', 'school', 'course']
