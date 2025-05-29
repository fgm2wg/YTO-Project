import type { Dispatch, SetStateAction } from "react";

interface Props {
	darkMode: boolean;
	setDarkMode: Dispatch<SetStateAction<boolean>>;
}

export default function SettingsPage({ darkMode, setDarkMode }: Props) {
	return (
		<div className="max-w-screen-lg mx-auto p-4">
			<h1 className="text-3xl font-semibold mb-6">Settings</h1>

			<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded shadow">
				<span className="text-lg">Dark Mode</span>
				<label className="inline-flex items-center space-x-2">
					<input
						type="checkbox"
						checked={darkMode}
						onChange={(e) => setDarkMode(e.target.checked)}
						className="form-checkbox h-5 w-5 text-green-600"
					/>
					<span>{darkMode ? "On" : "Off"}</span>
				</label>
			</div>
		</div>
	);
}
