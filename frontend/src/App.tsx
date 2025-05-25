import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import SidePanel from "./components/SidePanel";
import SearchPage from "./pages/SearchPage";
import VideoPage from "./pages/VideoPage";
import HomePage from "./pages/HomePage";

export default function App() {
	const [collapsed, setCollapsed] = useState(false);
	const { pathname } = useLocation();
	const isHome = pathname === "/";

	return (
		<div className="flex flex-col h-screen">
			<NavBar onToggleSidebar={() => setCollapsed((c) => !c)} />

			<div className="flex flex-1 overflow-hidden bg-gray-50 relative">
				{!collapsed &&
					(isHome ? (
						<SidePanel />
					) : (
						<SidePanel className="absolute left-0 top-0 bottom-0 z-20" />
					))}

				<main className="flex-1 overflow-y-auto p-4">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/search" element={<SearchPage />} />
						<Route path="/video/:videoId" element={<VideoPage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
			</div>
		</div>
	);
}
