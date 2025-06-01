import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { YouTubeResult } from "../types";
import VideoCard from "../components/VideoCard";
import type { YouTubeChannelInfo } from "../types";

export default function ChannelPage() {
	const { channelId } = useParams<{ channelId: string }>();
	const [channel, setChannel] = useState<YouTubeChannelInfo | null>(null);
	const [videos, setVideos] = useState<YouTubeResult[]>([]);
	const [nextPage, setNextPage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const loaderRef = useRef<HTMLDivElement | null>(null);

	const fetchChannel = async (pageToken?: string) => {
		if (!channelId) {
			return;
		}
		setLoading(true);

		const params: any = {};
		if (pageToken) {
			params.pageToken = pageToken;
		}

		try {
			const { data } = await axios.get(`/api/channel/${channelId}/`, {
				params,
			});

			if (!pageToken) {
				setChannel(data.channel);
				setVideos(data.videos);
			} else {
				setVideos((prev) => [...prev, ...data.videos]);
			}

			setNextPage(data.nextPageToken || null);
		} catch (err) {
			console.error("Error fetching channel:", err);
		}

		setLoading(false);
	};

	useEffect(() => {
		if (!channelId) {
			return;
		}
		setVideos([]);
		setNextPage(null);
		fetchChannel();
	}, [channelId]);

	useEffect(() => {
		if (!loaderRef.current) {
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && nextPage && !loading) {
					fetchChannel(nextPage);
				}
			},
			{ root: null, rootMargin: "200px", threshold: 0 }
		);

		observer.observe(loaderRef.current);
		return () => observer.disconnect();
	}, [nextPage, loading]);

	if (!channel) {
		return (
			<div className="fixed inset-x-0 mt-4 flex justify-center">
				<p className="text-gray-500">Loading channel info…</p>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-md">
				{channel.thumbnail_url && (
					<img
						src={channel.thumbnail_url}
						alt={`${channel.title} icon`}
						className="w-20 h-20 rounded-full object-cover"
					/>
				)}
				<div>
					<h1 className="text-2xl font-semibold">{channel.title}</h1>
					<p className="text-sm text-gray-500">
						{channel.subscriber_count.toLocaleString()} subscribers
					</p>
				</div>
			</div>

			{channel.description && (
				<div className="p-4 mb-4 bg-gray-100 dark:bg-gray-900 rounded-md">
					<p className="text-sm whitespace-pre-line">
						{channel.description}
					</p>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-md">
				{videos.map((video) => (
					<VideoCard
						key={video.youtube_id}
						video={video}
						variant="grid"
					/>
				))}
			</div>

			<div ref={loaderRef} />

			{loading && (
				<div className="fixed inset-x-0 -mt-4 flex justify-center">
					<p className="text-gray-500">Loading more…</p>
				</div>
			)}
		</div>
	);
}
