import React, { useState, useEffect, _FC } from 'react';
import { Channel } from '../types';
import { useParams } from 'react-router-dom';
import ChannelHeader from '../../components/ChannelHeader';
import ChannelTabContent from '../../components/ChannelTabContent';
import ChannelTabs from '../../components/ChannelTabs';
import ChannelPageSkeleton from '../../components/LoadingStates/ChannelPageSkeleton';
import { getChannelByName, getVideosByChannelName, getChannelPlaylists, getChannelCommunityPosts } from '../services/realVideoService.ts';
import type { Video } from '../types.ts';

interface PlaylistSummary {
  id: string;
  title: string;
  description?: string;
  videoCount: number;
  thumbnailUrl?: string;
}

interface CommunityPost {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
}

const ChannelPage: React._FC = () => {
  const { channelIdOrName } = useParams<{ channelIdOrName: string }>();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [channelPlaylists, setChannelPlaylists] = useState<PlaylistSummary[]>([]);
  const [channelCommunityPosts, setChannelCommunityPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('HOME');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const tabs = [
    { id: 'HOME', label: 'Home' },
    { id: 'VIDEOS', label: 'Videos' },
    { id: 'SHORTS', label: 'Shorts' },
    { id: 'LIVE', label: 'Live' },
    { id: 'PLAYLISTS', label: 'Playlists' },
    { id: 'COMMUNITY', label: 'Community' },
    { id: 'ABOUT', label: 'About' }
  ];

  useEffect(() => {
    const fetchChannelData = async (): Promise<void> => {
      if (!channelIdOrName) {
        setError('Channel identifier is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      setActiveTab('HOME'); // Reset to home on new channel load
      setIsSubscribed(Math.random() > 0.5);

      try {
        const decodedName = decodeURIComponent(channelIdOrName);
        const fetchedChannel = await getChannelByName(decodedName);

        if (fetchedChannel) {
          setChannel(fetchedChannel);
          // Fetch all data concurrently
          const [
            fetchedVideos,
            fetchedPlaylists,
            fetchedCommunityPosts
          ] = await Promise.all([
            getVideosByChannelName(fetchedChannel.name || decodedName),
            getChannelPlaylists(fetchedChannel.name || decodedName),
            getChannelCommunityPosts(fetchedChannel.name || decodedName)
          ]);
          setVideos(fetchedVideos);
          setChannelPlaylists(fetchedPlaylists);
          setChannelCommunityPosts(fetchedCommunityPosts);
        } else {
          // Create a mock channel if not found
          const mockChannel = {
            id: decodedName,
            name: decodedName,
            description: `Channel for ${decodedName}`,
            avatarUrl: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=CH',
            banner: 'https://via.placeholder.com/1280/320/4ECDC4/FFFFFF?text=Channel+Banner',
            subscribers: 0,
            subscriberCount: '0',
            videoCount: 0,
            isVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setChannel(mockChannel);

          // Fetch videos for the channel name
          const fetchedVideos = await getVideosByChannelName(decodedName);
          setVideos(fetchedVideos);
          setChannelPlaylists([]);
          setChannelCommunityPosts([]);
        }
      } catch (err) {
        console.error('Error fetching channel data:', err);
        setError('Failed to load channel data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData().catch(() => {
      // Handle promise rejection silently
    });
    window.scrollTo(0, 0);
  }, [channelIdOrName]);

  const handleSubscribeToggle = () => {
    setIsSubscribed(prev => !prev);
  };

  if (loading) {
    return <ChannelPageSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400 text-lg">
        {error}
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="p-6 text-center text-neutral-600 dark:text-neutral-400 text-lg">
        Channel not found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-full">
      <ChannelHeader
        channel={channel}
        videoCount={videos.length}
        isSubscribed={isSubscribed}
        onSubscribeToggle={handleSubscribeToggle}
      />

      <div className="px-4 md:px-6 lg:px-8">
        <ChannelTabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      </div>

      <div className="px-4 md:px-6 lg:px-8 py-1 sm:py-2 md:py-3">
        <ChannelTabContent
          activeTab={activeTab}
          channel={channel}
          videos={videos}
          playlists={channelPlaylists}
          communityPosts={channelCommunityPosts}
          onPlaylistTabSelect={() => setActiveTab('PLAYLISTS')}
        />
      </div>
    </div>
  );
};

export default ChannelPage;