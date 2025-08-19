# from django.urls import path
# from .views import *
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

# from django.conf import settings
# from django.conf.urls.static import static




# urlpatterns = [
#     path('',BlogView.as_view()),
#     path('dashboard_blogs',DashboardBlogs.as_view()),
#     path('detail/<int:pk>',BlogDetail.as_view()),
#     path('edit/<int:pk>',EditBlog.as_view()),
#     path('delete/<int:pk>',EditBlog.as_view()),
#     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('register',RegisterView.as_view()),
#     path('login',LoginView.as_view()),
    

# ]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    BlogListCreateView,
    BlogRetrieveUpdateDeleteView,
    DashboardBlogsView,
    BlogDetailView,   # Optional, depending on whether you use detailed serializer
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Auth Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Blog Endpoints
    path('blogs/', BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', BlogRetrieveUpdateDeleteView.as_view(), name='blog-detail-update-delete'),

    # User Dashboard
    path('dashboard/blogs/', DashboardBlogsView.as_view(), name='dashboard-blogs'),

    # (OPTIONAL) If you want a separated detailed view, otherwise covered by <int:pk> above
    # path('blogs/<int:pk>/detail/', BlogDetailView.as_view(), name='blog-detail'),
]

# Serve media files in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
