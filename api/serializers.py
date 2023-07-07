from rest_framework.serializers import (
    ModelSerializer, SerializerMethodField, StringRelatedField
)
from rest_framework import serializers
from base.models import Room, User, Participant, Category, Comment, School
from django.contrib.auth import authenticate


# user serializers
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name',
                  'email', 'student_id', 'school', 'course', 'password']
        extra_kwargs = {
            'password': {'required': True}
        }


class CreateUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name',
                  'email', 'student_id', 'school', 'course', 'password']

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                'User with this email id already exists.')
        # if User.objects.filter(student_id=student_id).exists():
        #     raise serializers.ValidationError(
        #       'User with this student id already exists.')
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UpdateUserSerializer(ModelSerializer):
    class Meta:
        model = User
        # TODO DETERMINE THINGS THAT CAN'T BE UPDATED FOR STUDENTS
        fields = ['first_name', 'last_name', 'email', 'passowrd']

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        if password:
            instance.set_password(password)
        instance = super().update(instance, validated_data)
        return instance


class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email').lower()
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError(
                'Please provide both email and password')

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid email or password.')

        attrs['user'] = user
        return attrs

# end user serializer


class RoomSerializer(ModelSerializer):
    number_of_participants = SerializerMethodField()
    category_name = serializers.CharField(required=False)
    host = StringRelatedField()
    # category = StringRelatedField()

    class Meta:
        model = Room
        fields = '__all__'

    def get_number_of_participants(self, obj):
        return obj.participant_set.all().count()


class RoomUpdateSerializer(ModelSerializer):
    category = StringRelatedField()

    class Meta:
        model = Room
        fields = '__all__'


class CommentSerializer(ModelSerializer):
    user = StringRelatedField()
    room = StringRelatedField()

    class Meta:
        model = Comment
        fields = [
            'id', 'user', 'parent_comment', 'room', 'content',
            'updated', 'created'
        ]


class CommentCreateSerializer(serializers.ModelSerializer):
    # newComment = serializers.CharField(write_only=True)

    class Meta:
        model = Comment
        fields = ['content']

    # def create(self, validated_data):
    #     new_comment = validated_data.get('newComment')
    #     room_id = self.context['view'].kwargs['pk']
    #     room = Room.objects.get(id=room_id)
    #     user = self.context['request'].user
    #     comment = Comment.objects.create(
    #         user=user, room=room, content=new_comment)
    #     return comment


class ParticipantSerializer(ModelSerializer):
    user = UserSerializer()
    room = RoomSerializer()

    class Meta:
        model = Participant
        fields = ['id', 'user', 'room', 'joined_at', 'is_admin']


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']


class SchoolSerializer(ModelSerializer):
    number_of_students = SerializerMethodField()

    class Meta:
        model = School
        fields = ['name', 'description', 'number_of_students']

    def get_number_of_students(self, obj):
        return obj.user_set.all().count()
