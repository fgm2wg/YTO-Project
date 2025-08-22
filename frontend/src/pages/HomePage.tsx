import VideoGrid from "../components/VideoGrid";
import { useTheme } from "../contexts/ThemeSettingsContext";

export default function HomePage() {
	const { homeInfiniteScroll } = useTheme();

	return (
		<div className="bg-gray-50 dark:bg-gray-900">
			<div className="flex">
				<main className="flex-1">
					<VideoGrid infiniteScrollEnabled={homeInfiniteScroll} />
				</main>
			</div>
		</div>
	);
}
