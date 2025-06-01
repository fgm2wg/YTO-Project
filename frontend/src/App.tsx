import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import SidePanel from "./components/SidePanel";
import SearchPage from "./pages/SearchPage";
import VideoPage from "./pages/VideoPage";
import ChannelPage from "./pages/ChannelPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import { useThemeSettings } from "./hooks/useThemeSettings";

export default function App() {
	const {
		darkMode,
		setDarkMode,
		lightSettings,
		darkSettings,
		homeInfiniteScroll,
		setHomeInfiniteScroll,
	} = useThemeSettings();
	const [collapsed, setCollapsed] = useState(false);
	const { pathname } = useLocation();
	const isMainLayout = pathname === "/" || pathname.startsWith("/channel");

	return (
		<div className="flex flex-col h-screen">
			<NavBar onToggleSidebar={() => setCollapsed((c) => !c)} />

			<div className="flex flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
				{!collapsed &&
					(isMainLayout ? (
						<SidePanel />
					) : (
						<SidePanel className="absolute" />
					))}

				<main className="flex-1 overflow-y-auto p-4">
					<Routes>
						<Route
							path="/"
							element={
								<HomePage
									homeInfiniteScroll={homeInfiniteScroll}
								/>
							}
						/>
						<Route path="/search" element={<SearchPage />} />
						<Route path="/video/:videoId" element={<VideoPage />} />
						<Route
							path="/channel/:channelId"
							element={<ChannelPage />}
						/>
						<Route path="/playlists" element={<PlaylistsPage />} />
						<Route
							path="/settings"
							element={
								<SettingsPage
									darkMode={darkMode}
									setDarkMode={setDarkMode}
									lightSettings={lightSettings}
									darkSettings={darkSettings}
									homeInfiniteScroll={homeInfiniteScroll}
									setHomeInfiniteScroll={
										setHomeInfiniteScroll
									}
								/>
							}
						/>
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
			</div>
		</div>
	);
}
