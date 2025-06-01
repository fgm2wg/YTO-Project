import { useEffect, useState, useRef } from "react";
import axios from "axios";
import type { YouTubeResult } from "../types";
import VideoCard from "./VideoCard";

interface Props {
	infiniteScrollEnabled: boolean;
}

export default function VideoGrid({ infiniteScrollEnabled }: Props) {
	const [videos, setVideos] = useState<YouTubeResult[]>([]);
	const [nextPage, setNextPage] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const loaderRef = useRef<HTMLDivElement | null>(null);

	const fetchTrending = async (pageToken?: string) => {
		setLoading(true);

		try {
			const params: any = {};
			if (pageToken) {
				params.pageToken = pageToken;
			}
			const { data } = await axios.get("/api/trending/", { params });

			if (!pageToken) {
				setVideos(data.results);
			} else {
				setVideos((prev) => [...prev, ...data.results]);
			}
			setNextPage(data.nextPageToken || null);
		} catch (err) {
			console.error("Error fetching trending videos:", err);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchTrending();
	}, []);

	useEffect(() => {
		if (!infiniteScrollEnabled) {
			return;
		}
		if (!loaderRef.current) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && nextPage && !loading) {
					fetchTrending(nextPage);
				}
			},
			{ root: null, rootMargin: "200px", threshold: 0 }
		);

		observer.observe(loaderRef.current);
		return () => observer.disconnect();
	}, [nextPage, loading]);

	if (loading && videos.length === 0) {
		return (
			<div className="fixed inset-x-0 mt-4 flex justify-center">
				<p className="text-gray-500">Loading recommendations…</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100 dark:bg-gray-900">
				{videos.map((v) => (
					<VideoCard key={v.youtube_id} video={v} variant="grid" />
				))}
			</div>

			{infiniteScrollEnabled && <div ref={loaderRef} />}

			{infiniteScrollEnabled && loading && videos.length > 0 && (
				<p className="text-center text-gray-500 py-4">Loading more…</p>
			)}
		</>
	);
}
