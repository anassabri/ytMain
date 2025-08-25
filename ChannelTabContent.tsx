import React, { useMemo } from 'react';
import { Video, Channel } from '../types';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, PlayIcon } from '@heroicons/react/24/solid';
import { CalendarDaysIcon, ChartBarIcon, SignalSlashIcon } from '@heroicons/react/24/outline';
import { parseRelativeDate } from '../utils/dateUtils';
import VideoCard from './VideoCard';

// Type definitions for missing interfaces
interface PlaylistSummary {
  id: string;
  title: string;
  thumbnailUrl?: string;
  videoCount: number;
}

interface CommunityPost {
  id: string;
  channelName: string;
  channelAvatarUrl: string;
  timestamp: string;
  textContent: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
}

interface ChannelTabContentProps {
  activeTab: string;
  channel: Channel | null;
  videos: Video[];
  playlists: PlaylistSummary[];
  communityPosts: CommunityPost[];
  onPlaylistTabSelect: () => void;
}

const ChannelTabContent: React.FC<ChannelTabContentProps> = ({
  activeTab,
  channel,
  videos,
  playlists,
  communityPosts,
  onPlaylistTabSelect
}) => {
  const popularVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      const aViews = typeof a.views === 'string' ? parseInt(a.views.replace(/,/g, ''), 10) : Number(a.views) || 0;
      const bViews = typeof b.views === 'string' ? parseInt(b.views.replace(/,/g, ''), 10) : Number(b.views) || 0;
      return bViews - aViews;
    }).slice(0, 5);
  }, [videos]);

  const recentVideos = useMemo(() => {
    return [...videos]
      .sort((a, b) => parseRelativeDate(b.uploadedAt) - parseRelativeDate(a.uploadedAt))
      .slice(0, 10);
  }, [videos]);

  const renderHomeTab = () => {
    return (
      <div className="space-y-8 pt-4">
        {popularVideos.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Popular Videos</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-5 md:gap-y-6">
              {popularVideos.map((video) => <VideoCard key={video.id} video={video} />)}
            </div>
          </section>
        )}
        {recentVideos.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Uploads</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-5 md:gap-y-6">
              {recentVideos.map((video) => <VideoCard key={video.id} video={video} />)}
            </div>
          </section>
        )}
        {playlists.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Playlists</h2>
            {renderPlaylistsTab(true)}
          </section>
        )}
      </div>
    );
  };

  const renderVideosTab = (isShorts: boolean = false) => {
    const filteredVideos = videos.filter((v) => isShorts ? v.isShort : !v.isShort);
    if (filteredVideos.length > 0) {
      return (
        <div className={`grid grid-cols-1 ${isShorts ? 'xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7' : 'xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'} 2xl:${isShorts ? 'grid-cols-8' : 'grid-cols-5'} gap-x-3 md:gap-x-4 gap-y-5 md:gap-y-6 pt-4`}>
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      );
    }
    return <p className="text-neutral-600 dark:text-neutral-400 mt-8 text-center py-10 text-lg">This channel has no {isShorts ? 'Shorts' : 'videos'} yet.</p>;
  };

  const renderPlaylistsTab = (isHomePageSlice: boolean = false) => {
    const playlistsToRender = isHomePageSlice ? playlists.slice(0, 4) : playlists;
    if (playlistsToRender.length > 0) {
      return (
        <div className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${isHomePageSlice ? 'xl:grid-cols-4' : 'xl:grid-cols-5'} gap-x-4 md:gap-x-5 gap-y-5 md:gap-y-6 pt-4`}>
          {playlistsToRender.map((playlist) => (
            <Link to={`/playlist/${playlist.id}`} key={playlist.id} className="group block">
              <div className="relative aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-xl overflow-hidden">
                <img
                  src={playlist.thumbnailUrl || 'https://picsum.photos/seed/playlistplaceholder/320/180'}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayIcon className="w-12 h-12 text-white" aria-hidden="true" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2.5 py-2 text-white">
                  <p className="text-xs font-semibold">{playlist.videoCount} videos</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-100 mt-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">{playlist.title}</h3>
            </Link>
          ))}
          {isHomePageSlice && playlists.length > 4 && (
            <div className="flex items-center justify-center aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              <button onClick={onPlaylistTabSelect} className="text-sky-600 dark:text-sky-400 font-medium text-sm">
                View All Playlists ({playlists.length})
              </button>
            </div>
          )}
        </div>
      );
    }
    return <p className="text-neutral-600 dark:text-neutral-400 mt-8 text-center py-10 text-lg">This channel has no playlists yet.</p>;
  };

  const renderCommunityTab = () => {
    if (communityPosts.length > 0) {
      return (
        <div className="max-w-2xl mx-auto space-y-6 py-6">
          {communityPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-neutral-800/70 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700/50">
              <div className="flex items-center mb-3">
                <img src={post.channelAvatarUrl} alt={post.channelName} className="w-10 h-10 rounded-full mr-3"/>
                <div>
                  <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">{post.channelName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{post.timestamp}</p>
                </div>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap mb-3 leading-relaxed">{post.textContent}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="Community post" className="rounded-md max-h-96 w-full object-cover my-3 border border-neutral-200 dark:border-neutral-700" />}
              <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 space-x-4">
                <span>{post.likes} Likes</span>
                <span>{post.commentsCount} Comments</span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return <p className="text-neutral-600 dark:text-neutral-400 mt-8 text-center py-10 text-lg">No community posts yet.</p>;
  };

  const renderAboutTab = () => {
    if (!channel) {
      return null;
    }
    return (
      <div className="max-w-3xl py-6 text-neutral-800 dark:text-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Description</h3>
          <p className="whitespace-pre-line leading-relaxed text-sm mb-6">
            {channel.description || 'No description available for this channel.'}
          </p>
          <Link to="#" className="inline-flex items-center text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 mt-2 text-sm font-medium">
            <span>Report user</span>
            <ChevronRightIcon className="w-4 h-4 ml-1" aria-hidden="true" />
          </Link>
        </div>
        <div className="md:col-span-1 space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2 border-b pb-2 border-neutral-300 dark:border-neutral-700">Stats</h3>
          <div className="flex items-center text-sm">
            <CalendarDaysIcon className="w-5 h-5 mr-2.5 text-neutral-500 dark:text-neutral-400 flex-shrink-0" aria-hidden="true" />
            <span>Joined {channel.joinedDate || 'N/A'}</span>
          </div>
          <div className="flex items-center text-sm">
            <ChartBarIcon className="w-5 h-5 mr-2.5 text-neutral-500 dark:text-neutral-400 flex-shrink-0" aria-hidden="true" />
            <span>{channel.totalViews || '0'} views</span>
          </div>
        </div>
      </div>
    );
  };

  const renderLiveTab = () => {
    return (
      <div className="text-center py-16 text-neutral-600 dark:text-neutral-400 mt-8">
        <SignalSlashIcon className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" />
        <h2 className="text-xl font-semibold mb-2 text-neutral-800 dark:text-neutral-200">This channel isn't live right now</h2>
        <p className="text-sm">Check back later or see if there are any scheduled upcoming streams.</p>
      </div>
    );
  };

  switch (activeTab) {
    case 'HOME': return renderHomeTab();
    case 'VIDEOS': return renderVideosTab(false);
    case 'SHORTS': return renderVideosTab(true);
    case 'LIVE': return renderLiveTab();
    case 'PLAYLISTS': return renderPlaylistsTab();
    case 'COMMUNITY': return renderCommunityTab();
    case 'ABOUT': return renderAboutTab();
    default: return <p className="text-neutral-600 dark:text-neutral-400 mt-8 text-center py-10 text-lg">Content not available.</p>;
  }
};

export default ChannelTabContent;
