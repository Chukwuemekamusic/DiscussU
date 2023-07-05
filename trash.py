# existing_users = participants.values_list('user__id', flat=True)

    # new_users = [
    #     comment.user for comment in comments if comment.user not in 
    # existing_users
    # ]
    # new_participants = []
    # new_participants = [
    #     Participant(user=user, room=room)
    #     for user in new_users
    # ]

    # Participant.objects.bulk_create(
    #     new_participants
    # )