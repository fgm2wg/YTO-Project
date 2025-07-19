import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import VideoList from "../components/VideoList";
import type { YouTubeResult } from "../types";

export default function SearchPage() {
	const [results, setResults] = useState<YouTubeResult[]>([]);
	const [nextPage, setNextPage] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [searchParams] = useSearchParams();

	const queryParam = searchParams.get("q") || "";
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

	useEffect(() => {
		if (queryParam.trim()) {
			setResults([]);
			setNextPage(null);
			fetchResults(queryParam);
		}
	}, [queryParam]);

	useEffect(() => {
		if (!loaderRef.current) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting && nextPage && !loading) {
					fetchResults(queryParam, nextPage);
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
	}, [queryParam, nextPage, loading]);

	return (
		<div>
			<VideoList videos={results} />

			<div ref={loaderRef} />

			{loading && (
				<p className="text-center mt-4 text-gray-500 dark:text-gray-400">
					Loading...
				</p>
			)}
		</div>
	);
}
