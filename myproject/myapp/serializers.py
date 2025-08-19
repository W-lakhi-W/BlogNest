# from rest_framework import serializers
# from .models import Blog,User
# from django.contrib.auth import authenticate





# class BlogSerializer(serializers.ModelSerializer):
#     owner = serializers.StringRelatedField()

#     class Meta:
#         model = Blog
#         fields = ['owner','id','title','content']
#         read_only_fields = ['owner']

#         extra_kwargs = {
#             'owner': {'required': False}
#         }
    
#     def create(self, validated_data):
#         user = self.context['request'].user
#         return Blog.objects.create(owner=user, **validated_data)
    

# class RegisterationSerializer(serializers.ModelSerializer):
    
#     password2 = serializers.CharField(required=True,write_only=True)

#     class Meta:
#         model = User
#         fields = [
#             'username',
#             'email',
#             'password',
#             'password2'
#         ]

#         extra_kwargs = {
#             'email': {'required': True}
#         }
        
    
#     def validate(self, attrs):

#         if attrs['password'] != attrs['password2']:
#             raise serializers.ValidationError({'message':'passwords are not matching'})
#         return attrs
    
#     def create(self, validated_data):
#         username = validated_data['username']
#         password = validated_data['password']
#         email = validated_data['email']
        
#         return User.objects.create_user(username=username,password=password,email=email)
    

# class LoginSerializer(serializers.Serializer):

#     username = serializers.CharField(required=True)
#     password = serializers.CharField(required=True)

#     def validate(self, attrs):

#         username = attrs.get('username')
#         password = attrs.get('password')

#         user = authenticate(username=username,password=password)


#         if not user:
#             raise serializers.ValidationError("invalid credentials")
        
#         attrs[
#             'user'
#         ] = user

#         return attrs

# class DetailSerializer(serializers.ModelSerializer):

#     owner = serializers.SerializerMethodField()

#     class Meta:
#         model = Blog
#         fields = ['title','content','owner']
    
#     def get_owner(self,obj):
#         return obj.owner.username
    

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Blog
import re

User = get_user_model()

# --- Common validation mixins ---

class TitleContentValidationMixin:
    """Reusable validation logic for 'title' and 'content' fields."""

    def validate_title(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("Title cannot be empty.")
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value

    def validate_content(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("Content cannot be empty.")
        return value

# --- Serializers ---

class BlogSerializer(TitleContentValidationMixin, serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Blog
        fields = ['owner', 'id', 'title', 'content']
        read_only_fields = ['owner']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data.pop('owner', None)  # remove 'owner' if exists to avoid duplicates
        return Blog.objects.create(owner=user, **validated_data)


class RegisterationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'email': {'required': True},
            'password': {'write_only': True},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters.")
        return value

    def validate_email(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("This field cannot be empty.")

        # Simple regex for email validation
        email_regex = r"(^[\w\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}$)"

        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address.")
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'message': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2', None)  # Remove password2 before creating user
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        attrs['user'] = user
        return attrs

class DetailSerializer(TitleContentValidationMixin, serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ['title', 'content', 'owner','id']

    def get_owner(self, obj):
        return getattr(obj.owner, 'username', None)
