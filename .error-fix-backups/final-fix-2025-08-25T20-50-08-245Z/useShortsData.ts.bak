import _React from 'react';
// useShortsData - Simple Hook
import { useState } from 'react';

// Define a generic short video type
interface ShortVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: number;
  createdAt: Date;
}

export function useShortsData() {
  const [data, setData] = useState<ShortVideo[] | null>(null);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  return {
    data,
    loading,
    error,
    setData
  };
}

// Additional shorts-related hook
export function useShortsVideos() {
  const [shortsVideos, setShortsVideos] = useState<ShortVideo[]>([]);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  return {
    shortsVideos,
    loading,
    error,
    setShortsVideos
  };
}

export default useShortsData;