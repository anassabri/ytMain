import React, { FC } from 'react';
import BellIcon from './icons/BellIcon';
import type { Channel } from '../src/types/core';

export interface ChannelHeaderProps {
  channel: Channel;
  videoCount: number;
  isSubscribed: boolean;
  onSubscribeToggle: () => void;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({
  channel,
  videoCount,
  isSubscribed,
  onSubscribeToggle
}) => {
  const channelName = channel.name || channel.title;
  const subscriberCount = channel.subscribers || channel.subscriberCount;

  return (
    <>
      {/* Channel Banner */}
      <div className="h-32 sm:h-48 md:h-56 lg:h-64 bg-neutral-200 dark:bg-neutral-700/30">
        <img
          src={channel.bannerUrl || 'https://picsum.photos/seed/default_banner/1200/400'}
          alt={`${channelName} banner`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/seed/default_banner/1200/400';
          }}
        />
      </div>

      {/* Channel Info */}
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-10 sm:-mt-12 md:-mt-16 mb-4 sm:mb-6 relative z-10">
          {/* Avatar */}
          <img
            src={channel.avatarUrl || 'https://picsum.photos/seed/default_avatar/160/160'}
            alt={`${channelName} avatar`}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-neutral-800 shadow-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://picsum.photos/seed/default_channel_avatar/160/160';
            }}
          />

          {/* Channel Details */}
          <div className="flex-grow mt-3 sm:mt-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50">
              {channelName}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              @{channelName?.toLowerCase().replace(/\s+/g, '')} &bull; {subscriberCount} subscribers &bull; {videoCount} videos
            </p>
          </div>

          {/* Subscribe Button */}
          <div className="mt-4 sm:mt-0 sm:ml-auto flex-shrink-0">
            <button
              onClick={onSubscribeToggle}
              className={`
                px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-2
                ${
                  isSubscribed
                    ? 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200'
                    : 'bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black'
                }
              `}
              title={isSubscribed ? `Unsubscribe from ${channelName}` : `Subscribe to ${channelName}`}
            >
              <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
              {isSubscribed && <BellIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelHeader;