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


class RoomListCreateAPIView(LoginRequiredMixin, APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'},
                status=status.HTTP_403_FORBIDDEN)

        q = request.GET.get('q') or ''
        user_school = request.user.school

        rooms = Room.objects.filter(
            # TODO I NEED THE USER TO ALWAYS VIEW HIS/HER ROOM CREATED
            Q(category__name__icontains=q) | Q(name__icontains=q),
            Q(school__isnull=True) | Q(school=user_school)
        )
        # rooms = Room.objects.all()
        serializer = RoomUpdateSerializer(rooms, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'},
                status=status.HTTP_403_FORBIDDEN)

        request.data['host'] = request.user.id

        serializer = RoomUpdateSerializer(data=request.data)
        if serializer.is_valid():
            category_name = serializer.validated_data.get('category')
            category, created = Category.objects.get_or_create(
                name=category_name)
            serializer.save(host=self.request.user, category=category)
            # CROSSCHECK room.data
            return Response(
                serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomParticipantsAPIView(LoginRequiredMixin, ListAPIView):
    def get(self, request, pk):
        try:
            room = Room.objects.get(id=pk)
        except Room.DoesNotExist:
            return Response({'detail': 'Room not found'}, status=404)

        comments = Comment.objects.filter(room=room)
        participants = create_participants(room, comments)
        serializer = ParticipantSerializer(participants, many=True)
        return Response(serializer.data)


class RoomDetailAPIView(LoginRequiredMixin, APIView):
    def get_object(self, pk):
        return get_object_or_404(Room, id=pk)

    def get_comment(self, pk):
        return get_object_or_404(Comment, id=pk)

    def get(self, request, pk):
        room = self.get_object(pk)
        user_school = request.user.school

        if room.school.exists() and user_school not in room.school.all():
            return Response(
                {'detail': 'Not permitted in the Room'},
                status=status.HTTP_403_FORBIDDEN
            )
            # raise PermissionDenied(
            # 'You do not have permssion to access this room')

        serializer = RoomSerializer(room)
        comments = Comment.objects.filter(room=room)
        comment_serializer = CommentSerializer(comments, many=True)
        data = {
            'room': serializer.data,
            'comment': comment_serializer.data
        }
        return Response(data)

    def post(self, request, pk):
        room = self.get_object(pk)
        new_content = request.data.get('content')
        comment_data = {
            'user': request.user.id, 'room': room.id, 'content': new_content
        }
        serializer = CommentCreateSerializer(data=comment_data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'detail': 'Comment added'}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
