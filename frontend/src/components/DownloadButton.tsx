import { forwardRef, useImperativeHandle, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../contexts/ThemeSettingsContext";
import axios from "axios";

interface Props {
	youtubeId: string;
	className?: string;
}

export interface DownloadButtonHandle {
	download: (format: "audio" | "video") => Promise<void>;
}

const DownloadButton = forwardRef<DownloadButtonHandle, Props>(
	({ youtubeId, className }: Props, ref) => {
		const { downloadPollingInterval } = useTheme();
		const [isDownloading, setIsDownloading] = useState(false);
		const [progress, setProgress] = useState<string | null>(null);
		const [stage, setStage] = useState<string | null>(null);
		const [showFormatDropdown, setShowFormatDropdown] = useState(false);

		const pollDownloadStatus = (jobId: string): Promise<void> => {
			return new Promise((resolve, reject) => {
				const interval = setInterval(async () => {
					try {
						const { data } = await axios.get(
							`/api/download/status/${jobId}`
						);

						setProgress(data.progress ?? null);
						setStage(data.stage ?? null);

						if (
							data.status === "finished" ||
							data.status === "error"
						) {
							clearInterval(interval);
							if (data.status === "finished") {
								setProgress("100%");
								setTimeout(() => {
									setIsDownloading(false);
									setProgress(null);
									setStage(null);
									setShowFormatDropdown(false);
									console.log(
										"Download successful:",
										data.url
									);
									resolve();
								}, 1000);
							} else {
								alert("Download failed: " + data.error);
								setIsDownloading(false);
								setProgress(null);
								setStage(null);
								setShowFormatDropdown(false);
								reject(new Error(data.error));
							}
						}
					} catch (err) {
						console.error("Polling error:", err);
						clearInterval(interval);
						setIsDownloading(false);
						reject(err);
					}
				}, downloadPollingInterval);
			});
		};

		const handleDownload = async (
			format: "audio" | "video"
		): Promise<void> => {
			setIsDownloading(true);
			setProgress("0%");

			try {
				const { data } = await axios.post("/api/download/", {
					url: `https://www.youtube.com/watch?v=${youtubeId}`,
					format,
				});

				if (data.job_id) {
					await pollDownloadStatus(data.job_id);
				} else {
					throw new Error("Missing job_id in response");
				}
			} catch (err: any) {
				alert(err.message || "Download failed");
				setIsDownloading(false);
				setProgress(null);
				throw err;
			}
		};

		useImperativeHandle(ref, () => ({
			download: handleDownload,
		}));

		const Spinner = () => (
			<svg
				className="animate-spin h-6 w-6 text-gray-600 dark:text-gray-300"
				viewBox="0 0 24 24"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
				/>
			</svg>
		);

		return (
			<div
				className="relative flex flex-col items-end"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<button
					onClick={() => setShowFormatDropdown((p) => !p)}
					disabled={isDownloading}
					title="Download"
					className={`${
						className ?? ""
					} p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
					aria-label="Download"
					type="button"
				>
					{isDownloading ? (
						<Spinner />
					) : (
						<ArrowDownTrayIcon className="h-6 w-6 text-accent" />
					)}
				</button>

				{showFormatDropdown && !isDownloading && (
					<div className="absolute right-0 mt-8 w-24 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow z-10">
						<button
							onClick={() => {
								setShowFormatDropdown(false);
								handleDownload("video");
							}}
							className="block w-full text-left px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-700"
						>
							Video
						</button>
						<button
							onClick={() => {
								setShowFormatDropdown(false);
								handleDownload("audio");
							}}
							className="block w-full text-left px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
						>
							Audio
						</button>
					</div>
				)}

				{isDownloading && progress && (
					<span className="mt-1 mr-1 text-sm text-gray-500 dark:text-gray-400 text-right">
						{progress}{" "}
						{stage === "audio"
							? "(Audio)"
							: stage === "video"
							? "(Video)"
							: ""}
					</span>
				)}
			</div>
		);
	}
);

export default DownloadButton;
