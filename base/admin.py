from django.contrib import admin

# Register your models here.

from .models import Room, Category, Comment, Participant, Follow
from .models import School, User, ReportCategory, ReportComment, Message


admin.site.register(User)


class CommentInline(admin.TabularInline):
    model = Comment


# @admin.register(Room)
# class RoomAdmin(admin.ModelAdmin):
#     inlines = [CommentInline]
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'host', 'category', 'permit_all',
                    'get_member_count', 'school_count')
    list_filter = ('category', 'permit_all')
    search_fields = ('name', 'host__username', 'school__name')

    # def member_count(self, obj):
    #     return obj.get_member_count()
    # member_count.short_description = 'Member Count'

    def school_count(self, obj):
        return obj.school.count()
    school_count.short_description = 'School Count'


admin.site.register(Room, RoomAdmin)


# admin.site.register(Room)
admin.site.register(Category)
admin.site.register(Comment)
# admin.site.register(Participant)
admin.site.register(Follow)
admin.site.register(School)
# admin.site.register(ReportComment)
admin.site.register(ReportCategory)
admin.site.register(Message)


class ParticipantAdmin(admin.ModelAdmin):
    # Customize the displayed fields
    list_display = ('user', 'room', 'joined_at')

    def joined_at(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M:%S')

    joined_at.short_description = 'Joined At'


admin.site.register(Participant, ParticipantAdmin)


class ReportCommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'comment', 'reporter',
                    'category', 'reported_at', 'handled')
    list_filter = ('handled', 'category')
    search_fields = ('comment__content', 'details')
    actions = ['handle_complaint']

    def handle_complaint(self, request, queryset):
        # Custom action to handle the complaint (you can implement your handling logic here)
        for report in queryset:
            # Mark the complaint as handled (you can implement your handling logic here)
            report.handled = True
            report.save()

    handle_complaint.short_description = "Handle selected complaints"


admin.site.register(ReportComment, ReportCommentAdmin)
