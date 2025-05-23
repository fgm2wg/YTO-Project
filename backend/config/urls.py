from django.contrib import admin
from django.urls import path
from core.views import YouTubeSearchView, YouTubeDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/search/', YouTubeSearchView.as_view()),
    path('api/videos/<str:video_id>/', YouTubeDetailView.as_view()),
]
