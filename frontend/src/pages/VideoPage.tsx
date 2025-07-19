import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
	CalendarDaysIcon,
	EyeIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import type { YouTubeVideoDetail } from "../types";

export default function VideoPage() {
	const { videoId } = useParams<{ videoId: string }>();
	const [video, setVideo] = useState<YouTubeVideoDetail | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!videoId) {
			return;
		}
		axios
			.get<YouTubeVideoDetail>(`/api/videos/${videoId}/`)
			.then((response) => {
				setVideo(response.data);

				const {
					youtube_id,
					title,
					thumbnail_url,
					channel_name,
					channel_id,
				} = response.data;
				axios
					.post("/api/history/", {
						youtube_id,
						title,
						thumbnail_url,
						channel_name,
						channel_id,
					})
					.catch((err) => {
						console.error(
							"Failed to log video to history:",
							err.response?.data || err.message
						);
					});
			})
			.finally(() => setLoading(false));
	}, [videoId]);

	if (loading) {
		return <p className="text-center mt-4 text-gray-500">Loading...</p>;
	}
	if (!video) {
		return (
			<p className="text-center mt-4 text-gray-500">Video not found</p>
		);
	}

	const publishedDate = new Date(video.published_at).toLocaleDateString();
	const views = video.view_count.toLocaleString();
	const likes = video.like_count.toLocaleString();

	return (
		<div className="p-4 max-w-screen-lg mx-auto">
			<div className="w-full aspect-video">
				<iframe
					title={video.title}
					src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}?rel=0`}
					allowFullScreen
					className="w-full h-full rounded-lg shadow"
				/>
			</div>

			<h1 className="mt-4 text-3xl font-semibold">{video.title}</h1>

			<div className="mt-2 flex items-center space-x-3">
				<img
					src={video.channel_icon_url}
					alt="rip :("
					className="w-10 h-10 rounded-full object-cover"
				/>
				<p className="text-lg font-medium">{video.channel_name}</p>
			</div>

			<div className="mt-4 flex flex-wrap items-center text-gray-600 dark:text-gray-300 space-x-6 text-sm">
				<div className="flex items-center space-x-1">
					<CalendarDaysIcon className="w-5 h-5" />
					<span>{publishedDate}</span>
				</div>
				<div className="flex items-center space-x-1">
					<EyeIcon className="w-5 h-5" />
					<span>{views}</span>
				</div>
				<div className="flex items-center space-x-1">
					<HandThumbUpIcon className="w-5 h-5" />
					<span>{likes}</span>
				</div>
			</div>

			<div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200">
				<p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
					{video.description}
				</p>
			</div>
		</div>
	);
}
