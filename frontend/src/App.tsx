import { Routes, Route, Navigate } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import VideoPage from "./pages/VideoPage";
import HomePage from "./pages/HomePage";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/search" element={<SearchPage />} />
			<Route path="/video/:videoId" element={<VideoPage />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
