import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from decouple import config
from .serializers import YouTubeResultSerializer

# Class to return list of youtube videos from video title search
class YouTubeSearchView(APIView):
    def get(self, request):
        # Get search query from the URL (?q=...). If not included then return 400 error
        search_query = request.query_params.get('q', '')
        if not search_query:
            return Response({"error":"q parameter required"}, status=400)
        
        # Load YT API key from .env file (max 10,000 daily calls)
        api_key = config('YOUTUBE_API_KEY')
        
        # Build API request URL & params
        url = 'https://www.googleapis.com/youtube/v3/search'
        params = {
            'part': 'snippet',
            'q': search_query,
            'maxResults': 10,
            'type': 'video',
            'key': api_key
        }
        
        # Call YT Data API and parse JSON response
        # Example response structure:
        # {
        #   "items": [
        #     {
        #       "id": {"videoId": "abc123"},
        #       "snippet": {
        #         "title": "Video Title",
        #         "description": "Video description…",
        #         "thumbnails": {
        #           "default": {"url": "https://…/default.jpg"},
        #           "medium": { … },
        #           "high": { … }
        #         },
        #         …
        #       }
        #     },
        #     …
        #   ]
        # }
        response = requests.get(url, params=params).json()
        
        # Iterate through JSON data and extract necessary info for serializer
        results = []
        for item in response.get('items', []):
            # Extract YT video ID if in the item
            id_object = item.get('id', {})
            youtube_id = id_object.get('videoId')
            # Skip items without YT video ID
            if not youtube_id:
                continue
            
            # Extract snippet object that holds relevant metadata
            snippet = item['snippet']
            # Build simplified dictionary for serializer
            results.append({
                'youtube_id': youtube_id, # YT video ID
                'title': snippet['title'], # Video title
                'thumbnail_url': snippet['thumbnails']['default']['url'], # Default thumbnail URL
                'description': snippet['description'] # Video description
            })
        # Serialize and return the results
        data = YouTubeResultSerializer(results, many=True).data
        return Response(data)