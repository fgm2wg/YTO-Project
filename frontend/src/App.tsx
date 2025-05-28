import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import SidePanel from "./components/SidePanel";
import SearchPage from "./pages/SearchPage";
import VideoPage from "./pages/VideoPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
	const [collapsed, setCollapsed] = useState(false);
	const [darkMode, setDarkMode] = useState(() => {
		return localStorage.getItem("darkMode") === "true";
	});
	const { pathname } = useLocation();
	const isHome = pathname === "/";

	useEffect(() => {
		const root = window.document.documentElement;
		if (darkMode) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("darkMode", darkMode ? "true" : "false");
	}, [darkMode]);

	return (
		<div className="flex flex-col h-screen">
			<NavBar onToggleSidebar={() => setCollapsed((c) => !c)} />

			<div className="flex flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
				{!collapsed &&
					(isHome ? (
						<SidePanel />
					) : (
						<SidePanel className="absolute" />
					))}

				<main className="flex-1 overflow-y-auto p-4">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/search" element={<SearchPage />} />
						<Route path="/video/:videoId" element={<VideoPage />} />
						<Route
							path="/settings"
							element={
								<SettingsPage
									darkMode={darkMode}
									setDarkMode={setDarkMode}
								/>
							}
						/>
						<Route path="*" element={<Navigate to="/" replace />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
			</div>
		</div>
	);
}
