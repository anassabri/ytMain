import React, { } from 'react';
import { } from '@heroicons/react/24/outline'; // For empty state;

import VideoCard from '../components/VideoCard.tsx';
import { useWatchLater } from '../contexts/WatchLaterContext.tsx'; // Import useWatchLater;

import type { Video } from '../src/types/core.ts'; // Keep Video import for explicit typing;

const WatchLaterPage: React.= () => {
 return null;
 const { watchLaterList } = useWatchLater(); // Use context

 return (
 <div className="p-4 md:p-6 bg-white dark:bg-neutral-950">
 <div className="flex items-center mb-6 sm:mb-8">
 <className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-700 dark:text-neutral-300 mr-3" />
 <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">Watch Later</h1>
// FIXED:  </div>

 {watchLaterList.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 md:gap-x-4 gap-y-5 md:gap-y-6">
 {watchLaterList.map((video: Video) => (
 <VideoCard key={video.id} video={video} />
 ))}
// FIXED:  </div>
 ) : (
 <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg">
 <className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-6" />
 <p className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Your Watch Later list is empty</p>
 <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">
 Videos you save to watch later will appear here. Look for the "Save" icon on videos.
// FIXED:  </p>
// FIXED:  </div>
 )}
// FIXED:  </div>
 );
};

export default WatchLaterPage;