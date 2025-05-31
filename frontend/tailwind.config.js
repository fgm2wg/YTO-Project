/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			aspectRatio: {
				video: "16 / 9",
			},
			colors: {
				accent: "var(--color-accent)",
				"accent-lighter": "var(--color-accent-lighter)",
				"accent-hover": "var(--color-accent-hover)",
				body: "var(--color-text)",
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/aspect-ratio"),
	],
};
