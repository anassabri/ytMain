import React from 'react';
// Import and re-export VideoVisibility type
import type { Video } from '../src/types';
import type { VideoVisibility } from 'src/types/core';

export type { VideoVisibility };

// Define interfaces for PlaylistSummary and CommunityPost first as Channel uses them
export interface PlaylistSummary {
 id: string;
 title: string;
 videoCount: number;
 thumbnailUrl?: string;
}

export interface CommunityPost {
 id: string;
 type: "text" | 'image' | 'poll';
 content: string;
 imageUrl?: string;
 pollOptions?: Array<{ id: string; text: string; votes: number }>;
 likes: number;
 comments: number;
 shares: number;
 isLiked: boolean;
 createdAt: Date;
 engagement: {
 views: number;
 clickThroughRate: number
 };
 // Legacy fields for backward compatibility
 channelName?: string;
 channelAvatarUrl?: string;
 timestamp?: string;
 textContent?: string;
 commentsCount?: number;
}

// Re-export core Video type
export type { Video, ContentItem } from './src/types/core';

// Extended Video interface with additional properties for backward compatibility
export interface ExtendedVideo {
 id: string;
 title: string;
 thumbnailUrl: string;
 thumbnail?: string; // Alternative to thumbnailUrl,
 channelName: string;
 channelAvatarUrl: string;
 channelAvatar?: string; // Alternative to channelAvatarUrl,
 views: string;
 viewCount?: number; // Alternative to views as string,
 uploadedAt: string;
 duration: string;
 videoUrl: string;
 description: string;
 category: string;
 isShort?: boolean;
 isLiveNow?: boolean;
 scheduledStartTime?: string; // ISO date string
 viewerCount?: string;
 likes?: number;
 dislikes?: number;
 isLiked?: boolean;
 isDisliked?: boolean;
 isSaved?: boolean;
 commentCount?: number;
 tags?: string;
 privacyStatus?: 'public' | 'private' | 'unlisted';
 publishedAt?: string; // ISO date string
 createdAt?: string; // ISO date string
 visibility?: VideoVisibility;
 channelId?: string;
 // Additional metadata
 aspectRatio?: number;
 definition?: 'hd' | 'sd';
 dimension?: '2d' | '3d';
 caption?: boolean;
 licensedContent?: boolean;
 contentRating?: Record<string, any>;
 projection?: 'rectangular' | '360' | '3d';
 // Engagement
 likeCount?: number;
 favoriteCount?: number;
 // Status
 uploadStatus?: 'deleted' | 'failed' | 'processed' | 'rejected' | 'uploaded';
 failureReason?: string;
 rejectionReason?: string;
 // Monetization
 monetizationDetails?: {
 access?: {
 allowed: boolean;
 exception?: string;
 };
 monetizationStatus?: 'monetized' | 'ineligible' | 'limited';
 adFormats?: string;
 };
 // Localization
 defaultAudioLanguage?: string;
 defaultLanguage?: string;
 localized?: {
 title: string;
 description: string
 };
}

// Re-export core Channel type
export type { Channel } from './src/types/core';

// Extended Channel interface for backward compatibility
export interface ExtendedChannel {
 id: string;
 name: string;
 avatarUrl: string;
 subscribers: string;
 subscriberCount?: string;
 videoCount?: number;
 isVerified?: boolean;
 description?: string;
 joinDate?: string; // Added
 totalViews?: string; // Added
 channelDescription?: string; // Added
 playlists?: PlaylistSummary;
 communityPosts?: CommunityPost;
}

// Re-export core Comment type
export type { Comment } from './src/types/core';

// User-specific playlists
export interface UserPlaylist {
 id: string;
 title: string;
 description?: string;
 videoIds: string;
 createdAt: string; // ISO date string,
 updatedAt: string; // ISO date string
}

export interface UserPlaylistDetails extends UserPlaylist {
 videoCount: number;
 thumbnailUrl?: string; // Thumbnail of the first video, or a default
}

// For AI Content Spark feature
export interface VideoIdeaResponse {
 ideas: string;
 titles: string;
 concept: string;
 talkingPoints: string;
 tags: string;
 error?: string;
}

export interface VideoUploadData {
 title: string;
 description: string;
 category: string;
 tags: string;
 visibility: 'public' | 'unlisted' | 'private';
 videoFile: File | null;
 thumbnailFile: File | null;
 isShorts: boolean
}

export interface UploadProgress {
 percentage: number;
 status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
 message: string
}

// Type alias for shorts (videos with isShort: true)
export type Short = Omit<ExtendedVideo, 'isShort'> & {
 isShort: true;
 isVertical?: boolean;
 // Additional Short-specific properties
 musicInfo?: {
 title: string;
 artist: string;
 coverUrl?: string;
 };
 // Engagement metrics specific to Shorts
 shares?: number;
 saves?: number;
 // Shorts-specific features
 hasCaptions?: boolean;
 hasAudio?: boolean;
 // Analytics
 viewDuration?: number; // Average view duration in seconds
 swipeAwayRate?: number; // Percentage of viewers who swiped away
 // Additional metadata
 createdTime?: string;
 modifiedTime?: string;
 // Privacy and status
 visibility?: VideoVisibility;
 // Monetization
 isMonetized?: boolean;
 // Interactive elements
 hasInteractiveElements?: boolean;
 // Thumbnail variants
 thumbnailOverlays?: Array<{
 type: "text" | 'image' | 'time';
 content: string;
 position: 'top' | 'bottom' | 'left' | 'right';
 style?: Record<string, any>;
 }>;
};
