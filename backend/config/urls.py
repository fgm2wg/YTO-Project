from django.contrib import admin
from django.urls import path
from core.views import YouTubeSearchView, YouTubeDetailView, YouTubeTrendingView, YouTubeChannelView, WatchedVideoListCreateView, WatchedVideoDeleteView, WatchedVideoClearAllView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/search/', YouTubeSearchView.as_view()),
    path('api/videos/<str:video_id>/', YouTubeDetailView.as_view()),
    path('api/trending/', YouTubeTrendingView.as_view()),
    path('api/channel/<str:channel_id>/', YouTubeChannelView.as_view()),
    path('api/history/', WatchedVideoListCreateView.as_view()),
    path('api/history/clear/', WatchedVideoClearAllView.as_view()),
    path('api/history/<str:youtube_id>/', WatchedVideoDeleteView.as_view()),
]
