import html
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from decouple import config
from .serializers import YouTubeResultSerializer, YouTubeVideoDetailSerializer

# Class to return list of YT videos from video title search
class YouTubeSearchView(APIView):
    def get(self, request):
        # Get search query from the URL (?q=...). If not included then return 400 error
        search_query = request.query_params.get('q', '')
        page_token = request.query_params.get('pageToken', None)
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
        
        if page_token:
            params['pageToken'] = page_token
        
        # Call YT Data API and parse JSON response
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
            
            # Pick best thumbnail (maxres > high > default)
            thumbnails = snippet.get('thumbnails', {})
            thumbnail_url = (
                thumbnails.get('maxres', {}).get('url')
                or thumbnails.get('high', {}).get('url')
                or thumbnails.get('default', {}).get('url')
                or ''
            )
        
            # Build simplified dictionary for serializer
            results.append({
                'youtube_id': youtube_id, # YT video ID
                'title': html.unescape(snippet.get('title', '')), # Video title
                'thumbnail_url': thumbnail_url, # Default thumbnail URL
                'channel_name': html.unescape(snippet.get('channelTitle','')) # YT channel name
            })
            
        # Serialize and return the results
        data = YouTubeResultSerializer(results, many=True).data
        next_page_token = response.get('nextPageToken')
        
        return Response({
            'results': data,
            'nextPageToken': next_page_token
        })
    
    
# Class to return detailed YT video with full description
class YouTubeDetailView(APIView):
    def get(self, request, video_id):
        # Load YT API key from .env file (max 10,000 daily calls)
        api_key = config('YOUTUBE_API_KEY')
        
        # Build API request URL & params
        url = 'https://www.googleapis.com/youtube/v3/videos'
        params = {
            'part': 'snippet',
            'id': video_id,
            'key': api_key
        }
        
        # Call YT Data API and parse JSON response
        resp = requests.get(url, params=params).json()
        
        # Get the results and 404 error if no video found
        results = resp.get('items', [])
        if not results:
            return Response({"error":"video not found"}, status=404)

        # Extract snippet object that holds relevant metadata
        snippet = results[0].get('snippet', {})
        
        # Pick best thumbnail (maxres > high > default)
        thumbnails = snippet.get('thumbnails', {})
        thumbnail_url = thumbnails.get('maxres', {}).get('url') or thumbnails.get('high', {}).get('url') or thumbnails.get('default', {}).get('url') or ''
             
        # Build simplified dictionary for serializer
        detail = {
            'youtube_id': results[0]['id'], # YT video ID
            'title': html.unescape(snippet.get('title','')), # Video title
            'thumbnail_url': thumbnail_url, # Default thumbnail URL
            'channel_name': html.unescape(snippet.get('channelTitle','')), # YT channel name
            'description': html.unescape(snippet.get('description','')) # Video description
        }
        # Serialize and return the results
        data = YouTubeVideoDetailSerializer(detail).data
        return Response(data)
