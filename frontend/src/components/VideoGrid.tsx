import { useEffect, useState } from "react";
import axios from "axios";
import type { YouTubeResult } from "../types";
import VideoCard from "./VideoCard";

export default function VideoGrid() {
	const [videos, setVideos] = useState<YouTubeResult[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get("/api/search/", { params: { q: "trending", maxResults: 12 } })
			.then((r) => setVideos(r.data.results))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <p className="p-4">Loading recommendations…</p>;
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{videos.map((v) => (
				<VideoCard key={v.youtube_id} video={v} variant="grid" />
			))}
		</div>
	);
}
