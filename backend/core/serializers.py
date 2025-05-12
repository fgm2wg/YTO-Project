from rest_framework import serializers

# Serializer for defining structure of YT search results
class YouTubeResultSerializer(serializers.Serializer):
    # YT video ID
    youtube_id = serializers.CharField()
    # Video title
    title = serializers.CharField()
    # URL for video thumbnail (.jpg)
    thumbnail_url = serializers.CharField()
    # Video description
    description = serializers.CharField()