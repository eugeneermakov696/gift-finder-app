from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('presents.urls')),  # Includes your app endpoints at the root path
]
