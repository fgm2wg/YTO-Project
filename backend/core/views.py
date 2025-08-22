import html
import requests
import threading
import re
from pathlib import Path
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from decouple import config
from .serializers import YouTubeResultSerializer, YouTubeVideoDetailSerializer, YouTubeChannelSerializer, WatchedVideoSerializer
from .models import WatchedVideo
from django.db.models import Q
from django.utils.timezone import now
from yt_dlp import YoutubeDL
from urllib.parse import urlparse, parse_qs
from uuid import uuid4

@method_decorator(cache_page(60 * 5), name="dispatch")
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
                  'snippet(title,channelTitle,channelId,thumbnails(maxres(url),standard(url),high(url),medium(url),default(url)))'
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
            channel_id = snippet.get('channelId')
            
            thumbnails = snippet.get('thumbnails', {})
            thumbnail_url = None
            for res in ["maxres", "standard", "high", "medium", "default"]:
                if res in thumbnails and thumbnails[res].get("url"):
                    thumbnail_url = thumbnails[res]["url"]
                    break
        
            results.append({
                'youtube_id': youtube_id,
                'title': html.unescape(snippet.get('title', '')),
                'thumbnail_url': thumbnail_url,
                'channel_name': html.unescape(snippet.get('channelTitle', '')),
                'channel_id': channel_id
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
                          "publishedAt,thumbnails(maxres(url),standard(url),high(url),medium(url),default(url))),"
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
        thumbnail_url = None
        for res in ["maxres", "standard", "high", "medium", "default"]:
            if res in thumbnails and thumbnails[res].get("url"):
                thumbnail_url = thumbnails[res]["url"]
                break
        
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
                'key': api_key,
                'fields': 'items(snippet(thumbnails(default(url),medium(url),high(url))))'
            }
            response = requests.get(url, params=params).json()
            channel_results = response.get('items', [])
            if channel_results:
                channel_snippet = channel_results[0].get('snippet', {})
                channel_thumbnails = channel_snippet.get('thumbnails', {})
                channel_icon_url = None
                for res in ["high", "medium", "default"]:
                    if res in channel_thumbnails and channel_thumbnails[res].get("url"):
                        channel_icon_url = channel_thumbnails[res]["url"]
                        break

        detail = {
            'youtube_id': results[0]['id'],
            'title': html.unescape(snippet.get('title', '')),
            'thumbnail_url': thumbnail_url,
            'channel_name': html.unescape(snippet.get('channelTitle', '')),
            'channel_id': channel_id,
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
        page_token = request.query_params.get('pageToken', None)
        params = {
            "part": "snippet",
            "chart": "mostPopular",
            "regionCode": "US",
            "maxResults": 12,
            "key": api_key,
            "fields": "items(id,snippet(title,channelTitle,channelId,thumbnails(maxres(url),standard(url),high(url),medium(url),default(url)))),nextPageToken"
        }
        
        if page_token:
            params['pageToken'] = page_token
        
        resp = requests.get(url, params=params).json()
        items = resp.get("items", [])

        results = []
        for vid in items:
            snippet = vid["snippet"]
            channel_id = snippet.get("channelId")
            
            thumbnails = snippet.get("thumbnails", {})
            thumbnail_url = None
            for res in ["maxres", "standard", "high", "medium", "default"]:
                if res in thumbnails and thumbnails[res].get("url"):
                    thumbnail_url = thumbnails[res]["url"]
                    break
                
            results.append({
                "youtube_id": vid["id"],
                "title": html.unescape(snippet["title"]),
                "thumbnail_url": thumbnail_url,
                "channel_name": html.unescape(snippet["channelTitle"]),
                "channel_id": channel_id
            })

        data = YouTubeResultSerializer(results, many=True).data
        return Response({
            "results": data,
            "nextPageToken": resp.get("nextPageToken")
        })
    
    
@method_decorator(cache_page(60 * 5), name="dispatch")
class YouTubeChannelView(APIView):
    def get(self, request, channel_id):
        api_key = config('YOUTUBE_API_KEY')
        
        url = 'https://www.googleapis.com/youtube/v3/channels'
        params = {
            'part': 'snippet,statistics,contentDetails',
            'id': channel_id,
            'key': api_key,
            'fields': 'items(snippet(title,description,thumbnails(default(url),medium(url),high(url))),statistics(subscriberCount),contentDetails(relatedPlaylists(uploads)))'
        }
        
        response = requests.get(url, params=params).json()
        results = response.get('items', [])
        if not results:
            return Response({"error": "channel not found"}, status=404)
        
        channel_data = results[0]
        snippet = channel_data.get('snippet', {})
        statistics = channel_data.get('statistics', {})
        uploads_playlist = channel_data.get('contentDetails', {}).get('relatedPlaylists', {}).get('uploads', '')
        
        thumbnails = snippet.get("thumbnails", {})
        thumbnail_url = None
        for res in ['high', 'medium', 'default']:
            if res in thumbnails and thumbnails[res].get('url'):
                thumbnail_url = thumbnails[res]['url']
                break
        
        channel_info = {
            'channel_id': channel_id,
            'title': html.unescape(snippet.get('title', '')),
            'description': html.unescape(snippet.get('description', '')),
            'thumbnail_url': thumbnail_url,
            'subscriber_count': int(statistics.get('subscriberCount', 0)),
            'uploads_playlist': uploads_playlist
        }
        
        url = 'https://www.googleapis.com/youtube/v3/playlistItems'
        page_token = request.query_params.get('pageToken', None)
        params = {
            'part': 'snippet,contentDetails',
            'playlistId': uploads_playlist,
            'maxResults': 12,
            'key': api_key,
            'fields': 'items(contentDetails(videoId),snippet(title,thumbnails(maxres(url),standard(url),high(url),medium(url),default(url)))),nextPageToken'
        }
        
        if page_token:
            params['pageToken'] = page_token
        
        response = requests.get(url, params=params).json()
        items = response.get('items', [])
        
        videos = []
        for item in items:
            video_id = item['contentDetails'].get('videoId')
            snippet = item.get('snippet', {})
            
            thumbnails = snippet.get("thumbnails", {})
            thumbnail_url = None
            for res in ['maxres', 'standard', 'high', 'medium', 'default']:
                if res in thumbnails and snippet['thumbnails'][res].get('url'):
                    thumbnail_url = snippet['thumbnails'][res]['url']
                    break
                
            videos.append({
                'youtube_id': video_id,
                'title': html.unescape(snippet.get('title', '')),
                'thumbnail_url': thumbnail_url,
                'channel_name': channel_info['title'],
                'channel_id': channel_id
            })
        
        next_page_token = response.get('nextPageToken')
        channel_data = YouTubeChannelSerializer(channel_info).data
        videos_data = YouTubeResultSerializer(videos, many=True).data

        return Response({
            'channel': channel_data,
            'videos': videos_data,
            'nextPageToken': next_page_token
        })

class WatchedVideoListCreateView(generics.ListCreateAPIView):
    serializer_class = WatchedVideoSerializer

    def get_queryset(self):
        query = self.request.query_params.get('q')
        query_set = WatchedVideo.objects.all().order_by('-last_watched_at')
        if query:
            query_set = query_set.filter(
                Q(title__icontains=query) |
                Q(channel_name__icontains=query)
            )
        return query_set
    
    def create(self, request, *args, **kwargs):
        data = request.data
        youtube_id = data.get("youtube_id")
        if not youtube_id:
            return Response({"error": "youtube_id is required"}, status=400)

        video = WatchedVideo.objects.filter(youtube_id=youtube_id).first()
        now_time = now()

        if video:
            video.times_watched += 1
            video.previously_watched_at = video.last_watched_at
            video.last_watched_at = now_time
            video.save()
        else:
            video = WatchedVideo.objects.create(
                youtube_id = youtube_id,
                title = data.get("title"),
                thumbnail_url = data.get("thumbnail_url"),
                channel_name = data.get("channel_name"),
                channel_id = data.get("channel_id"),
                times_watched = 1,
                last_watched_at = now_time,
                previously_watched_at = now_time,
                first_watched_at = now_time
            )

        serializer = self.get_serializer(video)
        return Response(serializer.data)

class WatchedVideoDeleteView(generics.DestroyAPIView):
    queryset = WatchedVideo.objects.all()
    lookup_field = 'youtube_id'

class WatchedVideoClearAllView(APIView):
    def delete(self, request):
        WatchedVideo.objects.all().delete()
        return Response(status=204)

class YouTubeDownloadView(APIView):
    def post(self, request):
        url = request.data.get("url")
        format = request.data.get("format", "video").lower()
        if not url:
            return Response({"error": "url is required"}, status=400)
        if format not in ["audio", "video"]:
            return Response({"error": "Invalid format. Choose 'audio' or 'video'."}, status=400)

        job_id = str(uuid4())
        cache.set(job_id, {"progress": "0%", "status": "downloading"}, timeout=300)

        def run_download():
            try:
                parsed = urlparse(url)
                query = parse_qs(parsed.query)
                youtube_id = query.get("v", [None])[0]
                if not youtube_id:
                    raise Exception("Could not extract video ID")

                project_root = Path(__file__).resolve().parent.parent.parent
                downloads_dir = project_root / "downloads"
                downloads_dir.mkdir(parents=True, exist_ok=True)
                
                outtmpl = str(downloads_dir / f"{youtube_id}-{format}.%(ext)s")
                actual_path = downloads_dir / f"{youtube_id}-{format}.webm"

                def progress_hook(d):
                    ANSI_ESCAPE = re.compile(r'\x1B[@-_][0-?]*[ -/]*[@-~]')
                    progress_str = ANSI_ESCAPE.sub('', d.get("_percent_str", "0.0%"))

                    stage = "audio" if format == "audio" else (
                        "video" if d.get("filename", "").endswith((".mp4", ".mkv", ".webm")) else "audio"
                    )
                    
                    cache.set(job_id, {
                        "progress": progress_str,
                        "status": "downloading",
                        "stage": stage
                    }, timeout=300)

                    if d['status'] == 'finished':
                        cache.set(job_id, {
                            "progress": "100%",
                            "status": "finished",
                            "url": f"/downloads/{youtube_id}-{format}.webm"
                        }, timeout=300)
                
                if actual_path.exists():
                    cache.set(job_id, {
                        "progress": "100%",
                        "status": "finished",
                        "url": f"/downloads/{youtube_id}-{format}.webm"
                    }, timeout=300)
                    return

                ydl_opts = {
                    'format': 'bestvideo+bestaudio/best',
                    'outtmpl': outtmpl,
                    'progress_hooks': [progress_hook],
                    'prefer_ffmpeg': True,
                }

                if format == "audio":
                    ydl_opts['format'] = 'bestaudio/best'

                with YoutubeDL(ydl_opts) as ydl:
                    ydl.download([url])

            except Exception as e:
                cache.set(job_id, {"status": "error", "error": str(e)}, timeout=300)

        threading.Thread(target=run_download).start()

        return Response({"job_id": job_id})
        
class YouTubeDownloadStatusView(APIView):
    def get(self, request, job_id):
        data = cache.get(job_id)
        if data is None:
            return Response({"error": "Job not found"}, status=404)
        return Response(data)
