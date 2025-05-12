from rest_framework import serializers

# Serializer for defining structure of YT search results
class YouTubeResultSerializer(serializers.Serializer):
    youtube_id = serializers.CharField() # YT video ID
    title = serializers.CharField() # Video title
    thumbnail_url = serializers.CharField() # URL for video thumbnail (.jpg)
    channel_name = serializers.CharField() # YT channel name

# Serializer for defining structure of YT video detailed view
class YouTubeVideoDetailSerializer(serializers.Serializer):
    youtube_id = serializers.CharField() # YT video ID
    title = serializers.CharField() # Video title
    thumbnail_url = serializers.CharField() # URL for video thumbnail (.jpg)
    channel_name = serializers.CharField() # YT channel name
    description = serializers.CharField() # Video description