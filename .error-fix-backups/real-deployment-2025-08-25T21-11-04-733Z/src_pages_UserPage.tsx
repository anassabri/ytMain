import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {ChatBubbleLeftRightIcon, HistoryIcon} from '@heroicons/react/24/outline';
import { PlayIcon, UserIcon } from '@heroicons/react/24/solid';
import VideoCard from '../components/VideoCard';
import { getVideos } from '../services/realVideoService';
import type { Video } from '../types';

const UserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(1234567);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userVideos = await getVideos();
        setVideos(userVideos.slice(0, 12));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    setSubscriberCount(prev => isSubscribed ? prev - 1 : prev + 1);
  };

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const tabs = [
    { id: 'videos', label: 'Videos', icon: PlayIcon },
    { id: 'playlists', label: 'Playlists', icon: },
    { id: 'community', label: 'Community', icon: ChatBubbleLeftRightIcon },
    { id: 'about', label: 'About', icon: },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        );
      case 'playlists':
        return (
          <div className="text-center py-12">
            <HistoryIcon className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">No playlists available</p>
          </div>
        );
      case 'community':
        return (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">No community posts yet</p>
          </div>
        );
      case 'about':
        return (
          <div className="max-w-2xl">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">About this channel</h3>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
                <p>Welcome to our channel! We create amazing content for our viewers.</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Joined</p>
                    <p>Jan 1, 2020</p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Views</p>
                    <p>10.5M total views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Channel Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm mb-8">
          {/* Banner */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-red-500 to-red-600 rounded-t-lg"></div>
          
          {/* Channel Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 sm:-mt-16">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-neutral-700 rounded-full border-4 border-white dark:border-neutral-800 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400" />
              </div>
              
              {/* Channel Details */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                  Channel Name
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-neutral-600 dark:text-neutral-400">
                  <span>@channelhandle</span>
                  <span>{formatSubscriberCount(subscriberCount)} subscribers</span>
                  <span>123 videos</span>
                </div>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  Welcome to our amazing channel! We create content that you'll love.
                </p>
              </div>
              
              {/* Subscribe Button */}
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <button className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">
                  <HistoryIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
                <button
                  onClick={handleSubscribe}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    isSubscribed
                      ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <HistoryIcon className="w-4 h-4 inline mr-2" />
                      Subscribed
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm mb-8">
          <nav className="flex border-b border-neutral-200 dark:border-neutral-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserPage;