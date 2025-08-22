import { createContext, useContext, type ReactNode } from "react";
import { useThemeSettings } from "../hooks/useThemeSettings";

const ThemeSettingsContext = createContext<ReturnType<
	typeof useThemeSettings
> | null>(null);

export function ThemeSettingsProvider({ children }: { children: ReactNode }) {
	const settings = useThemeSettings();
	return (
		<ThemeSettingsContext.Provider value={settings}>
			{children}
		</ThemeSettingsContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeSettingsContext);
	if (!context)
		throw new Error("useTheme must be used within ThemeSettingsProvider");
	return context;
}
