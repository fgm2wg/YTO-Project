import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import axios from "axios";
import {
	PlusIcon,
	PencilSquareIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	TrashIcon,
	ArrowsRightLeftIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/solid";
import type { YouTubeResult, Playlist } from "../types";
import PlaylistPlayer from "../components/PlaylistPlayer";

export default function PlaylistsPage() {
	const [playlists, setPlaylists] = useState<Playlist[]>(() => {
		try {
			const stored = localStorage.getItem("ytPlaylists");
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	});

	const [activePlaylistId, setActivePlaylistId] = useState<string | null>(
		() => {
			try {
				return localStorage.getItem("ytActivePlaylist") || null;
			} catch {
				return null;
			}
		}
	);

	const [newName, setNewName] = useState("");
	const [videoInput, setVideoInput] = useState("");
	const [playerIndex, setPlayerIndex] = useState<number>(() => {
		try {
			const storedIdx = localStorage.getItem("ytPlayerIndex");
			return storedIdx ? Number(storedIdx) : 0;
		} catch {
			return 0;
		}
	});

	useEffect(() => {
		setPlayerIndex(0);
	}, [activePlaylistId]);

	const [isShuffling, setIsShuffling] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [shuffleResetKey, setShuffleResetKey] = useState<number>(0);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingValue, setEditingValue] = useState<string>("");

	useEffect(() => {
		try {
			localStorage.setItem("ytPlaylists", JSON.stringify(playlists));
		} catch {}
	}, [playlists]);

	useEffect(() => {
		try {
			if (activePlaylistId !== null) {
				localStorage.setItem("ytActivePlaylist", activePlaylistId);
			} else {
				localStorage.removeItem("ytActivePlaylist");
			}
		} catch {}
	}, [activePlaylistId]);

	useEffect(() => {
		try {
			localStorage.setItem("ytPlayerIndex", playerIndex.toString());
		} catch {}
	}, [playerIndex]);

	const activePlaylist =
		playlists.find((p) => p.id === activePlaylistId) || null;

	function handleCreatePlaylist() {
		if (!newName.trim()) {
			return;
		}
		const id = Date.now().toString();
		const next: Playlist = { id, name: newName.trim(), videos: [] };
		setPlaylists((prev) => [...prev, next]);
		setActivePlaylistId(id);
		setNewName("");
		setPlayerIndex(0);
	}

	function handleDeletePlaylist(id: string) {
		setPlaylists((prev) => prev.filter((p) => p.id !== id));
		if (id === activePlaylistId) {
			setActivePlaylistId(null);
			setPlayerIndex(0);
		}
	}

	function handleStartRename(id: string, currentName: string) {
		setEditingId(id);
		setEditingValue(currentName);
	}

	function commitRename() {
		if (editingId === null) {
			return;
		}
		const trimmed = editingValue.trim();
		if (!trimmed) {
			setEditingId(null);
			setEditingValue("");
			return;
		}
		setPlaylists((prev) =>
			prev.map((p) => (p.id === editingId ? { ...p, name: trimmed } : p))
		);
		setEditingId(null);
		setEditingValue("");
	}

	function onRenameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			commitRename();
		} else if (e.key === "Escape") {
			setEditingId(null);
			setEditingValue("");
		}
	}

	async function handleAddVideoToPlaylist(videoId: string) {
		if (!activePlaylist) {
			return;
		}
		const trimmed = videoId.trim();
		if (!trimmed) {
			return;
		}

		try {
			const response = await axios.get<{
				youtube_id: string;
				title: string;
				thumbnail_url: string;
				channel_name: string;
				channel_id: string;
			}>(`/api/videos/${trimmed}/`);

			const detail = response.data;

			const newVideo: YouTubeResult = {
				youtube_id: detail.youtube_id,
				title: detail.title,
				thumbnail_url: detail.thumbnail_url,
				channel_name: detail.channel_name,
				channel_id: detail.channel_id,
			};

			setPlaylists((prev) =>
				prev.map((p) =>
					p.id === activePlaylistId
						? { ...p, videos: [...p.videos, newVideo] }
						: p
				)
			);
			setVideoInput("");
		} catch (error) {
			console.error("Failed to fetch video details:", error);
			alert("Could not fetch video info. Check the ID and try again.");
		}
	}

	function handleRemoveVideo(index: number) {
		if (!activePlaylist) {
			return;
		}

		setPlaylists((prev) =>
			prev.map((p) => {
				if (p.id !== activePlaylistId) {
					return p;
				}
				const newVideos = [...p.videos];
				newVideos.splice(index, 1);
				return { ...p, videos: newVideos };
			})
		);

		if (index === playerIndex) {
			setPlayerIndex(0);
		}
	}

	function handleMoveVideo(oldIndex: number, direction: "up" | "down") {
		if (!activePlaylist) {
			return;
		}
		const newVideos = [...activePlaylist.videos];
		const target = direction === "up" ? oldIndex - 1 : oldIndex + 1;
		if (target < 0 || target >= newVideos.length) {
			return;
		}

		[newVideos[oldIndex], newVideos[target]] = [
			newVideos[target],
			newVideos[oldIndex],
		];

		setPlaylists((prev) =>
			prev.map((p) =>
				p.id === activePlaylistId ? { ...p, videos: newVideos } : p
			)
		);

		if (oldIndex === playerIndex) {
			setPlayerIndex(target);
		} else if (target === playerIndex) {
			setPlayerIndex(oldIndex);
		}
	}

	const videoIds = activePlaylist?.videos.map((v) => v.youtube_id) || [];

	const handleChangeIndex = useCallback((newIndex: number) => {
		setPlayerIndex(newIndex);
	}, []);

	function handleUserSelect(idx: number) {
		setPlayerIndex(idx);
		setShuffleResetKey((k) => k + 1);
	}

	return (
		<div className="max-w-screen-xl mx-auto">
			<h1 className="text-3xl font-semibold mb-6">Playlists</h1>

			<div className="flex space-x-8">
				<aside className="self-start w-72 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
					<h2 className="text-xl font-medium mb-3">Your Playlists</h2>

					<ul className="space-y-3 mb-5">
						{playlists.map((playlist) => {
							const isActive = playlist.id === activePlaylistId;
							const isEditing = playlist.id === editingId;

							return (
								<li
									key={playlist.id}
									className="flex items-center justify-between"
								>
									{isEditing ? (
										<input
											type="text"
											value={editingValue}
											autoFocus
											onChange={(
												e: ChangeEvent<HTMLInputElement>
											) =>
												setEditingValue(e.target.value)
											}
											onBlur={() => {
												commitRename();
											}}
											onKeyDown={onRenameKeyDown}
											className="flex-1 px-2 py-1 rounded-lg border-none text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-accent"
										/>
									) : (
										<button
											onClick={() => {
												setActivePlaylistId(
													playlist.id
												);
												setPlayerIndex(0);
												setShuffleResetKey(
													(k) => k + 1
												);
											}}
											className={
												"flex-1 text-left px-3 py-2 rounded-lg text-sm " +
												(isActive
													? "bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-medium"
													: "hover:bg-gray-200 dark:hover:bg-gray-700")
											}
										>
											{playlist.name}
										</button>
									)}

									<div className="flex items-center space-x-2 ml-2">
										{!isEditing && (
											<button
												onClick={() =>
													handleStartRename(
														playlist.id,
														playlist.name
													)
												}
												className="p-1 text-green-500 hover:text-green-700"
												title="Rename playlist"
											>
												<PencilSquareIcon className="w-5 h-5" />
											</button>
										)}

										<button
											onClick={() =>
												handleDeletePlaylist(
													playlist.id
												)
											}
											className="p-1 text-red-500 hover:text-red-600"
											title="Delete playlist"
										>
											<TrashIcon className="w-5 h-5" />
										</button>
									</div>
								</li>
							);
						})}
					</ul>

					<div className="flex space-x-2">
						<input
							type="text"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							placeholder="New playlist name"
							className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm"
						/>
						<button
							onClick={handleCreatePlaylist}
							className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg"
						>
							<PlusIcon className="w-6 h-6" />
						</button>
					</div>
				</aside>

				<section className="flex-1 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
					{!activePlaylist ? (
						<p className="text-center text-gray-600 dark:text-gray-300 text-lg">
							Select or create a playlist to view/edit
						</p>
					) : (
						<>
							<h2 className="text-2xl font-semibold mb-5">
								{activePlaylist.name}
							</h2>

							<div className="flex space-x-3 mb-6">
								<input
									type="text"
									value={videoInput}
									onChange={(e) =>
										setVideoInput(e.target.value)
									}
									placeholder="YouTube Video ID"
									className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm"
								/>
								<button
									onClick={() =>
										handleAddVideoToPlaylist(videoInput)
									}
									className="px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm"
								>
									Add
								</button>
							</div>

							<ul className="space-y-4 mb-6">
								{activePlaylist.videos.map((video, idx) => {
									const isPlaying = idx === playerIndex;
									return (
										<li
											key={idx}
											className={
												"flex items-center space-x-4 p-4 rounded-lg cursor-pointer " +
												(isPlaying
													? "border-2 border-accent bg-accent-lighter dark:bg-gray-700"
													: "bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600")
											}
											onClick={() =>
												handleUserSelect(idx)
											}
										>
											<div className="-ml-2 -mt-2 -mb-2 -mr-1 flex-shrink-0 w-32 h-[4.5rem] overflow-visible">
												<img
													src={video.thumbnail_url}
													alt="rip :("
													className="w-full h-full object-cover rounded border-none text-gray-900 dark:text-white"
												/>
											</div>

											<div className="flex-1 text-sm">
												<p className="font-medium text-body">
													{video.title}
												</p>
												<p className="text-gray-600 dark:text-gray-300 text-xs">
													{video.channel_name}
												</p>
												<p className="text-gray-500 dark:text-gray-400 text-xs italic">
													ID: {video.youtube_id}
												</p>
											</div>

											<div className="flex items-center space-x-2">
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleMoveVideo(
															idx,
															"up"
														);
													}}
													disabled={idx === 0}
													className="p-2 disabled:opacity-20"
													title="Move up"
												>
													<ArrowUpIcon className="w-5 h-5" />
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleMoveVideo(
															idx,
															"down"
														);
													}}
													disabled={
														idx ===
														activePlaylist.videos
															.length -
															1
													}
													className="p-2 disabled:opacity-20"
													title="Move down"
												>
													<ArrowDownIcon className="w-5 h-5" />
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleRemoveVideo(idx);
													}}
													className="p-2 text-red-500 hover:text-red-600"
													title="Remove from playlist"
												>
													<TrashIcon className="w-6 h-6" />
												</button>
											</div>
										</li>
									);
								})}

								{activePlaylist.videos.length === 0 && (
									<li className="text-gray-500 dark:text-gray-400 text-sm">
										No videos in this playlist yet.
									</li>
								)}
							</ul>

							<div className="flex items-center space-x-2 mb-4">
								<button
									type="button"
									onClick={() => setIsShuffling((s) => !s)}
									className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
										isShuffling
											? "bg-sky-200 dark:bg-sky-800 hover:bg-sky-300 dark:hover:bg-sky-700"
											: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
									}`}
									title="Shuffle"
									aria-pressed={isShuffling}
								>
									<ArrowsRightLeftIcon
										className={`w-6 h-6 ${
											isShuffling
												? "text-accent"
												: "text-gray-400 dark:text-gray-500"
										}`}
										aria-hidden="true"
									/>
									<span
										className={`select-none ${
											isShuffling
												? "text-body"
												: "text-gray-500 dark:text-gray-400"
										}`}
									>
										Shuffle
									</span>
								</button>
								<button
									type="button"
									onClick={() => setIsLooping((l) => !l)}
									className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
										isLooping
											? "bg-sky-200 dark:bg-sky-800 hover:bg-sky-300 dark:hover:bg-sky-700"
											: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
									}`}
									title="Loop"
									aria-pressed={isLooping}
								>
									<ArrowPathIcon
										className={`w-6 h-6 ${
											isLooping
												? "text-accent"
												: "text-gray-400 dark:text-gray-500"
										}`}
										aria-hidden="true"
									/>
									<span
										className={`select-none ${
											isLooping
												? "text-body"
												: "text-gray-500 dark:text-gray-400"
										}`}
									>
										Loop
									</span>
								</button>
							</div>

							<PlaylistPlayer
								key={activePlaylistId}
								videoIds={videoIds}
								videoMetadata={activePlaylist.videos}
								shuffle={isShuffling}
								loop={isLooping}
								currentIndex={playerIndex}
								onChangeIndex={handleChangeIndex}
								userClickedKey={shuffleResetKey}
							/>
						</>
					)}
				</section>
			</div>
		</div>
	);
}
