import React, { _memo, _lazy, _FC, _KeyboardEvent, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useWatchLater } from '../contexts/WatchLaterContext.tsx';
import { useToggle } from '../src/hooks/unifiedHooks.ts';
import { buildTruncateClasses, buildVideoUrl, buildChannelUrl, getAvatarFallback } from '../utils/componentUtils.tsx';

import { SaveIcon } from 'icons/UnifiedIcon.tsx';
import ImageWithFallback from 'ImageWithFallback.tsx';
import { IconButton } from 'ui/Button.tsx';

import type { Video } from '../src/types/core.ts';

interface VideoCardProps {
 video: Video
}

const VideoCard = React.memo<VideoCardProps>(({ video }) => {
 const { addToWatchLater, removeFromWatchLater, isWatchLater } = useWatchLater();
 const [isSaved, toggleSaved] = useToggle(isWatchLater(video.id));
 const navigate = useNavigate();

 const videoUrl = buildVideoUrl(video.id);
 const channelUrl = buildChannelUrl(encodeURIComponent(video.channelName));
 const avatarFallback = getAvatarFallback(video.channelName);

 const handleToggleWatchLater = (e: React._MouseEvent) => {
 e.preventDefault();
 e.stopPropagation();
 if (isSaved as any) {
 removeFromWatchLater(video.id);
 } else {
 addToWatchLater(video);
 }
 toggleSaved();
 };

 const handleChannelNavigation = (e: any: React.MouseEvent | React._KeyboardEvent) => {
 e.stopPropagation();
 navigate(channelUrl);
 };

 const handleChannelKeyDown = (e: React._KeyboardEvent) => {
 if (e.key === 'Enter' || e.key === ' ') {
 handleChannelNavigation(e);
 }
 };

 return (
 <Link to={videoUrl} className="block group cursor-pointer" aria-label={`Watch ${video.title}`}>
 <div className="bg-transparent dark:bg-transparent rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-neutral-300/30 dark:hover:shadow-neutral-700/30 flex flex-col h-full">
 <div className="relative aspect-video">
 <ImageWithFallback
// FIXED:  src={video?.thumbnailUrl || ""}
// FIXED:  alt={`Thumbnail for ${video.title}`}
// FIXED:  className="w-full h-full object-cover rounded-lg"
 width={320}
 height={180}
 fallbackSrc={`https://picsum.photos/320/180?random=${video.id}`} />
 <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs sm:text-sm px-1.5 py-0.5 rounded font-medium">
 {video.duration}
 </div>
 <IconButton
 onClick={(e) => handleToggleWatchLater(e)}
 variant={isSaved ? 'primary' : 'ghost'}
 size="sm"
 className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white transition-colors z-20 group-hover:opacity-100 opacity-0 focus:opacity-100 p-1.5 sm:p-1 touch-manipulation"
 aria-label={isSaved ? 'Remove from Watch Later' : 'Save to Watch Later'}
 icon={<SaveIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
 />
 </div>
 <div className="p-2 sm:p-3 flex-grow">
 <div className="flex items-start space-x-2 sm:space-x-3">
 <div
 role="button"
 tabIndex={0}
 onClick={(e) => handleChannelNavigation(e)}
 onKeyDown={handleChannelKeyDown}
 className="flex-shrink-0 cursor-pointer z-10 relative"
 aria-label={`Go to ${video.channelName} channel`}
 >
 {video.channelAvatarUrl ? (
 <img
 src={video.channelAvatarUrl}
 alt={`${video.channelName} channel avatar`}
 className="w-8 h-8 sm:w-9 sm:h-9 rounded-full mt-0.5"
 loading="lazy"
 />
 ) : (
 <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full mt-0.5 bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
 {avatarFallback}
 </div>
 )}
 </div>
 <div className="flex-grow overflow-hidden">
 <h3 className={buildTruncateClasses(2, 'text-sm sm:text-base font-medium text-neutral-800 dark:text-neutral-50 leading-tight')}>
 {video.title}
 </h3>
 <div
 role="button"
 tabIndex={0}
 onClick={(e) => handleChannelNavigation(e)}
 onKeyDown={handleChannelKeyDown}
 className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mt-1 sm:mt-1.5 block truncate transition-colors cursor-pointer z-10 relative"
 aria-label={`Go to ${video.channelName} channel`}
 >
 {video.channelName}
 </div>
<p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
 {video.views} &bull; {video.uploadedAt}
</p>
</div>
</div>
</div>
</div>
</Link>
 );
});

VideoCard.displayName = 'VideoCard'; // For better debugging

export default VideoCard;
