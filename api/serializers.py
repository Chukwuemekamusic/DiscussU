from rest_framework.serializers import (
    ModelSerializer, SerializerMethodField, StringRelatedField
)
from rest_framework import serializers
from base.models import (Room, User, Participant,
                         Category, Comment, School, Follow,
                         ReportCategory, ReportComment, Message)
from django.contrib.auth import authenticate

from base64 import b64encode


# user serializers
class UserSerializer(ModelSerializer):
    school_name = SerializerMethodField()
    no_of_followers = SerializerMethodField()
    no_of_followed = SerializerMethodField()
    followers = SerializerMethodField()
    followed_users = SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name',
                  'email', 'student_id', 'school', 'course', 'full_name',
                  'school_name', 'profile_pic', 'avatar', 'no_of_followers',
                  'no_of_followed', 'followers', 'followed_users', 'bio']

    def get_school_name(self, obj):
        school = School.objects.get(id=obj.school.id)
        return school.name

    def get_no_of_followers(self, obj):
        return obj.get_no_of_followers()

    def get_no_of_followed(self, obj):
        return obj.get_no_of_followed()

    def get_followers(self, obj):
        followers = Follow.objects.filter(followed_user=obj)
        return [{
            "id": follower.follower.id,
            "full_name": follower.follower.full_name.title(),
            "username": follower.follower.username
        } for follower in followers]

    def get_followed_users(self, obj):
        followed_users = Follow.objects.filter(follower=obj)
        return [{
            "id": followed.followed_user.id,
            "full_name": followed.followed_user.full_name.title(),
            "username": followed.followed_user.username
        } for followed in followed_users]


class ProfileSerializer(ModelSerializer):
    school_name = SerializerMethodField()
    no_of_followers = SerializerMethodField()
    no_of_followed = SerializerMethodField()

    followers = SerializerMethodField()
    followed_users = SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name',
                  'email', 'student_id', 'school', 'course', 'full_name',
                  'school_name', 'profile_pic', 'avatar', 'no_of_followers',
                  'no_of_followed', 'followers', 'followed_users', 'bio']

    def get_school_name(self, obj):
        school = School.objects.get(id=obj.school.id)
        return school.name

    def get_no_of_followers(self, obj):
        return obj.get_no_of_followers()

    def get_no_of_followed(self, obj):
        return obj.get_no_of_followed()

    def get_followers(self, obj):
        followers = Follow.objects.filter(followed_user=obj)
        return [{
            "id": follower.follower.id,
            "full_name": follower.follower.full_name.title(),
            "username": follower.follower.username
        } for follower in followers]

    def get_followed_users(self, obj):
        followed_users = Follow.objects.filter(follower=obj)
        return [{
            "id": followed.followed_user.id,
            "full_name": followed.followed_user.full_name.title(),
            "username": followed.followed_user.username
        } for followed in followed_users]


class CreateUserSerializer(ModelSerializer):
    profile_pic = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name',
                  'email', 'student_id', 'school', 'course', 'password', 'profile_pic']

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                'User with this email id already exists.')
        return attrs

        # if attrs['password'] != attrs['password2']:
        #     raise serializers.ValidationError(
        #         {"password": "Password fields didn't match."})
        # if User.objects.filter(student_id=student_id).exists():
        #     raise serializers.ValidationError(
        #       'User with this student id already exists.')
        

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Hash the password before saving
        user.save()
        return user


class AvatarSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['avatar']

    def update(self, instance, validated_data):
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance


class UpdateUserSerializer(ModelSerializer):
    class Meta:
        model = User
        # TODO DETERMINE THINGS THAT CAN'T BE UPDATED FOR STUDENTS
        fields = ['username', 'bio', 'profile_pic']

    # def update(self, instance, validated_data):
    #     password = validated_data.pop('password')
    #     if password:
    #         instance.set_password(password)
    #     instance = super().update(instance, validated_data)
    #     return instance


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
    # category_name = serializers.CharField(required=False)
    # host = StringRelatedField()
    host_name = SerializerMethodField()
    category = StringRelatedField()
    school_names = SerializerMethodField()
    participants = SerializerMethodField()
    host_profile_pic = SerializerMethodField()

    class Meta:
        model = Room
        fields = '__all__'

    def get_number_of_participants(self, obj):
        return obj.participant_set.all().count()

    def get_school_names(self, obj):
        return [school.name for school in obj.school.all()]

    def get_host_name(self, obj):
        return obj.host.username

    def get_participants(self, obj):
        # participants = obj.participant_set.all()
        participants = Participant.objects.filter(room=obj)

        return [
            {
                "id": participant.user.id,
                "username": participant.user.username,
                "joined_at": participant.joined_at
            }
            for participant in participants
        ]

    def get_host_profile_pic(self, obj):
        user = obj.host
        profile_pic = user.profile_pic
        if profile_pic:  # Check if the profile picture exists
            with profile_pic.open(mode='rb') as f:
                encoded_image = b64encode(f.read()).decode('utf-8')
            return f"data:image/png;base64,{encoded_image}"
        else:
            # Return a default profile picture URL if the user has no profile picture
            return "path/to/default_profile_pic.png"


class CommentSerializer(ModelSerializer):
    # user = StringRelatedField()
    username = SerializerMethodField()
    room = StringRelatedField()
    parent_comment_details = SerializerMethodField()
    user_full_name = SerializerMethodField()
    user_profile_pic = SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'user', 'parent_comment', 'room', 'content',
            'updated', 'created', 'parent_comment_details', 'user_full_name',
            'user_profile_pic', 'username'
        ]

    def get_parent_comment_details(self, obj):
        if obj.parent_comment:
            parent_comment = Comment.objects.get(pk=obj.parent_comment.id)
            return {
                'id': parent_comment.id,
                'user': parent_comment.user.username,
                'content': parent_comment.content,
                'created': parent_comment.created,
            }
        return None

    def get_user_full_name(self, obj):
        user = User.objects.get(pk=obj.user.id)
        return user.full_name.title()

    def get_username(self, obj):
        user = User.objects.get(pk=obj.user.id)
        return user.username

    def get_user_profile_pic(self, obj):
        user = obj.user
        profile_pic = user.profile_pic
        if profile_pic:  # Check if the profile picture exists
            with profile_pic.open(mode='rb') as f:
                encoded_image = b64encode(f.read()).decode('utf-8')
            return f"data:image/png;base64,{encoded_image}"
        else:
            # Return a default profile picture URL if the user has no profile picture
            return "path/to/default_profile_pic.png"
        # User.objects.get(id=obj).profile_pic.serializer.ImageField(use_url=True)


class CommentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ['content', 'parent_comment']


class ParticipantSerializer(ModelSerializer):
    user = UserSerializer()
    room = RoomSerializer()

    class Meta:
        model = Participant
        fields = ['id', 'user', 'room', 'joined_at', 'is_admin']


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class SchoolSerializer(ModelSerializer):
    number_of_students = SerializerMethodField()

    class Meta:
        model = School
        fields = ['id', 'name', 'description', 'number_of_students']

    def get_number_of_students(self, obj):
        return obj.user_set.all().count()


class FollowSerializer(ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'


class ReportCategorySerializer(ModelSerializer):
    class Meta:
        model = ReportCategory
        fields = '__all__'


class ReportCommentSerializer(ModelSerializer):
    reporter_name = SerializerMethodField()
    category_name = SerializerMethodField()

    class Meta:
        model = ReportComment
        fields = '__all__'

    def get_reporter_name(self, obj):
        reporter = User.objects.get(id=obj.reporter.id)
        return reporter.username

    def get_category_name(self, obj):
        category = ReportCategory.objects.get(id=obj.category.id)
        return category.name


# inbox
class MessageSerializer(serializers.ModelSerializer):
    sender_name = SerializerMethodField()
    sender_full_name = SerializerMethodField()
    receiver_name = SerializerMethodField()
    receiver_full_name = SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_sender_name(self, obj):
        sender = User.objects.get(id=obj.sender.id)
        return sender.username

    def get_sender_full_name(self, obj):
        sender = User.objects.get(id=obj.sender.id)
        return sender.full_name

    def get_receiver_name(self, obj):
        receiver = User.objects.get(id=obj.receiver.id)
        return receiver.username

    def get_receiver_full_name(self, obj):
        receiver = User.objects.get(id=obj.receiver.id)
        return receiver.full_name
    
    # def get_sender_pic(self,obj):
    #     user = obj.user
    #     profile_pic = user.profile_pic
    #     if profile_pic:  # Check if the profile picture exists
    #         with profile_pic.open(mode='rb') as f:
    #             encoded_image = b64encode(f.read()).decode('utf-8')
    #         return f"data:image/png;base64,{encoded_image}"
    #     else:
    #         # Return a default profile picture URL if the user has no profile picture
    #         return "path/to/default_profile_pic.png"
