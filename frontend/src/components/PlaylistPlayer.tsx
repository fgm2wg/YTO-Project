import { useState, useEffect, useRef, useCallback } from "react";
import type { YouTubeResult } from "../types";
import YouTube from "react-youtube";
import axios from "axios";

const YouTubePlayer: any = YouTube;

interface Props {
	videoIds: string[];
	videoMetadata: YouTubeResult[];
	shuffle: boolean;
	loop: boolean;
	currentIndex: number;
	onChangeIndex: (newIndex: number) => void;
	userClickedKey: number;
}

function shuffleArray<T>(arr: T[]): T[] {
	const shuffled = [...arr];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export default function PlaylistPlayer({
	videoIds,
	videoMetadata,
	shuffle,
	loop,
	currentIndex,
	onChangeIndex,
	userClickedKey,
}: Props) {
	const [shuffleQueue, setShuffleQueue] = useState<number[]>([]);

	const prevShuffleRef = useRef<boolean>(shuffle);
	const prevLengthRef = useRef<number>(videoIds.length);
	const prevUserClickedRef = useRef<number>(userClickedKey);

	function buildQueue(): number[] {
		const N = videoIds.length;
		if (N <= 1) {
			return [];
		}
		const remaining = Array.from({ length: N }, (_, i) => i).filter(
			(i) => i !== currentIndex
		);
		return shuffleArray(remaining);
	}

	useEffect(() => {
		const prevShuffle = prevShuffleRef.current;
		const prevLen = prevLengthRef.current;
		const prevClicked = prevUserClickedRef.current;
		const currLen = videoIds.length;

		if (!prevShuffle && shuffle && currLen > 0 && currentIndex >= 0) {
			setShuffleQueue(buildQueue());
		} else if (
			shuffle &&
			currLen > 0 &&
			prevLen !== currLen &&
			currentIndex >= 0
		) {
			setShuffleQueue(buildQueue());
		} else if (shuffle && userClickedKey !== prevClicked) {
			setShuffleQueue(buildQueue());
		} else if (!shuffle) {
			setShuffleQueue([]);
		}

		prevShuffleRef.current = shuffle;
		prevLengthRef.current = currLen;
		prevUserClickedRef.current = userClickedKey;
	}, [shuffle, videoIds.length, userClickedKey, currentIndex]);

	useEffect(() => {
		if (videoIds.length === 0) {
			return;
		}
		if (currentIndex < 0) {
			onChangeIndex(0);
		} else if (currentIndex >= videoIds.length) {
			onChangeIndex(videoIds.length - 1);
		}
	}, [videoIds.length, currentIndex, onChangeIndex]);

	useEffect(() => {
		if (
			currentIndex >= 0 &&
			currentIndex < videoMetadata.length &&
			videoMetadata[currentIndex]
		) {
			const vid = videoMetadata[currentIndex];
			axios
				.post("/api/history/", {
					youtube_id: vid.youtube_id,
					title: vid.title,
					thumbnail_url: vid.thumbnail_url,
					channel_name: vid.channel_name,
					channel_id: vid.channel_id || null,
				})
				.catch((err) => {
					console.error("Failed to log playlist video:", err);
				});
		}
	}, [currentIndex, videoMetadata]);

	function handleVideoEnd() {
		if (
			videoIds.length === 0 ||
			currentIndex < 0 ||
			currentIndex >= videoIds.length
		) {
			return;
		}

		if (shuffle) {
			if (shuffleQueue.length > 0) {
				const nextIdx = shuffleQueue[0];
				const newQueue = shuffleQueue.slice(1);
				setShuffleQueue(newQueue);
				onChangeIndex(nextIdx);
			} else {
				if (loop) {
					const newQueue = buildQueue();
					if (newQueue.length > 0) {
						const nextIdx = newQueue[0];
						setShuffleQueue(newQueue.slice(1));
						onChangeIndex(nextIdx);
					}
				}
			}
		} else {
			const nextIndex = currentIndex + 1;
			if (nextIndex < videoIds.length) {
				onChangeIndex(nextIndex);
			} else if (loop) {
				onChangeIndex(0);
			}
		}
	}

	const validVideoId =
		currentIndex >= 0 && currentIndex < videoIds.length
			? videoIds[currentIndex]
			: null;

	const playerRef = useRef<YT.Player | null>(null);

	const onPlayerReady = useCallback((event: any) => {
		playerRef.current = event.target;
	}, []);

	useEffect(() => {
		if (!playerRef.current) {
			return;
		}
		if (currentIndex < 0 || currentIndex >= videoIds.length) {
			return;
		}
		const currentlyLoaded = playerRef.current.getVideoData()?.video_id;
		const desired = videoIds[currentIndex];
		if (desired && currentlyLoaded !== desired) {
			playerRef.current.loadVideoById(desired);
		}
	}, [currentIndex, videoIds]);

	if (videoIds.length === 0) {
		return (
			<p className="text-gray-600 dark:text-gray-300 text-center my-4">
				Nothing to play
			</p>
		);
	}

	const opts = {
		height: "390",
		width: "650",
		playerVars: {
			autoplay: 1,
			rel: 0,
		},
	};

	return (
		<div className="mt-6 flex flex-col items-center space-y-2">
			{validVideoId ? (
				<div className="w-full max-w-2xl mx-auto">
					<YouTubePlayer
						videoId={videoIds[0]}
						opts={opts}
						onReady={onPlayerReady}
						onEnd={handleVideoEnd}
						className="w-full h-full rounded-lg shadow-lg"
					/>
				</div>
			) : (
				<p className="text-gray-600 dark:text-gray-300 text-center my-4">
					Loading...
				</p>
			)}

			{validVideoId && (
				<p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
					Video {currentIndex + 1} of {videoIds.length}
				</p>
			)}
		</div>
	);
}
