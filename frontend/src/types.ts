import type { Dispatch, SetStateAction } from "react";
export interface YouTubeResult {
	youtube_id: string;
	title: string;
	thumbnail_url: string;
	channel_name: string;
	channel_id: string;
}

export interface YouTubeVideoDetail extends YouTubeResult {
	description: string;
	channel_icon_url: string;
	view_count: number;
	like_count: number;
	published_at: string;
}

export interface YouTubeChannelInfo {
	channel_id: string;
	title: string;
	description: string;
	thumbnail_url: string;
	subscriber_count: number;
}

export interface ColorSetting {
	label: string;
	value: string;
	defaultValue: string;
	setter: Dispatch<SetStateAction<string>>;
}

export interface VideoItem {
	id: string;
	title: string;
	thumbnail_url: string;
	channel_name: string;
}

export interface Playlist {
	id: string;
	name: string;
	videos: VideoItem[];
}
