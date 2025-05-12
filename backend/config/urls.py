from django.contrib import admin
from django.urls import path
from core.views import YouTubeSearchView

urlpatterns = [
    # URL path for Django admin site
    path('admin/', admin.site.urls),
    # URL path for search API endpoint, /api/search?q=...
    path('api/search/', YouTubeSearchView.as_view()),
]
