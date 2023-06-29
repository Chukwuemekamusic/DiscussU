from django.contrib import admin

# Register your models here.

from .models import Room, Category, Comment, Participant, Follow
from .models import School, User


admin.site.register(User)


class CommentInline(admin.TabularInline):
    model = Comment


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    inlines = [CommentInline]


# admin.site.register(Room)
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(Participant)
admin.site.register(Follow)
admin.site.register(School)
