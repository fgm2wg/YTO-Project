import { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/solid";
import type { WatchedVideo } from "../types";
import { formatDistanceToNow } from "date-fns";

function formatDateWithDistance(dateString: string | null): string {
	if (!dateString) {
		return "—";
	}

	const date = new Date(dateString);
	const absolute = date.toLocaleString();
	const relative = formatDistanceToNow(date, { addSuffix: true });

	return `${absolute} (${relative})`;
}

export default function HistoryPage() {
	const [videos, setVideos] = useState<WatchedVideo[]>([]);
	const [query, setQuery] = useState("");

	const fetchHistory = async () => {
		const url = query.trim()
			? `/api/history/?q=${encodeURIComponent(query)}`
			: `/api/history/`;

		try {
			const response = await axios.get(url);
			setVideos(response.data);
		} catch (error) {
			console.error("Failed to fetch history:", error);
			setVideos([]);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, [query]);

	const handleDelete = async (youtube_id: string) => {
		try {
			await axios.delete(`/api/history/${youtube_id}/`);
			await fetchHistory();
		} catch (error) {
			console.error(`Failed to delete video ${youtube_id}:`, error);
			alert("Failed to delete video. Please try again.");
		}
	};

	const handleClear = async () => {
		if (!confirm("Are you sure you want to clear all history?")) {
			return;
		}

		try {
			await axios.delete(`/api/history/clear/`);
			setVideos([]);
		} catch (error) {
			console.error("Failed to clear history:", error);
			alert("Failed to clear history. Please try again.");
		}
	};

	return (
		<div className="max-w-screen-lg mx-auto">
			<h1 className="text-3xl font-semibold mb-6">Watch History</h1>

			<div className="flex mb-4 space-x-2">
				<input
					type="text"
					placeholder="Search history..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
				/>
				<button
					onClick={handleClear}
					className="px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm"
				>
					Clear All
				</button>
			</div>

			<ul className="space-y-4">
				{videos.map((video) => (
					<li
						key={video.youtube_id}
						className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
					>
						<a
							href={`/video/${video.youtube_id}`}
							className="block w-40 h-[5.625rem] flex-shrink-0"
						>
							<img
								src={video.thumbnail_url}
								alt={video.title}
								className="w-full h-full object-cover rounded"
							/>
						</a>
						<div className="flex-1">
							<p className="font-medium text-body text-lg">
								{video.title}
							</p>
							<p className="text-gray-500 dark:text-gray-400 text-sm">
								{video.channel_name}
							</p>
							<div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
								<div>
									<p className="font-medium text-gray-600 dark:text-gray-300">
										Last Watched
									</p>
									<p>
										{formatDateWithDistance(
											video.last_watched_at
										)}
									</p>
								</div>
								<div>
									<p className="font-medium text-gray-600 dark:text-gray-300">
										First Watched
									</p>
									<p>
										{formatDateWithDistance(
											video.first_watched_at
										)}
									</p>
								</div>
								<div>
									<p className="font-medium text-gray-600 dark:text-gray-300">
										Previously Watched
									</p>
									<p>
										{formatDateWithDistance(
											video.previously_watched_at
										)}
									</p>
								</div>
								<div>
									<p className="font-medium text-gray-600 dark:text-gray-300">
										Times Watched
									</p>
									<p>{video.times_watched}</p>
								</div>
							</div>
						</div>
						<button
							onClick={() => handleDelete(video.youtube_id)}
							className="text-red-500 hover:text-red-600 p-2"
							title="Remove from history"
						>
							<TrashIcon className="w-6 h-6" />
						</button>
					</li>
				))}
				{videos.length === 0 && (
					<p className="text-center text-gray-500 dark:text-gray-400 mt-8">
						No watch history yet.
					</p>
				)}
			</ul>
		</div>
	);
}
