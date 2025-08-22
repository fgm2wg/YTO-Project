import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeSettingsProvider } from "./contexts/ThemeSettingsContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<ThemeSettingsProvider>
			<App />
		</ThemeSettingsProvider>
	</BrowserRouter>
);
