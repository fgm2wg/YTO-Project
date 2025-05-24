import type { YouTubeResult } from "../types";
import VideoCard from "./VideoCard";

interface Props {
	videos: YouTubeResult[];
}

export default function VideoList({ videos }: Props) {
	return (
		<div className="container mx-auto px-4 flex flex-col space-y-4">
			{videos.map((v) => (
				<VideoCard key={v.youtube_id} video={v} />
			))}
		</div>
	);
}
