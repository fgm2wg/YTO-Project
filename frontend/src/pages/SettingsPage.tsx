import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../contexts/ThemeSettingsContext";
import { pl } from "date-fns/locale";

export default function SettingsPage() {
	const {
		darkMode,
		setDarkMode,
		lightSettings,
		darkSettings,
		homeInfiniteScroll,
		setHomeInfiniteScroll,
		downloadPollingInterval,
		setDownloadPollingInterval,
		playlistDownloadBatchSize,
		setPlaylistDownloadBatchSize,
	} = useTheme();

	return (
		<div className="max-w-screen-lg mx-auto p-4 space-y-8">
			<h1 className="text-4xl font-semibold">Settings</h1>

			<div className="space-y-4">
				<div className="flex items-center justify-between p-4 rounded shadow bg-gray-50 dark:bg-gray-800">
					<span className="text-lg">Dark Mode</span>
					<label className="inline-flex items-center space-x-2">
						<input
							type="checkbox"
							checked={darkMode}
							onChange={(e) => setDarkMode(e.target.checked)}
							className="form-checkbox h-5 w-5 text-accent"
						/>
						<span>{darkMode ? "On" : "Off"}</span>
					</label>
				</div>
				<div className="flex items-center justify-between p-4 rounded shadow bg-gray-50 dark:bg-gray-800">
					<span className="text-lg">Home Page Infinite Scroll</span>
					<label className="inline-flex items-center space-x-2">
						<input
							type="checkbox"
							checked={homeInfiniteScroll}
							onChange={(e) =>
								setHomeInfiniteScroll(e.target.checked)
							}
							className="form-checkbox h-5 w-5 text-accent"
						/>
						<span>{homeInfiniteScroll ? "On" : "Off"}</span>
					</label>
				</div>
				<div className="flex items-center relative justify-between p-4 rounded shadow bg-gray-50 dark:bg-gray-800">
					<span className="text-lg">Download Polling Rate (ms)</span>
					<input
						type="number"
						min={100}
						step={100}
						value={downloadPollingInterval}
						onChange={(e) =>
							setDownloadPollingInterval(
								Math.max(100, parseInt(e.target.value, 10))
							)
						}
						className="w-24 p-1 rounded border dark:bg-gray-700"
					/>
					{downloadPollingInterval !== 1000 && (
						<button
							onClick={() => setDownloadPollingInterval(1000)}
							title="Reset to default"
							className="absolute right-[-3rem] top-1/2 -translate-y-1/2 p-2 rounded 
                           bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
						>
							<ArrowPathIcon className="w-5 h-5 text-accent" />
						</button>
					)}
				</div>
				<div className="flex items-center relative justify-between p-4 rounded shadow bg-gray-50 dark:bg-gray-800">
					<span className="text-lg">
						Playlist Download Batch Size
					</span>
					<input
						type="number"
						min={1}
						step={1}
						value={playlistDownloadBatchSize}
						onChange={(e) =>
							setPlaylistDownloadBatchSize(
								Math.max(1, parseInt(e.target.value, 10))
							)
						}
						className="w-24 p-1 rounded border dark:bg-gray-700"
					/>
					{playlistDownloadBatchSize !== 5 && (
						<button
							onClick={() => setPlaylistDownloadBatchSize(5)}
							title="Reset to default"
							className="absolute right-[-3rem] top-1/2 -translate-y-1/2 p-2 rounded 
                           bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
						>
							<ArrowPathIcon className="w-5 h-5 text-accent" />
						</button>
					)}
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-semibold mb-4">
					Light Mode Colors
				</h2>
				{lightSettings.map((setting) => (
					<div key={setting.label} className="relative mb-4">
						<div className="flex items-center justify-between p-4 rounded shadow bg-gray-50 dark:bg-gray-800">
							<span className="text-lg">{setting.label}</span>
							<label className="inline-flex items-center space-x-1">
								<span>{setting.value.toUpperCase()}</span>
								<input
									type="color"
									value={setting.value}
									onChange={(e) =>
										setting.setter(e.target.value)
									}
									className="h-8 w-8 border-0 bg-transparent cursor-pointer"
								/>
							</label>
						</div>
						{setting.value !== setting.defaultValue && (
							<button
								onClick={() =>
									setting.setter(setting.defaultValue)
								}
								title="Reset to default"
								className="absolute right-[-3rem] top-1/2 -translate-y-1/2 p-2 rounded 
                           bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
							>
								<ArrowPathIcon className="w-5 h-5 text-accent" />
							</button>
						)}
					</div>
				))}
			</div>

			<div>
				<h2 className="text-2xl font-semibold mb-4">
					Dark Mode Colors
				</h2>
				{darkSettings.map((setting) => (
					<div key={setting.label} className="relative mb-4">
						<div className="flex items-center justify-between p-4 rounded shadow bg-gray-50 dark:bg-gray-800">
							<span className="text-lg">{setting.label}</span>
							<label className="inline-flex items-center space-x-1">
								<span>{setting.value.toUpperCase()}</span>
								<input
									type="color"
									value={setting.value}
									onChange={(e) =>
										setting.setter(e.target.value)
									}
									className="h-8 w-8 border-0 bg-transparent cursor-pointer"
								/>
							</label>
						</div>
						{setting.value !== setting.defaultValue && (
							<button
								onClick={() =>
									setting.setter(setting.defaultValue)
								}
								title="Reset to default"
								className="absolute right-[-3rem] top-1/2 -translate-y-1/2 p-2 rounded 
                           bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
							>
								<ArrowPathIcon className="w-5 h-5 text-accent" />
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
