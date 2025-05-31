import VideoGrid from "../components/VideoGrid";

export default function HomePage() {
	return (
		<div className="bg-gray-50">
			<div className="flex">
				<main className="flex-1">
					<VideoGrid />
				</main>
			</div>
		</div>
	);
}
