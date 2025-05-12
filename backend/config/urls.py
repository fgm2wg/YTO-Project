from django.contrib import admin
from django.urls import path
from core.views import YouTubeSearchView, YouTubeDetailView

urlpatterns = [
    path('admin/', admin.site.urls), # URL path for Django admin site
    path('api/search/', YouTubeSearchView.as_view()), # URL path for search API endpoint, /api/search?q=...
    path('api/videos/<str:video_id>/', YouTubeDetailView.as_view()), # URL path for search API endpoint, /api/videos/<video_id>
]
