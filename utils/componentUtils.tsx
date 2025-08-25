import React, { ReactNode, _FC, useCallback, useMemo } from 'react';
// Component utilities and helpers
// Type definitions
export interface TruncateOptions {
 maxLength?: number;
 suffix?: string;
 preserveWords?: boolean;
}

export interface ComponentWrapperProps {
 children?: React.ReactNode;
 className?: string;
 fallback?: ReactNode;
}

// Utility functions for components
export const truncateText = (text: string,
 maxLength: number = 100, suffix = '...') => {
 if (text.length <= maxLength) return text;
 return text.slice(0, maxLength) + suffix;
};

export const formatDuration = (seconds: number): string => {
 const hours = Math.floor(seconds / 3600);
 const minutes = Math.floor((seconds % 3600) / 60);
 const secs = Math.floor(seconds % 60);

 if (hours > 0) {
 return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
 }
 return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatViews = (views: number): string => {
 if (views >= 1000000) {
   return `${(views / 1000000).toFixed(1)}M views`;
 } else if (views >= 1000) {
   return `${(views / 1000).toFixed(1)}K views`;
 }
 return `${views} views`;
};

export const formatDate = (date: string | Date): string => {
 const d = new Date(date);
 const now = new Date();
 const diffTime = Math.abs(now.getTime() - d.getTime());
 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

 if (diffDays === 1) return 'Yesterday';
 if (diffDays < 7) return `${diffDays} days ago`;
 if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
 if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
 return `${Math.ceil(diffDays / 365)} years ago`;
};

// Component wrapper utilities
export const ComponentWrapper: React.FC<ComponentWrapperProps> = ({
 children, 
 className = '', 
 fallback = null 
}) => {
 try {
 return <div className={className}>{children}</div>;
 } catch (error) {
 (console as any).error('Component error:', error);
 return <>{fallback}</>;
 }
 };

// Build truncate classes utility
export const buildTruncateClasses = (
 lines: number = 1,
 baseClasses = ''
): string => {
 const truncateClass = lines === 1 ? 'truncate' : `line-clamp-${lines}`;
 return `${baseClasses} ${truncateClass}`.trim();
};

// Safe localStorage utility
export const safeLocalStorage = {
 getItem: (key: string): string | null => {
   try {
     if (typeof window !== 'undefined') {
       return (localStorage as any).getItem(key);
     }
   } catch (error) {
     (console as any).warn('localStorage getItem failed:', error);
   }
   return null;
 },

 setItem: (key: string, value: string | number): boolean => {
   try {
     if (typeof window !== 'undefined') {
       (localStorage as any).setItem(key, String(value));
       return true;
     }
   } catch (error) {
     (console as any).warn('localStorage setItem failed:', error);
   }
   return false;
 },

 removeItem: (key: string): boolean => {
   try {
     if (typeof window !== 'undefined') {
       localStorage.removeItem(key);
       return true;
     }
   } catch (error) {
     (console as any).warn('localStorage removeItem failed:', error);
   }
   return false;
 }
};

// Performance utilities
export const memo = React.memo;
export const useMemo = React.useMemo;
export const useCallback = React.useCallback;

// Export all utilities
export default {
 truncateText,
 formatDuration,
 formatViews,
 formatDate,
 ComponentWrapper,
 buildTruncateClasses,
 safeLocalStorage,
 memo: React.memo,
 useMemo: React.useMemo,
 useCallback: React.useCallback
};

// Additional utility functions
export const buildVideoUrl = (videoId: string): string => {
 return `/watch?v=${videoId}`;
};

export const buildChannelUrl = (channelId: string): string => {
 return `/channel/${channelId}`;
};

export const getAvatarFallback = (name: string): string => {
 return name.charAt(0).toUpperCase();
};
