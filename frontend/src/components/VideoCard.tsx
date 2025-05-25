import type { YouTubeResult } from "../types";
import { Link } from "react-router-dom";

interface Props {
	video: YouTubeResult;
	variant?: "row" | "grid";
}

export default function VideoCard({ video, variant = "row" }: Props) {
	if (variant === "grid") {
		return (
			<Link
				to={`/video/${video.youtube_id}`}
				className="flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg"
			>
				<img
					src={video.thumbnail_url}
					alt={video.title}
					className="w-full h-auto object-cover"
				/>
				<div className="p-2">
					<h3 className="text-md font-medium">{video.title}</h3>
					<p className="text-xs text-gray-500 mt-1">
						{video.channel_name}
					</p>
				</div>
			</Link>
		);
	}

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
