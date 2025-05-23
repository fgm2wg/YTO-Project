import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Define shape of video object returned from API
type Video = {
  youtube_id: string;
  title: string;
  thumbnail_url: string;
  channel_name: string;
};

// Function for search component
export function Search() {
  const [query, setQuery] = useState(""); // current text in the search input
  const [results, setResults] = useState<Video[]>([]); // list of videos returned from backend
  const [loading, setLoading] = useState(false); // state of if search request being made
  const [loadingMore, setLoadingMore] = useState(false); // state of if more results being fetched
  const [error, setError] = useState<string | null>(null); // error message if API fetch fails
  const [nextPageToken, setNextPageToken] = useState<string | null>(null); // token for pagination

  const loaderRef = useRef<HTMLDivElement>(null); // ref to the loader element for infinite scroll

  // Async function to perform API call to fetch /api/search endpoint
  const fetchPage = useCallback(
    async (pageToken?: string) => {
      pageToken ? setLoadingMore(true) : setLoading(true); // show loading spinner
      setError(null); // clear error message
      try {
        // Call the search API with URL
        const url = new URL("/api/search/", window.location.origin);
        url.searchParams.set("q", query);
        // If pageToken is provided, add it to the URL
        if (pageToken) {
          url.searchParams.set("pageToken", pageToken);
        }
        const res = await fetch(url.toString());
        // If no response, then throw error
        if (!res.ok) {
          throw new Error(`Server error ${res.status}`);
        }
        // Parse JSON response into Video[] type
        const body = (await res.json()) as {
          results: Video[];
          nextPageToken?: string;
        };
        // Update results list
        setResults((prev) =>
          pageToken ? [...prev, ...body.results] : body.results
        );
        // Update nextPageToken for pagination
        setNextPageToken(body.nextPageToken || null);
      } catch (err) {
        console.error("Fetch failed", err);
        setResults([]); // clear results on error
        setError("Unable to fetch results. Please try again later."); // set error message
      } finally {
        setLoading(false); // hide loading spinner
        setLoadingMore(false); // hide loading more spinner
      }
    },
    [query]
  );

  // Handle form submit (button or enter key)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent full page relaod
    // If user inputted text into input, call search API function
    if (query) {
      setResults([]); // clear previous results
      setNextPageToken(null); // reset pagination token
      fetchPage();
    }
  };

  // Effect to fetch first page of results when query changes
  useEffect(() => {
    // Only set up the observer if there is a nextPageToken
    if (!loaderRef.current || !nextPageToken) {
      return;
    }
    // Set up IntersectionObserver to load more results when the loader element is in view
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          fetchPage(nextPageToken);
        }
      },
      { rootMargin: "200px" } // Load more results when loader is within 200px of viewport
    );
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [fetchPage, nextPageToken, loadingMore]);

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", mt: 4, mb: 4 }}>
      {/* Search bar (input & button) */}
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", justifyContent: "center", mb: 4 }}
      >
        {/* Controlled TextField for search term */}
        <TextField
          label="Search"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ width: "60%", mr: 1 }}
        />
        {/* IconButton shows spinner when loading, or search icon otherwise */}
        <IconButton
          type="submit"
          color="primary"
          disabled={!query || loading}
          sx={{ p: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Box>

      {/* Error message */}
      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Results list */}
      {results.length > 0 ? (
        <Box sx={{ display: "grid", rowGap: 4 }}>
          {results.map((video) => (
            <Box
              key={video.youtube_id}
              sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
            >
              {/* Video thumbnail */}
              <Box
                component="img"
                src={video.thumbnail_url}
                alt={video.title}
                sx={{
                  width: 500,
                  height: 280,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />

              {/* Title & channel name */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {video.channel_name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : !loading && !error ? (
        <Typography align="center" color="textSecondary">
          Enter a search term above to find videos.
        </Typography>
      ) : null}

      {/* Spinner at bottom when loading more */}
      {loadingMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Sentinel for IntersectionObserver */}
      <div ref={loaderRef} />
    </Box>
  );
}
