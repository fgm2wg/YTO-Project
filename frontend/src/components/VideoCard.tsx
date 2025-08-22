import type { YouTubeResult } from "../types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DownloadButton from "./DownloadButton";

interface Props {
	video: YouTubeResult;
	variant?: "row" | "grid";
}

export default function VideoCard({ video, variant = "row" }: Props) {
	const location = useLocation();
	const navigate = useNavigate();
	const to = `${variant === "grid" ? "" : ""}/video/${video.youtube_id}${
		location.search
	}`;

	if (variant === "grid") {
		return (
			<Link
				to={to}
				className="block bg-gray-100 dark:bg-gray-900 rounded-lg hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 relative"
			>
				<div className="w-full aspect-video rounded-t-lg overflow-hidden relative">
					<img
						src={video.thumbnail_url}
						alt="rip :("
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="p-2 flex items-start justify-between">
					<div>
						<h3 className="text-md font-medium">{video.title}</h3>
						<span
							className="text-sm text-gray-500 dark:text-gray-400 mt-1 hover:underline cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								navigate(`/channel/${video.channel_id}`);
							}}
						>
							{video.channel_name}
						</span>
					</div>
					<DownloadButton youtubeId={video.youtube_id} />
				</div>
			</Link>
		);
	}

	return (
		<Link
			to={to}
			className="w-full flex items-start space-x-4 p-4 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md relative"
		>
			<div className="w-125 aspect-video flex-shrink-0">
				<img
					src={video.thumbnail_url}
					alt="rip :("
					className="w-full h-full object-cover rounded"
				/>
			</div>
			<div className="flex-1 flex items-start justify-between">
				<div>
					<h3 className="text-lg font-medium">{video.title}</h3>
					<span
						className="text-sm text-gray-500 dark:text-gray-400 hover:underline cursor-pointer"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							navigate(`/channel/${video.channel_id}`);
						}}
					>
						{video.channel_name}
					</span>
				</div>
				<DownloadButton youtubeId={video.youtube_id} />
			</div>
		</Link>
	);
}
