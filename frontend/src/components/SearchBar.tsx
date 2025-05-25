import { useState } from "react";

interface Props {
	onSearch: (q: string) => void;
	loading: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
	const [text, setText] = useState("");
	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (text.trim()) {
			onSearch(text.trim());
		}
	};

	return (
		<form onSubmit={submit} className="flex">
			<input
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Search YouTube…"
				className="flex-grow px-3 py-2 border rounded-l"
			/>
			<button
				type="submit"
				disabled={loading}
				className="px-4 py-2 bg-green-600 text-white rounded-r"
			>
				{loading ? "…" : "Search"}
			</button>
		</form>
	);
}
