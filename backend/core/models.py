from django.db import models

class WatchedVideo(models.Model):
    youtube_id = models.CharField(max_length=20, unique=True)
    title = models.TextField()
    thumbnail_url = models.URLField()
    channel_name = models.CharField(max_length=255)
    channel_id = models.CharField(max_length=255)
    
    times_watched = models.IntegerField(default=1)
    first_watched_at = models.DateTimeField(auto_now_add=True)
    last_watched_at = models.DateTimeField(auto_now=True)
    previously_watched_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.youtube_id})"
