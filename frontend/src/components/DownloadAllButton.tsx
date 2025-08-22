import { useCallback } from "react";
import type { DownloadButtonHandle } from "./DownloadButton";
import { FolderArrowDownIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../contexts/ThemeSettingsContext";

interface Props {
	youtubeIds: string[];
	buttonRefs: React.RefObject<Record<string, DownloadButtonHandle | null>>;
	batchSize?: number;
}

export default function DownloadAllButton({ youtubeIds, buttonRefs }: Props) {
	const { playlistDownloadBatchSize } = useTheme();
	const batchSize = playlistDownloadBatchSize || 5;

	const handleDownloadAll = useCallback(async () => {
		for (let i = 0; i < youtubeIds.length; i += batchSize) {
			const batch = youtubeIds.slice(i, i + batchSize);

			await Promise.all(
				batch.map(async (id) => {
					const ref = buttonRefs.current[id];
					if (ref) {
						await ref.download("audio");
					}
				})
			);
		}
	}, [youtubeIds, buttonRefs, batchSize]);

	return (
		<FolderArrowDownIcon
			onClick={handleDownloadAll}
			className="w-8 h-8 text-accent cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors rounded"
			title="Download All (audio only)"
		>
			Download All
		</FolderArrowDownIcon>
	);
}
