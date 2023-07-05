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
# admin.site.register(Participant)
admin.site.register(Follow)
admin.site.register(School)


class ParticipantAdmin(admin.ModelAdmin):
    # Customize the displayed fields
    list_display = ('user', 'room', 'joined_at')

    def joined_at(self, obj):
        # Example: Format the datetime field
        return obj.created_at.strftime('%Y-%m-%d %H:%M:%S')

    joined_at.short_description = 'Joined At'  # Example: Customize the column name


admin.site.register(Participant, ParticipantAdmin)
