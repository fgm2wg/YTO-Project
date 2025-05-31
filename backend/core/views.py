import html
import requests
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.views import APIView
from rest_framework.response import Response
from decouple import config
from .serializers import YouTubeResultSerializer, YouTubeVideoDetailSerializer

@method_decorator(cache_page(60 * 2), name="dispatch")
class YouTubeSearchView(APIView):
    def get(self, request):
        search_query = request.query_params.get('q', '')
        page_token = request.query_params.get('pageToken', None)
        if not search_query:
            return Response({"error":"q parameter required"}, status=400)
        
        api_key = config('YOUTUBE_API_KEY')
        
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            'part': 'snippet',
            'q': search_query,
            'maxResults': 10,
            'type': 'video',
            'key': api_key,
            'fields': (
                'items('
                  'id/videoId,'
                  'snippet(title,channelTitle,thumbnails(high(url)))'
                '),'
                'nextPageToken'
            )
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
            thumbnail_url = thumbnails.get('high', {}).get('url')
        
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
    

@method_decorator(cache_page(60 * 10), name="dispatch")
class YouTubeDetailView(APIView):
    def get(self, request, video_id):
        api_key = config('YOUTUBE_API_KEY')
        
        url = 'https://www.googleapis.com/youtube/v3/videos'
        params = {
            'part': 'snippet,statistics',
            'id': video_id,
            'key': api_key,
            "fields": (
                "items("
                  "id,"
                  "snippet(title,description,channelTitle,channelId,"
                          "publishedAt,thumbnails(maxres(url))),"
                  "statistics(viewCount,likeCount)"
                ")"
            )
        }
        
        response = requests.get(url, params=params).json()
        
        results = response.get('items', [])
        if not results:
            return Response({"error":"video not found"}, status=404)

        video_data = results[0]
        snippet = video_data.get('snippet', {})
        statistics = video_data.get('statistics', {})
        
        thumbnails = snippet.get('thumbnails', {})
        thumbnail_url = thumbnails.get('maxres', {}).get('url')
        
        view_count = int(statistics.get('viewCount', 0))
        like_count = int(statistics.get('likeCount', 0))
        published_at = snippet.get('publishedAt')
        
        channel_icon_url = ''
        channel_id = snippet.get('channelId')
        if channel_id:
            url = 'https://www.googleapis.com/youtube/v3/channels'
            params = {
                'part': 'snippet',
                'id': channel_id,
                'key': api_key
            }
            response = requests.get(url, params=params).json()
            channel_results = response.get('items', [])
            if channel_results:
                channel_snippet = channel_results[0].get('snippet', {})
                channel_thumbnails = channel_snippet.get('thumbnails', {})
                channel_icon_url = channel_thumbnails.get('default', {}).get('url')

        detail = {
            'youtube_id': results[0]['id'],
            'title': html.unescape(snippet.get('title', '')),
            'thumbnail_url': thumbnail_url,
            'channel_name': html.unescape(snippet.get('channelTitle', '')),
            'description': html.unescape(snippet.get('description', '')),
            'channel_icon_url': channel_icon_url,
            'view_count': view_count,
            'like_count': like_count,
            'published_at': published_at
        }
        data = YouTubeVideoDetailSerializer(detail).data
        return Response(data)


@method_decorator(cache_page(60 * 5), name="dispatch")
class YouTubeTrendingView(APIView):
    def get(self, request):
        api_key = config("YOUTUBE_API_KEY")
        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            "part": "snippet",
            "chart": "mostPopular",
            "regionCode": "US",
            "maxResults": 12,
            "key": api_key,
            "fields": "items(id,snippet(title,channelTitle,thumbnails(standard(url))))"
        }
        resp = requests.get(url, params=params).json()
        items = resp.get("items", [])

        results = []
        for vid in items:
            snippet = vid["snippet"]
            thumbnail_url = snippet["thumbnails"]["standard"]["url"]
            results.append({
                "youtube_id": vid["id"],
                "title": html.unescape(snippet["title"]),
                "thumbnail_url": thumbnail_url,
                "channel_name": html.unescape(snippet["channelTitle"]),
            })

        data = YouTubeResultSerializer(results, many=True).data
        return Response({"results": data})