export interface YouTubeResult {
	youtube_id: string;
	title: string;
	thumbnail_url: string;
	channel_name: string;
}

export interface YouTubeVideoDetail extends YouTubeResult {
	description: string;
	channel_icon_url: string;
	view_count: number;
	like_count: number;
	published_at: string;
}
