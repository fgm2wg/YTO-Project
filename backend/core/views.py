import html
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from decouple import config
from .serializers import YouTubeResultSerializer, YouTubeVideoDetailSerializer

class YouTubeSearchView(APIView):
    def get(self, request):
        search_query = request.query_params.get('q', '')
        page_token = request.query_params.get('pageToken', None)
        if not search_query:
            return Response({"error":"q parameter required"}, status=400)
        
        api_key = config('YOUTUBE_API_KEY')
        
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
        
        response = requests.get(url, params=params).json()
        
        results = []
        for item in response.get('items', []):
            id_object = item.get('id', {})
            youtube_id = id_object.get('videoId')
            if not youtube_id:
                continue
            
            snippet = item['snippet']
            
            thumbnails = snippet.get('thumbnails', {})
            thumbnail_url = (
                thumbnails.get('maxres', {}).get('url')
                or thumbnails.get('high', {}).get('url')
                or thumbnails.get('default', {}).get('url')
                or ''
            )
        
            results.append({
                'youtube_id': youtube_id,
                'title': html.unescape(snippet.get('title', '')),
                'thumbnail_url': thumbnail_url,
                'channel_name': html.unescape(snippet.get('channelTitle', ''))
            })
            
        data = YouTubeResultSerializer(results, many=True).data
        next_page_token = response.get('nextPageToken')
        
        return Response({
            'results': data,
            'nextPageToken': next_page_token
        })
    
    
class YouTubeDetailView(APIView):
    def get(self, request, video_id):
        api_key = config('YOUTUBE_API_KEY')
        
        url = 'https://www.googleapis.com/youtube/v3/videos'
        params = {
            'part': 'snippet',
            'id': video_id,
            'key': api_key
        }
        
        resp = requests.get(url, params=params).json()
        
        results = resp.get('items', [])
        if not results:
            return Response({"error":"video not found"}, status=404)

        snippet = results[0].get('snippet', {})
        
        thumbnails = snippet.get('thumbnails', {})
        thumbnail_url = (
            thumbnails.get('maxres', {}).get('url')
            or thumbnails.get('high', {}).get('url')
            or thumbnails.get('default', {}).get('url')
            or ''
        )
             
        detail = {
            'youtube_id': results[0]['id'],
            'title': html.unescape(snippet.get('title', '')),
            'thumbnail_url': thumbnail_url,
            'channel_name': html.unescape(snippet.get('channelTitle', '')),
            'description': html.unescape(snippet.get('description', ''))
        }
        data = YouTubeVideoDetailSerializer(detail).data
        return Response(data)
