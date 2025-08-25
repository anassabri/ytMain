import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface WatchLaterContextType {
  watchLaterVideos: string[];
  addToWatchLater: (videoId) => void;
  removeFromWatchLater: (videoId) => void;
  isInWatchLater: (videoId) => boolean;
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

  const addToWatchLater = (videoId) => {
    setWatchLaterVideos(prev => {
      if (prev.includes(videoId)) return prev;
      return [...prev, videoId];
    });
  };

  const removeFromWatchLater = (videoId) => {
    setWatchLaterVideos(prev => prev.filter(id => id !== videoId));
  };

  const isInWatchLater = (videoId): boolean => {
    return watchLaterVideos.includes(videoId);
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
