import { useEffect, useState, useRef } from "react";
import axios from "axios";
import type { YouTubeResult } from "../types";
import VideoCard from "./VideoCard";

export default function VideoGrid() {
	const [videos, setVideos] = useState<YouTubeResult[]>([]);
	const [loading, setLoading] = useState(true);

	const loaderRef = useRef<HTMLDivElement | null>(null);

	const fetchTrending = async () => {
		setLoading(true);
		const { data } = await axios.get("/api/trending/");
		setVideos(data.results);
		setLoading(false);
	};

	useEffect(() => {
		fetchTrending();
	}, []);

	useEffect(() => {
		if (!loaderRef.current) {
			return;
		}
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !loading) {
				}
			},
			{ root: null, rootMargin: "200px", threshold: 0 }
		);
		obs.observe(loaderRef.current);
		return () => obs.disconnect();
	}, [loading]);

	if (loading) {
		return <p className="p-4">Loading recommendations…</p>;
	}
	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-white dark:bg-gray-900">
				{videos.map((v) => (
					<VideoCard key={v.youtube_id} video={v} variant="grid" />
				))}
			</div>
			<div ref={loaderRef} />
			{loading && (
				<p className="text-center text-gray-500 py-4">Loading…</p>
			)}
		</>
	);
}
