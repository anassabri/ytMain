// Enhanced Live Streaming Types
export interface LiveStream {
 id: string;
 title: string;
 description: string;
 thumbnailUrl: string;
 streamUrl: string;
 streamKey: string;
 category: string;
 tags: string;
 visibility: 'public' | 'unlisted' | 'private';
 status: 'scheduled' | 'live' | 'ended' | 'error';
 scheduledStartTime?: Date;
 actualStartTime?: Date;
 endTime?: Date;
 creatorId: string;
 creatorName: string;
 creatorAvatar: string;
 settings: LiveStreamSettings;
 stats: LiveStreamStats;
 monetization: LiveStreamMonetization
}

export interface LiveStreamSettings {
 enableChat: boolean;
 enableSuperChat: boolean;
 enablePolls: boolean;
 enableQA: boolean;
 chatMode: 'live' | 'top' | 'off';
 slowMode: number; // seconds between messages,
 subscribersOnly: boolean;
 moderationLevel: 'strict' | 'moderate' | 'relaxed';
 quality: '720p' | '1080p' | '1440p' | '4k';
 bitrate: number;
 frameRate: 30 | 60;
 enableRecording: boolean;
 enableMultiplatform: boolean;
 platforms: StreamPlatform
}

export interface StreamPlatform {
 name: 'youtube' | 'twitch' | 'facebook' | 'twitter';
 enabled: boolean;
 streamKey?: string;
 settings?: Record<string, any>;
}

export interface LiveStreamStats {
 viewers: number;
 peakViewers: number;
 averageViewers: number;
 duration: number;
 likes: number;
 dislikes: number;
 chatMessages: number;
 superChatAmount: number;
 superChatCount: number;
 pollVotes: number;
 qaQuestions: number;
 streamHealth: 'excellent' | 'good' | 'fair' | 'poor';
 bitrate: number;
 frameDrops: number;
 latency: number
}

export interface LiveStreamMonetization {
 totalRevenue: number;
 superChatRevenue: number;
 adRevenue: number;
 membershipRevenue: number;
 donationRevenue: number;
 superChats: SuperChat
}

export interface ChatMessage {
 id: string;
 userId: string;
 username: string;
 message: string;
 timestamp: Date;
 type: "message" | 'super_chat' | 'membership' | 'system';
 isModerator: boolean;
 isOwner: boolean;
 isVerified: boolean;
 badges: ChatBadge;
 superChat?: SuperChat;
 membership?: MembershipInfo;
 deleted?: boolean;
 deletedBy?: string;
 edited?: boolean;
 editedAt?: Date;
}

export interface SuperChat {
 id: string;
 userId?: string;
 username?: string;
 amount: number;
 currency: string;
 message: string;
 timestamp?: Date;
 color: string;
 duration: number
}

export interface ChatBadge {
 type: "moderator" | 'owner' | 'member' | 'verified' | 'subscriber';
 label: string;
 color?: string;
 icon?: string;
}

export interface MembershipInfo {
 level: string;
 duration: number; // months,
 badge: string;
 perks: string
}

export interface LivePoll {
 id: string;
 streamId?: string;
 question: string;
 options: PollOption;
 isActive: boolean;
 totalVotes: number;
 createdAt: Date;
 duration: number; // in milliseconds
 endedAt?: Date;
}

export interface PollOption {
 id: string;
 text: string;
 votes: number;
 percentage: number
}

export interface QAQuestion {
 id: string;
 streamId?: string;
 userId: string;
 username: string;
 question: string;
 answer?: string;
 answered: boolean;
 isAnswered?: boolean;
 timestamp: Date;
 answeredAt?: Date;
 isHighlighted: boolean;
 upvotes?: number;
}

export interface ChatModerationAction {
 type: "timeout" | 'ban' | 'delete' | 'warn' | 'approve';
 userId: string;
 moderatorId: string;
 reason: string;
 duration?: number; // minutes for timeout,
 timestamp: Date
}

export interface StreamReplay {
 id: string;
 streamId: string;
 title: string;
 description?: string;
 thumbnailUrl: string;
 videoUrl: string;
 duration: number;
 createdAt: Date;
 views: number;
 isProcessing?: boolean;
}

export interface StreamHighlight {
 id: string;
 timestamp: number; // seconds from start,
 title: string;
 description?: string;
 type: "moment" | 'super_chat' | 'poll' | 'qa' | 'milestone';
 data?;
}
