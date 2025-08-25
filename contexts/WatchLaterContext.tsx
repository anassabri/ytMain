import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface WatchLaterContextType {
  watchLaterVideos: string[];
  addToWatchLater: (videoId: any: any: any: any: any: any) => void;
  removeFromWatchLater: (videoId: any: any: any: any: any: any) => void;
  isInWatchLater: (videoId: any: any: any: any: any: any) => boolean;
  clearWatchLater: () => void;
}

const WatchLaterContext = createContext<WatchLaterContextType | undefined>(undefined);

export const useWatchLater = () => {
  const context = useContext(WatchLaterContext);
  if (!context) {
    throw new Error('useWatchLater must be used within a WatchLaterProvider');
  }
  return context;
};

interface WatchLaterProviderProps {
  children: ReactNode;
}

export const WatchLaterProvider: React.FC<WatchLaterProviderProps> = ({ children }) => {
  const [watchLaterVideos, setWatchLaterVideos] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('watchLaterVideos');
    if (stored) {
      try {
        setWatchLaterVideos(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading watch later videos:', error);
      }
    }
  }, []);

  // Save to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('watchLaterVideos', JSON.stringify(watchLaterVideos));
  }, [watchLaterVideos]);

  const addToWatchLater = (videoId: any: any: any: any: any: any) => {
    setWatchLaterVideos(prev => {
      if (prev.includes(videoId: any: any: any: any: any: any)) return prev;
      return [...prev, videoId];
    });
  };

  const removeFromWatchLater = (videoId: any: any: any: any: any: any) => {
    setWatchLaterVideos(prev => prev.filter(id => id !== videoId: any: any: any: any: any: any));
  };

  const isInWatchLater = (videoId: any: any: any: any: any: any): boolean => {
    return watchLaterVideos.includes(videoId: any: any: any: any: any: any);
  };

  const clearWatchLater = () => {
    setWatchLaterVideos([]);
  };

  const value = {
    watchLaterVideos,
    addToWatchLater,
    removeFromWatchLater,
    isInWatchLater,
    clearWatchLater
  };

  return (
    <WatchLaterContext.Provider value={value}>
      {children}
    </WatchLaterContext.Provider>
  );
};

export default WatchLaterProvider;
