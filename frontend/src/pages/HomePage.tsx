import VideoGrid from "../components/VideoGrid";

interface Props {
	homeInfiniteScroll: boolean;
}

export default function HomePage({ homeInfiniteScroll }: Props) {
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
