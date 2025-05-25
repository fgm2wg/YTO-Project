import NavBar from "../components/NavBar";
import SidePanel from "../components/SidePanel";
import VideoGrid from "../components/VideoGrid";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<NavBar />

			<div className="flex">
				<SidePanel />

				<main className="flex-1">
					<VideoGrid />
				</main>
			</div>
		</div>
	);
}
