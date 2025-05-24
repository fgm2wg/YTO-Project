import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import type { YouTubeVideoDetail } from "../types";

export default function VideoPage() {
	const { videoId } = useParams<{ videoId: string }>();
	const [video, setVideo] = useState<YouTubeVideoDetail | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!videoId) return;
		axios
			.get<YouTubeVideoDetail>(`/api/videos/${videoId}/`)
			.then((r) => setVideo(r.data))
			.finally(() => setLoading(false));
	}, [videoId]);

	if (loading) return <p className="p-4">Loading…</p>;
	if (!video) return <p className="p-4">Video not found.</p>;

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
				<div className="w-10 h-10 bg-gray-300 rounded-full" />
				<p className="text-lg font-medium">{video.channel_name}</p>
			</div>

			<div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
				<p className="whitespace-pre-wrap text-gray-700">
					{video.description}
				</p>
			</div>
		</div>
	);
}
