import { useState, useEffect } from "react";
import type { ColorSetting } from "../pages/SettingsPage";

const DEFAULTS_LIGHT = {
	accent: "#3b82f6",
	accentHover: "#2563eb",
	bodyText: "#111827",
};
const DEFAULTS_DARK = {
	accent: "#60a5fa",
	accentHover: "#3b82f6",
	bodyText: "#f9fafb",
};

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
	const [accentHoverLight, setAccentHoverLight] = useState(
		() =>
			localStorage.getItem("accentHoverLight") ||
			DEFAULTS_LIGHT.accentHover
	);
	const [bodyTextLight, setBodyTextLight] = useState(
		() => localStorage.getItem("bodyTextLight") || DEFAULTS_LIGHT.bodyText
	);

	const [accentDark, setAccentDark] = useState(
		() => localStorage.getItem("accentDark") || DEFAULTS_DARK.accent
	);
	const [accentHoverDark, setAccentHoverDark] = useState(
		() =>
			localStorage.getItem("accentHoverDark") || DEFAULTS_DARK.accentHover
	);
	const [bodyTextDark, setBodyTextDark] = useState(
		() => localStorage.getItem("bodyTextDark") || DEFAULTS_DARK.bodyText
	);

	useEffect(() => {
		const root = document.documentElement;

		if (darkMode) {
			root.style.setProperty("--color-accent", accentDark);
			root.style.setProperty("--color-accent-hover", accentHoverDark);
			root.style.setProperty("--color-text", bodyTextDark);

			localStorage.setItem("accentDark", accentDark);
			localStorage.setItem("accentHoverDark", accentHoverDark);
			localStorage.setItem("bodyTextDark", bodyTextDark);
		} else {
			root.style.setProperty("--color-accent", accentLight);
			root.style.setProperty("--color-accent-hover", accentHoverLight);
			root.style.setProperty("--color-text", bodyTextLight);

			localStorage.setItem("accentLight", accentLight);
			localStorage.setItem("accentHoverLight", accentHoverLight);
			localStorage.setItem("bodyTextLight", bodyTextLight);
		}
	}, [
		darkMode,
		accentLight,
		accentHoverLight,
		bodyTextLight,
		accentDark,
		accentHoverDark,
		bodyTextDark,
	]);

	const lightSettings: ColorSetting[] = [
		{
			label: "Theme",
			value: accentLight,
			defaultValue: DEFAULTS_LIGHT.accent,
			setter: setAccentLight,
		},
		{
			label: "Hover",
			value: accentHoverLight,
			defaultValue: DEFAULTS_LIGHT.accentHover,
			setter: setAccentHoverLight,
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
			label: "Hover (Dark)",
			value: accentHoverDark,
			defaultValue: DEFAULTS_DARK.accentHover,
			setter: setAccentHoverDark,
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
	};
}
