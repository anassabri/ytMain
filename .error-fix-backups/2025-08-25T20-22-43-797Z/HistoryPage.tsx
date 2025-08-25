import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import VideoCard from '../../components/VideoCard';
import { getWatchHistoryVideos } from '../services/realVideoService';
import type { Video } from '../types';

const HistoryPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async (): Promise<void> => {
      setLoading(true);
      try {
        const historyVideos = await getWatchHistoryVideos();
        setVideos(historyVideos);
      } catch (error) {
        console.error('Failed to fetch watch history:', error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 md:gap-x-4 gap-y-5 md:gap-y-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-neutral-800/60 rounded-xl shadow-sm animate-pulse">
          <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-t-xl" />
          <div className="p-3 sm:p-4">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2" />
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-1" />
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-neutral-950">
      <div className="flex items-center mb-6 sm:mb-8">
        <ClockIcon className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-700 dark:text-neutral-300 mr-3" />
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">Watch History</h1>
      </div>

      {loading ? (
        renderSkeleton()
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 md:gap-x-4 gap-y-5 md:gap-y-6">
          {videos.map((video) => (
            <VideoCard key={`${video.id}-history`} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg">
          <ClockIcon className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-6" />
          <p className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Your watch history is empty</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">
            Videos you watch will appear here. Start exploring and they'll show up!
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;