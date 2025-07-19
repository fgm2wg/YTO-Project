import { useState, useEffect } from "react";

interface Props {
	onSearch: (q: string) => void;
	loading: boolean;
	initialValue?: string;
	showClear?: boolean;
}

export default function SearchBar({
	onSearch,
	loading,
	initialValue = "",
	showClear = false,
}: Props) {
	const [text, setText] = useState(initialValue);

	useEffect(() => {
		setText(initialValue);
	}, [initialValue]);

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
				placeholder="Search YouTube..."
				className="flex-grow px-3 py-2 border rounded-l bg-gray-50 dark:bg-gray-700 text-body"
			/>
			{showClear && text && (
				<button
					type="button"
					onClick={() => setText("")}
					className="px-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-l-none"
				>
					×
				</button>
			)}
			<button
				type="submit"
				disabled={loading}
				className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-r"
			>
				{loading ? "..." : "Search"}
			</button>
		</form>
	);
}
