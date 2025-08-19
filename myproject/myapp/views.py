# from django.shortcuts import render,get_object_or_404
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Blog,User
# from .serializers import BlogSerializer,RegisterationSerializer,LoginSerializer,DetailSerializer
# from rest_framework.views import APIView
# from django.http import Http404
# from rest_framework.permissions import IsAuthenticated
# from .permissions import IsOwnerOrReadOnly
# from rest_framework_simplejwt.tokens import RefreshToken

# # Create your views here.
# class RegisterView(APIView):

#     def post(self,request):
#         serializer = RegisterationSerializer(data = request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message':"User is created Successfully"},status=status.HTTP_201_CREATED)
#         return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# class LoginView(APIView):

#     def post(self,request):
#         serializer = LoginSerializer(data = request.data)
#         if serializer.is_valid():
            
#             user = serializer.validated_data['user']
#             refresh = RefreshToken.for_user(user)

#             return Response(
#                 {
#                     "refresh":str(refresh),
#                     "access":str(refresh.access_token),
#                     'username': user.username,
#                 },
#                 status=status.HTTP_200_OK
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class BlogView(APIView):

#     permission_classes = [IsOwnerOrReadOnly]

#     def get(self,request):

#         obj = Blog.objects.all()

#         serializer = BlogSerializer(obj,many=True)

#         return Response(serializer.data,status=status.HTTP_200_OK)
    
#     def post(self,request):

#         print(request.FILES)

#         serializer = BlogSerializer(data = request.data,context={'request': request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data,status=status.HTTP_201_CREATED)
#         return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
# class EditBlog(APIView):

#     permission_classes = [IsAuthenticated,IsOwnerOrReadOnly]

#     def get_object(self, pk):
#         try:
#             return Blog.objects.get(pk=pk)
#         except Blog.DoesNotExist:
#             raise Http404

#     def get(self,request,pk):
#         blog = self.get_object(pk)

#         serializer = BlogSerializer(blog)
#         return Response(serializer.data)

    
#     def put(self,request,pk):
#         blog = self.get_object(pk)
#         self.check_object_permissions(request, blog)
#         serializer = BlogSerializer(blog, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def delete(self,request,pk):
#         blog = self.get_object(pk=pk)
#         self.check_object_permissions(request, blog)
#         blog.delete()
#         return Response({"message": "Blog deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


# class BlogDetail(APIView):
#     permission_classes = [IsOwnerOrReadOnly]
#     def get_object(self, pk):
#         try:
#             return Blog.objects.get(pk=pk)
#         except Blog.DoesNotExist:
#             raise Http404
    
#     def get(self,request,pk):
#         blog = self.get_object(pk=pk)
#         self.check_object_permissions(request, blog)
#         serializer = DetailSerializer(blog)
#         return Response(serializer.data)

# class DashboardBlogs(APIView):

#     permission_classes = [IsAuthenticated]
#     def get(self,request):
#         blogs = Blog.objects.filter(owner=self.request.user)
#         serializer = BlogSerializer(blogs,many=True)
#         return Response(serializer.data)

from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Blog
from .serializers import (
    BlogSerializer,
    RegisterationSerializer,
    LoginSerializer,
    DetailSerializer
)
from .permissions import IsOwnerOrReadOnly

from django.contrib.auth import get_user_model

User = get_user_model()

# --- User Registration ---
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': "User created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- User Login with JWT ---
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- Blog List & Create ---
class BlogListCreateView(generics.ListCreateAPIView):
    """
    GET: List all blogs
    POST: Create a blog (authenticated user only)
    """
    serializer_class = BlogSerializer
    queryset = Blog.objects.all().order_by('-created_at')
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

# --- Blog Retrieve, Update, Delete ---
class BlogRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a blog (detailed)
    PUT: Update a blog (owner only)
    DELETE: Delete a blog (owner only)
    """
    serializer_class = BlogSerializer
    queryset = Blog.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DetailSerializer
        return BlogSerializer

# --- Dashboard: User's Own Blogs ---
class DashboardBlogsView(generics.ListAPIView):
    """
    GET: List all blogs owned by the current authenticated user.
    """
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Blog.objects.filter(owner=self.request.user)

# --- Optionally, if you need a simple blog Detail as in BlogDetail ---
class BlogDetailView(APIView):
    permission_classes = [IsOwnerOrReadOnly]

    def get(self, request, pk):
        blog = get_object_or_404(Blog, pk=pk)
        self.check_object_permissions(request, blog)
        serializer = DetailSerializer(blog)
        return Response(serializer.data)

