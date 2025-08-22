import { useState, useEffect } from "react";
import type { ColorSetting } from "../types";

const DEFAULTS_LIGHT = {
	accent: "#3b82f6",
	bodyText: "#111827",
};
const DEFAULTS_DARK = {
	accent: "#60a5fa",
	bodyText: "#f9fafb",
};
const DEFAULT_DOWNLOAD_POLL_INTERVAL_MS = 1000;
const DEFAULT_PLAYLIST_DOWNLOAD_BATCH_SIZE = 5;

export function useThemeSettings() {
	const [darkMode, setDarkMode] = useState(() => {
		return localStorage.getItem("darkMode") === "true";
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
		localStorage.setItem("darkMode", darkMode.toString());
	}, [darkMode]);

	const [accentLight, setAccentLight] = useState(
		() => localStorage.getItem("accentLight") || DEFAULTS_LIGHT.accent
	);
	const [bodyTextLight, setBodyTextLight] = useState(
		() => localStorage.getItem("bodyTextLight") || DEFAULTS_LIGHT.bodyText
	);

	const [accentDark, setAccentDark] = useState(
		() => localStorage.getItem("accentDark") || DEFAULTS_DARK.accent
	);
	const [bodyTextDark, setBodyTextDark] = useState(
		() => localStorage.getItem("bodyTextDark") || DEFAULTS_DARK.bodyText
	);

	const [homeInfiniteScroll, setHomeInfiniteScroll] = useState<boolean>(
		() => {
			return localStorage.getItem("homeInfiniteScroll") === "false"
				? false
				: true;
		}
	);

	const [downloadPollingInterval, setDownloadPollingInterval] = useState(
		() => {
			const saved = localStorage.getItem("downloadPollingInterval");
			return saved
				? parseInt(saved, 10)
				: DEFAULT_DOWNLOAD_POLL_INTERVAL_MS;
		}
	);

	const [playlistDownloadBatchSize, setPlaylistDownloadBatchSize] = useState(
		() => {
			const saved = localStorage.getItem("playlistDownloadBatchSize");
			return saved
				? parseInt(saved, 10)
				: DEFAULT_PLAYLIST_DOWNLOAD_BATCH_SIZE;
		}
	);

	useEffect(() => {
		const root = document.documentElement;

		if (darkMode) {
			root.style.setProperty("--color-accent", accentDark);
			root.style.setProperty("--color-text", bodyTextDark);

			localStorage.setItem("accentDark", accentDark);
			localStorage.setItem("bodyTextDark", bodyTextDark);
		} else {
			root.style.setProperty("--color-accent", accentLight);
			root.style.setProperty("--color-text", bodyTextLight);

			localStorage.setItem("accentLight", accentLight);
			localStorage.setItem("bodyTextLight", bodyTextLight);
		}

		localStorage.setItem(
			"homeInfiniteScroll",
			homeInfiniteScroll.toString()
		);
		localStorage.setItem(
			"downloadPollingInterval",
			downloadPollingInterval.toString()
		);
		localStorage.setItem(
			"playlistDownloadBatchSize",
			playlistDownloadBatchSize.toString()
		);
	}, [
		darkMode,
		accentLight,
		bodyTextLight,
		accentDark,
		bodyTextDark,
		homeInfiniteScroll,
		downloadPollingInterval,
		playlistDownloadBatchSize,
	]);

	const lightSettings: ColorSetting[] = [
		{
			label: "Theme",
			value: accentLight,
			defaultValue: DEFAULTS_LIGHT.accent,
			setter: setAccentLight,
		},
		{
			label: "Text",
			value: bodyTextLight,
			defaultValue: DEFAULTS_LIGHT.bodyText,
			setter: setBodyTextLight,
		},
	];

	const darkSettings: ColorSetting[] = [
		{
			label: "Theme (Dark)",
			value: accentDark,
			defaultValue: DEFAULTS_DARK.accent,
			setter: setAccentDark,
		},
		{
			label: "Text (Dark)",
			value: bodyTextDark,
			defaultValue: DEFAULTS_DARK.bodyText,
			setter: setBodyTextDark,
		},
	];

	return {
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
	};
}
