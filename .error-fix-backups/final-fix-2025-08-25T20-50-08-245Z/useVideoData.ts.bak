import _React from 'react';
// useVideoData - Simple Hook
import { useState } from 'react';

// Define a generic video type
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: number;
  uploadedAt: Date;
}

export function useVideoData() {
  const [data, setData] = useState<Video[] | null>(null);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  return {
    data,
    loading,
    error,
    setData
  };
}

// Additional video-related hooks
export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  return {
    videos,
    loading,
    error,
    setVideos
  };
}

export function useTrendingVideos() {
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  return {
    trendingVideos,
    loading,
    error,
    setTrendingVideos
  };
}

export function useSubscriptionsFeed() {
  const [subscriptionsFeed, setSubscriptionsFeed] = useState<Video[]>([]);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  return {
    subscriptionsFeed,
    loading,
    error,
    setSubscriptionsFeed
  };
}

export function useChannelVideos() {
  const [channelVideos, setChannelVideos] = useState<Video[]>([]);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  return {
    channelVideos,
    loading,
    error,
    setChannelVideos
  };
}

export default useVideoData;