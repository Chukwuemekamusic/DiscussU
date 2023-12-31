from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import os
# from django.contrib import messages

# Create your models here.


class School(models.Model):
    name = models.CharField(max_length=500)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


def get_upload_path(instance, filename):
    return os.path.join('images', 'avatars', str(instance.pk), filename)


def upload_to(instance, filename):
    return 'profile_pics/{filename}'.format(filename=filename)


class User(AbstractUser):
    first_name = models.CharField(max_length=100, blank=False)
    last_name = models.CharField(max_length=100, blank=False)
    email = models.EmailField(unique=True, blank=False)
    student_id = models.CharField(max_length=10, unique=True, blank=True)
    school = models.ForeignKey(
        School, on_delete=models.SET_NULL, null=True, blank=True)
    # school = models.CharField(max_length=100, null=True, blank=True)
    course = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    profile_pic = models.ImageField(
        _("Profile Picture"), upload_to="profile_pics/",
        default="default_profile_pic.png"
    )
    avatar = models.ImageField(
        upload_to=get_upload_path, blank=True, null=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self) -> str:
        return self.username

    def get_no_of_followers(self):
        return self.followed_user.count()

    def get_no_of_followed(self):
        return self.follower.count()


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
    permit_all = models.BooleanField(default=False)
    # members = models.ManyToManyField(User, related_name='member', blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['host', 'name']

    @property
    def get_member_count(self):
        return Participant.objects.filter(room=self).count()

    def __str__(self):
        return self.name


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


# handling reporting bad comments
class ReportCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class ReportComment(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    category = models.ForeignKey(ReportCategory, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    reported_at = models.DateTimeField(auto_now_add=True)
    handled = models.BooleanField(default=False)

    def __str__(self):
        return f'Reporter: {self.reporter}, Comment: {self.comment.id}, Category: {self.category}'


class Message(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)  # created

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username}"


# def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)

    #     if not self.pk:
    #         Participant.objects.create(
    #             user=self.host, room=self, is_admin=True)
