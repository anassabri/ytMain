// Core type definitions - unified interface
export interface Video {
 id: string;
 title: string;
 description?: string;
 thumbnail: string;
 thumbnailUrl?: string; // Alias for thumbnail,
 duration: string;
 views: number | string;
 publishedAt: string;
 channelId: string;
 channelTitle: string;
 category?: string;
 // Additional properties for compatibility
 videoUrl?: string;
 likes?: number;
 dislikes?: number;
 uploadedAt?: string;
 channelName?: string; // Alternative name field
 channelAvatarUrl?: string; // Channel avatar URL
 isLive?: boolean; // Live stream indicator
 viewCount?: number; // View count for sorting
 dislikeCount?: number; // Dislike count
 categoryId?: string; // Category ID
 buffered?: TimeRanges; // Buffered time ranges
 tags?: string | string[]; // Video tags
 likeCount?: number; // Some code uses likeCount
 visibility?: string;
 metadata?;
 statistics?: {
 viewCount?: number;
 likeCount?: number;
 commentCount?: number;
 favoriteCount?: number;
 contentDetails?: {
 definition?: string;
 dimension?: string;
 caption?: string;
 licensedContent?: boolean;
 projection?: string;
 privacyStatus?: string;
 isShort?: boolean;
 createdAt?: string;
 updatedAt?: string;
 };
 privacyStatus?: string;
 isShort?: boolean;
 createdAt?: string;
 updatedAt?: string;
 definition?: string;
 };
 contentDetails?: {
 definition?: string;
 dimension?: string;
 caption?: string;
 licensedContent?: boolean;
 projection?: string;
 };
 privacyStatus?: string;
 isShort?: boolean;
 createdAt?: string;
 updatedAt?: string;
 definition?: string;
 commentCount?: number;
}

export interface Short extends Video {
 isShort: true
}

export interface User {
 id: string;
 name: string;
 email: string;
 avatar?: string;
}

export interface Channel {
 id: string;
 title: string;
 description?: string;
 thumbnail: string;
 subscriberCount: number;
 videoCount: number;
 name?: string; // Display name
 avatarUrl?: string; // Avatar image URL
 subscribers?: number | string; // Subscriber count
 joinedDate?: string; // Date joined
 totalViews?: number; // Total channel views
 isVerified?: boolean;
}

export interface Playlist {
 id: string;
 title: string;
 description?: string;
 thumbnail: string;
 videoCount: number;
 channelId: string;
 channelTitle: string;
 visibility?: string;
 tags?: string;
 updatedAt?: string;
 totalDuration?: string;
 ownerName?: string;
 thumbnailUrl?: string;
}

export interface Comment {
 id: string;
 text: string;
 authorName: string;
 authorAvatar?: string;
 publishedAt: string;
 likeCount: number;
 replies?: Comment[];
 content?: string;
 likes?: number;
 isPinned?: boolean;
 isHearted?: boolean;
 createdAt?: string;
 videoId?: string;
 parentId?: string;
 replyCount?: number;
}

export interface VideoItem extends Video {
 // Additional properties for video grid items
}

// Re-export for compatibility
export type { Video as CoreVideo };
