import React, { MouseEvent, FC, useState, useEffect, useRef, lazy } from 'react';
/// <reference types="node" />
import { Link } from 'react-router-dom';

declare namespace NodeJS {
 interface ProcessEnv {
 [key: string]: string | undefined
 }
 interface Process {
 env: ProcessEnv;
 }
}

import { formatDistanceToNow } from 'date-fns';

import { getYouTubeVideoId } from '../src/lib/youtube-utils.ts';

import ImageWithFallback from 'ImageWithFallback.tsx';

import type { Video } from '../types.ts';

interface HoverAutoplayVideoCardProps {
 video: Video;
 className?: string;
}

const HoverAutoplayVideoCard: React.FC<HoverAutoplayVideoCardProps> = ({ video, className = '' }: any) => {
 const [isHovered, setIsHovered] = useState<boolean>(false);
 const [showIframe, setShowIframe] = useState<boolean>(false);
 const [hasError, setHasError] = useState<boolean>(false);
 const [isMuted, setIsMuted] = useState<boolean>(true);
 const [iframeKey, setIframeKey] = useState<number>(0);
 const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 // Configuration constants
 const HOVER_DELAY = 500; // Delay before showing video preview in milliseconds
 const HIDE_DELAY = 100; // Delay before hiding video preview in milliseconds

 // Extract YouTube video ID from the video
 const getVideoId = (video: Video): string | null => {
 // Try to extract from video.id if it has prefixes
 if (video.id.startsWith('youtube-')) {
 return video.id.replace('youtube-', '');
 }
 if (video.id.startsWith('google-search-')) {
 return video.id.replace('google-search-', '');
 }

 // Try to extract from videoUrl if available
 if (video.videoUrl) {
 return getYouTubeVideoId(video.videoUrl);
 }

 // If id looks like a YouTube video ID (11 characters)
 if (video.id.length === 11 && /^[a-zA-Z0-9_-]+$/.test(video.id)) {
 return video.id;
 }

 return null;
 };

 const videoId = getVideoId(video);

 const formatDuration = (duration: string | number) => {
 if (typeof duration === 'string') {
return duration;
}
 if (typeof duration === 'number') {
 const minutes = Math.floor(duration / 60);
 const seconds = duration % 60;
 return `${minutes}:${seconds.toString().padStart(2, '0')}`;
 }
 return '0: 00'
 };

 const formatViews = (views: string | number) => {
 const num = typeof views === 'string' ? parseInt(views, 10) || 0 : views || 0;
 if (num >= 1000000000) {
 return `${(num / 1000000000).toFixed(1)}B`;
 } else if (num >= 1000000) {
 return `${(num / 1000000).toFixed(1)}M`;
 } else if (num >= 1000) {
 return `${(num / 1000).toFixed(1)}K`;
 }
 return num.toString();
 };

 const handleMouseEnter = () => {
 setIsHovered(true);

 // Clear any existing hide timeout
 if (hideTimeoutRef.current) {
 clearTimeout(hideTimeoutRef.current);
 hideTimeoutRef.current = null;
 }

 // Only show iframe if we have a valid video ID and no previous errors
 if (videoId && !hasError) {
 // Set a timeout to show the iframe after hovering for configured delay
 hoverTimeoutRef.current = setTimeout((() => {
 setShowIframe(true);
 }) as any, HOVER_DELAY);
 }
 };

 const handleMouseLeave = () => {
 setIsHovered(false);

 // Clear the hover timeout if user leaves before delay completes
 if (hoverTimeoutRef.current) {
 clearTimeout(hoverTimeoutRef.current);
 hoverTimeoutRef.current = null;
 }

 // Hide iframe after a brief delay to prevent flickering
 hideTimeoutRef.current = setTimeout((() => {
 setShowIframe(false);
 // Reset mute state for next hover
 setIsMuted(true);
 }) as any, HIDE_DELAY);
 };

 // Handle iframe errors
 const handleIframeError = () => {
 (console as any).warn('YouTube iframe failed to load for video:', videoId);
 setHasError(true);
 setShowIframe(false);
 };

 // Toggle mute/unmute
 const toggleMute = (e: React.MouseEvent) => {
 e.preventDefault();
 e.stopPropagation();
 setIsMuted(!isMuted);
 // Force iframe reload to apply mute setting
 setIframeKey(prev => prev + 1);
 };

 // Cleanup timeouts on unmount
 useEffect(() => {
 return () => {
 if (hoverTimeoutRef.current) {
 clearTimeout(hoverTimeoutRef.current);
 }
 if (hideTimeoutRef.current) {
 clearTimeout(hideTimeoutRef.current);
 }
 }}, []);

 return (
 <div
  className={`group cursor-pointer ${className}`}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
 >
 {/* Video Thumbnail/Player */}
 <div className="relative mb-3">
 <Link to={`/watch/${video.id}`}>
 <div className="relative w-full" style={{ height: '250px' }}>
 {/* Thumbnail - always visible as background */}
 <ImageWithFallback
 src={video.thumbnailUrl || video.thumbnail}
  alt={video.title}
  className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-all duration-300 ${
   showIframe ? 'opacity-0' : 'opacity-100 group-hover:rounded-lg'
  }`}
 width={320}
 height={250}
 fallbackSrc={`https://picsum.photos/320/250?random=${video.id}`}
 />

 {/* YouTube iframe - shown on hover */}
 {showIframe && videoId && (
 <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden bg-black">
 <iframe
 key={`hover-${videoId}-${iframeKey}`} // Force remount when mute changes
 src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&rel=0&modestbranding=1&playsinline=1&fs=0&disablekb=1&iv_load_policy=3&start=0&end=30&loop=1&playlist=${videoId}&origin=${encodeURIComponent(window.location.origin)}&enablejsapi=0`}
 title={`Preview: ${video.title}`}
 className="w-full h-full border-0"
 allow="autoplay; encrypted-media"
 allowFullScreen={false}
 loading="lazy"
 style={{
  pointerEvents: 'none',
  border: 'none',
  outline: 'none'
 }}
 onError={handleIframeError}
 />

 {/* Mute/Unmute Button */}
 <button
  onClick={toggleMute}
  className="absolute bottom-2 left-2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200 z-10"
  style={{ pointerEvents: 'auto' }}
  title={isMuted ? 'Unmute video' : 'Mute video'}
 >
 {isMuted ? (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
 {/* Muted speaker icon */}
 <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
</svg>
 ) : (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
 {/* Unmuted speaker icon */}
 <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
</svg>
 )}
</button>
</div>
 )}

 {/* Duration Badge */}
 {video.duration && video.duration !== '0:00' && (
 <div className={`absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-sm font-medium transition-opacity duration-200 ${
 showIframe ? 'opacity-0' : 'opacity-100'
 }`}>
 {formatDuration(video.duration)}
</div>
 )}

 {/* Hover indicator */}
 {isHovered && !showIframe && videoId && (
 <div className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-sm font-medium ${
 hasError ? 'bg-gray-600' : 'bg-red-600'
 }`}>
 {hasError ? 'Thumbnail Only' : 'Preview'}
</div>
 )}
</div>
</Link>
  </div>

 {/* Video Info */}
 <div className="flex gap-3">
 {/* Channel Avatar */}
 {(video.channelAvatarUrl || video.thumbnail) && (
 <Link to={`/channel/${video.channelId}`} className="flex-shrink-0">
 <ImageWithFallback
 src={video.channelAvatarUrl || video.thumbnail}
  alt={video.channelName || video.channelTitle || 'Channel'}
  className="w-9 h-9 rounded-full object-cover"
 width={36}
 height={36}
 fallbackSrc={`https://picsum.photos/36/36?random=${video.channelId || video.channelName || 'channel'}`}
 />
</Link>
 )}

 {/* Video Details */}
 <div className="flex-1 min-w-0">
 {/* Video Title */}
 <Link to={`/watch/${video.id}`}>
 <h3 className="font-medium text-black dark:text-white line-clamp-2 text-sm leading-5 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
 {video.title}
</h3>
</Link>

 {/* Channel Name */}
 <Link to={`/channel/${video.channelId}`}>
 <p className="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-white transition-colors">
 {video.channelName || video.channelTitle || 'Unknown Channel'}
</p>
</Link>

 {/* Views and Upload Time */}
 <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
 <span>{formatViews(video.views)} views</span>
 <span className="mx-1">•</span>
 <span>
 {(() => {
 try {
 const date = new Date(video.uploadedAt || Date.now());
 if (isNaN(date.getTime())) {
 return 'Recently';
 }
 return formatDistanceToNow(date, { addSuffix: true });
 } catch (e) {
 return 'Recently';
 }
 })()}
</span>
</div>
</div>
</div>
</div>
 );
};

export default HoverAutoplayVideoCard;
