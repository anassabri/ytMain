import React, { ReactNode } from 'react';
// Common TypeScript interfaces and types

export interface BaseComponent {
 className?: string;
 children?: React.ReactNode;
}

export interface LoadingState {
 isLoading: boolean;
 error?: string | null;
}

export interface PaginationState {
 page: number;
 pageSize: number;
 total: number;
 hasNextPage: boolean;
 hasPreviousPage: boolean
}

export interface Video {
 id: string;
 title: string;
 description: string;
 thumbnail: string;
 duration: string;
 views: number;
 publishedAt: string;
 channelId: string;
 channelTitle: string
}

export interface Channel {
 id: string;
 title: string;
 description: string;
 thumbnail: string;
 subscriberCount: number;
 videoCount: number
}

export interface Playlist {
 id: string;
 title: string;
 description: string;
 thumbnail: string;
 videoCount: number;
 channelId: string;
 channelTitle: string
}

export interface ApiResponse<T> {
 data: T;
 success: boolean;
 message?: string;
 error?: string;
}

export interface SearchFilters {
 query?: string;
 type?: 'video' | 'channel' | 'playlist';
 duration?: 'short' | 'medium' | 'long';
 uploadDate?: 'hour' | 'today' | 'week' | 'month' | 'year';
 sortBy?: 'relevance' | 'date' | 'views' | 'rating';
}

export type ComponentSize = 'small' | 'medium' | 'large';
export type ComponentVariant =
 | 'primary'
 | 'secondary'
 | 'success'
 | 'warning'
 | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';
