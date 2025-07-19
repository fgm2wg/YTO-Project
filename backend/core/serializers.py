from rest_framework import serializers
from .models import WatchedVideo

class YouTubeResultSerializer(serializers.Serializer):
    youtube_id = serializers.CharField()
    title = serializers.CharField()
    thumbnail_url = serializers.CharField()
    channel_name = serializers.CharField()
    channel_id = serializers.CharField()

class YouTubeVideoDetailSerializer(serializers.Serializer):
    youtube_id = serializers.CharField()
    title = serializers.CharField()
    thumbnail_url = serializers.CharField()
    channel_name = serializers.CharField()
    channel_id = serializers.CharField()
    description = serializers.CharField()
    channel_icon_url = serializers.CharField()
    view_count = serializers.IntegerField()
    like_count = serializers.IntegerField()
    published_at = serializers.DateTimeField()
    
class YouTubeChannelSerializer(serializers.Serializer):
    channel_id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    thumbnail_url = serializers.CharField(allow_null=True)
    subscriber_count = serializers.IntegerField()
    uploads_playlist = serializers.CharField()

class WatchedVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchedVideo
        fields = '__all__'