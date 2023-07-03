from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
# from django.contrib import messages

# Create your models here.


class School(models.Model):
    name = models.CharField(max_length=500)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    first_name = models.CharField(max_length=100, blank=False)
    last_name = models.CharField(max_length=100, blank=False)
    email = models.EmailField(unique=True, blank=False)

    # TODO MUST CONTAIN ONLY NUMERIC CHARACTERS, change blank to False
    student_id = models.CharField(max_length=10, unique=True, blank=True)
    school = models.ForeignKey(
        School, on_delete=models.SET_NULL, null=True, blank=True)
    # school = models.CharField(max_length=100, null=True, blank=True)
    course = models.CharField(max_length=100, null=True, blank=True)

    # TODO LOG IN WITH EMAIL OR STUDENT_ID


class Category(models.Model):
    name = models.CharField(max_length=500)
    # description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class Room(models.Model):
    host = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True)
    school = models.ManyToManyField(
        School, related_name='rooms', blank=True)
    name = models.CharField(max_length=500)
    description = models.TextField(null=True, blank=True)
    members = models.ManyToManyField(User, related_name='member', blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['host', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if not self.pk:
            Participant.objects.create(
                user=self.host, room=self, is_admin=True)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    content = models.TextField()
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    # ensure that parent_comment when provided is from the same room
    def clean(self):
        super().clean()
        if self.parent_comment and self.parent_comment.room != self.room:
            raise ValidationError(
                "The parent comment must be from the same room.")

    def __str__(self):
        return self.content


class Participant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)

    class Meta:
        unique_together = ['user', 'room']

    def __str__(self):
        return self.user.username


class Follow(models.Model):
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='follower'
    )
    followed_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='followed_user', default=None
    )
    followed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.follower.username} follows {self.followed_user.username}'

    class Meta:
        unique_together = ['follower', 'followed_user']
