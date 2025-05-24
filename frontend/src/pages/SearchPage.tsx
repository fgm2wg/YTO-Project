import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import VideoList from "../components/VideoList";
import type { YouTubeResult } from "../types";

export default function SearchPage() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<YouTubeResult[]>([]);
	const [nextPage, setNextPage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const loaderRef = useRef<HTMLDivElement | null>(null);

	const fetchResults = async (q: string, pageToken?: string) => {
		setLoading(true);
		const params: any = { q, maxResults: 10 };
		if (pageToken) {
			params.pageToken = pageToken;
		}

		const { data } = await axios.get("/api/search/", { params });
		setResults((prev) =>
			pageToken ? [...prev, ...data.results] : data.results
		);
		setNextPage(data.nextPageToken);
		setLoading(false);
	};

	const onSearch = (q: string) => {
		setQuery(q);
		setResults([]);
		setNextPage(null);
		fetchResults(q);
	};

	useEffect(() => {
		if (!loaderRef.current) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting && nextPage && !loading) {
					fetchResults(query, nextPage);
				}
			},
			{
				root: null,
				rootMargin: "200px",
				threshold: 0,
			}
		);

		observer.observe(loaderRef.current);

		return () => {
			observer.disconnect();
		};
	}, [query, nextPage, loading]);

	return (
		<div className="p-4">
			<SearchBar onSearch={onSearch} loading={loading} />
			<VideoList videos={results} />

			<div ref={loaderRef} />

			{loading && (
				<p className="text-center mt-4 text-gray-500">Loading…</p>
			)}
		</div>
	);
}
