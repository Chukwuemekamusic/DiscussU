from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from base.models import Comment, Participant
from base.views import create_participants


@receiver([post_save, post_delete], sender=Comment)
def comment_post_save(sender, instance, **kwargs):
    if 'created' in kwargs and kwargs['created']:
        # Comment created, add participant
        create_participants(instance.room, [instance])
    else:
        # Comment deleted, remove participant if needed
        # Implement delete_participants if you need to handle participant deletion
        delete_participants(instance.room, [instance])


def delete_participants(room, comments):
    for comment in comments:
        user = comment.user
        user_comments = Comment.objects.filter(user=user, room=room)
        if not user_comments.exists():
            # No other comments for the user in the room, delete participant
            Participant.objects.filter(user=user, room=room).delete()
