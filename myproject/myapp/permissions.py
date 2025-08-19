# permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow safe methods for anyone (GET)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Only allow owner to update/delete
        return obj.owner == request.user
