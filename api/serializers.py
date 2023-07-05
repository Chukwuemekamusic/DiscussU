from rest_framework.serializers import ModelSerializer, SerializerMethodField
from base.models import Room, User, Participant, Category, Comment


class RoomSerializers(ModelSerializer):
    number_of_participants = SerializerMethodField()
    

    class Meta:
        model = Room
        fields = '__all__'

    def get_number_of_participants(self, obj):
        return obj.participant_set.all().count()