import type { YouTubeResult } from "../types";
import { Link } from "react-router-dom";

interface Props {
	video: YouTubeResult;
}

export default function VideoCard({ video }: Props) {
	return (
		<Link
			to={`/video/${video.youtube_id}`}
			className="w-full flex items-start space-x-4 p-4 hover:bg-gray-100 rounded-md"
		>
			<div className="w-125 aspect-video flex-shrink-0">
				<img
					src={video.thumbnail_url}
					alt={video.title}
					className="w-full h-full object-cover rounded"
				/>
			</div>
			<div className="flex-1">
				<h3 className="text-lg font-medium">{video.title}</h3>
				<p className="text-sm text-gray-500">{video.channel_name}</p>
			</div>
		</Link>
	);
}
