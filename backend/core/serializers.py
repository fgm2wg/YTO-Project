from rest_framework import serializers

class YouTubeResultSerializer(serializers.Serializer):
    youtube_id = serializers.CharField()
    title = serializers.CharField()
    thumbnail_url = serializers.CharField()
    channel_name = serializers.CharField()

class YouTubeVideoDetailSerializer(serializers.Serializer):
    youtube_id = serializers.CharField()
    title = serializers.CharField()
    thumbnail_url = serializers.CharField()
    channel_name = serializers.CharField()
    description = serializers.CharField()