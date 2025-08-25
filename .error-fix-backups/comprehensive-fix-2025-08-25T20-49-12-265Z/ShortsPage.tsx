import React, { useState, useEffect, useMemo, useCallback, useRef, KeyboardEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { } from '@heroicons/react/24/outline';

import CommentModal from '../../components/CommentModal';
import EmptyShortsState from '../components/ErrorStates/EmptyShortsState';
import ShortsPageError from '../components/ErrorStates/ShortsPageError';
import ShortsPageSkeleton from '../components/LoadingStates/ShortsPageSkeleton';
import ShortDisplayCard from '../components/ShortDisplayCard';
import ShortsFilters from '../components/ShortsFilters';
import ShortsNavigation from '../components/ShortsNavigation';
import { useLocalStorage, useShortsVideos } from '../src/hooks';

import type { Short } from '../src/types/core';

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const ShortsPage: React.FC = () => {
  const { data: allShorts, loading, error } = useShortsVideos();
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Enhanced state management with proper Set handling and error recovery
  const [likedShortsArray, setLikedShortsArray] = useLocalStorage<string[]>('likedShorts', []);
  const [followedChannelsArray, setFollowedChannelsArray] = useLocalStorage<string[]>('followedChannels', []);

  // Convert arrays to Sets for easier manipulation with comprehensive type checking
  const likedShorts = useMemo(() => {
    try {
      // Ensure we have a valid array
      const validArray = Array.isArray(likedShortsArray) ? likedShortsArray : [];
      return new Set(validArray.filter((item) => typeof item === 'string'));
    } catch (error) {
      console.warn('Error creating likedShorts Set:', error);
      // Clear invalid data and return empty Set
      setLikedShortsArray([]);
      return new Set<string>();
    }
  }, [likedShortsArray, setLikedShortsArray]);

  const followedChannels = useMemo(() => {
    try {
      // Ensure we have a valid array
      const validArray = Array.isArray(followedChannelsArray) ? followedChannelsArray : [];
      return new Set(validArray.filter((item) => typeof item === 'string'));
    } catch (error) {
      console.warn('Error creating followedChannels Set:', error);
      // Clear invalid data and return empty Set
      setFollowedChannelsArray([]);
      return new Set<string>();
    }
  }, [followedChannelsArray, setFollowedChannelsArray]);

  const [commentModalOpen, setCommentModalOpen] = useState<boolean>(false);
  const [selectedShortForComment, setSelectedShortForComment] = useState<{ id: string; title: string } | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isAutoAdvanceEnabled] = useLocalStorage('autoAdvanceShorts', true);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Debounced search
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Get video: any ID from query parameter
  const searchParams = new URLSearchParams(location.search);
  const targetVideoId = searchParams.get('v');

  // Convert Videos to Shorts and filter
  const filteredShorts = useMemo((): Short[] => {
    if (!allShorts) {
      return [];
    }

    // Convert Video[] to Short[] with proper type conversion
    let converted: Short[] = allShorts
      .filter((video: any) => video.visibility !== 'scheduled') // Filter out scheduled videos
      .map((video: any) => {
        const shortVideo: Short = {
          ...video: any,
          duration: typeof video.duration === 'string' ? parseInt(video.duration, 10) || 60 : video.duration,
          isShort: true,
          isVertical: true,
          visibility: video.visibility || 'public',
          createdAt: video.createdAt || new Date().toISOString(),
          updatedAt: video.updatedAt || new Date().toISOString(),
          // Additional properties for Short type compatibility
          viewCount: typeof video.views === 'string' ? parseInt(video.views.replace(/[^0-9]/g, ''), 10) : video.views || 0,
          commentCount: 0,
          likeCount: video.likes || 0,
          definition: 'hd' as 'hd' | 'sd'
        };
        return shortVideo;
      });

    // Apply category filter
    if (selectedCategory !== 'all') {
      converted = converted.filter((short: any) =>
        short.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      converted = converted.filter((short: any) =>
        short.title.toLowerCase().includes(query) ||
        short.channelName.toLowerCase().includes(query) ||
        short.description.toLowerCase().includes(query));
    }

    return converted;
  }, [allShorts, selectedCategory, debouncedSearchQuery]);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    if (!allShorts) {
      return [];
    }
    const uniqueCategories = [...new Set(allShorts.map((short: any) => short.category))];
    return ['all', ...uniqueCategories];
  }, [allShorts]);

  // Enhanced event handlers with proper type checking
  const handleLike = useCallback((shortId: string) => {
    setLikedShortsArray((prev: any) => {
      const currentArray = Array.isArray(prev) ? prev: any : [];
      if (currentArray.includes(shortId)) {
        return currentArray.filter((id) => id !== shortId);
      }
      return [...currentArray, shortId];
    });
  }, [setLikedShortsArray]);

  const handleFollow = useCallback((channelName: string) => {
    setFollowedChannelsArray((prev: any) => {
      const currentArray = Array.isArray(prev) ? prev: any : [];
      if (currentArray.includes(channelName)) {
        return currentArray.filter((name) => name !== channelName);
      }
      return [...currentArray, channelName];
    });
  }, [setFollowedChannelsArray]);

  const handleComment = useCallback((shortId: string) => {
    const currentFilteredShorts = filteredShorts;
    const short = currentFilteredShorts.find(s => s.id === shortId);
    setSelectedShortForComment({
      id: shortId,
      title: short?.title || 'Short video'
    });
    setCommentModalOpen(true);
  }, [filteredShorts]);

  const handleCommentSubmit = useCallback(async (_commentText: string): Promise<void> => {
    if (!selectedShortForComment) {
      return;
    }

    try {
      // Close modal and reset state
      setCommentModalOpen(false);
      setSelectedShortForComment(null);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  }, [selectedShortForComment]);

  const handleVideoChange = useCallback((index: number) => {
    setCurrentVideoIndex(index);

    // Update URL with current video ID
    const currentFilteredShorts = filteredShorts;
    if (currentFilteredShorts[index]) {
      const newUrl = `/shorts?v=${currentFilteredShorts[index].id}`;
      window.history.replaceState(null, '', newUrl);
    }

    // Scroll to the video
    if (containerRef.current) {
      const targetElement = containerRef.current.children[index] as HTMLElement;
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }, [filteredShorts]);

  const handleNextVideo = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => {
      const currentFilteredShorts = filteredShorts;
      if (prevIndex < currentFilteredShorts.length - 1) {
        const nextIndex = prevIndex + 1;
        // Update URL with current video ID
        if (currentFilteredShorts[nextIndex]) {
          const newUrl = `/shorts?v=${currentFilteredShorts[nextIndex].id}`;
          window.history.replaceState(null, '', newUrl);
        }
        // Scroll to the video
        if (containerRef.current) {
          const targetElement = containerRef.current.children[nextIndex] as HTMLElement;
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }
        return nextIndex;
      }
      return prevIndex;
    });
  }, [filteredShorts]);

  const handlePreviousVideo = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => {
      if (prevIndex > 0) {
        const currentFilteredShorts = filteredShorts;
        const prevVideoIndex = prevIndex - 1;
        // Update URL with current video ID
        if (currentFilteredShorts[prevVideoIndex]) {
          const newUrl = `/shorts?v=${currentFilteredShorts[prevVideoIndex].id}`;
          window.history.replaceState(null, '', newUrl);
        }
        // Scroll to the video
        if (containerRef.current) {
          const targetElement = containerRef.current.children[prevVideoIndex] as HTMLElement;
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }
        return prevVideoIndex;
      }
      return prevIndex;
    });
  }, [filteredShorts]);

  const handleSearchToggle = useCallback(() => {
    setShowSearch(prev => !prev: any);
    if (showSearch) {
      setSearchQuery('');
    }
  }, [showSearch]);

  const handleFilterToggle = useCallback(() => {
    setShowFilters(prev => !prev: any);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentVideoIndex(0);
  }, []);

  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (commentModalOpen) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        handlePreviousVideo();
        break;
      case 'ArrowDown':
        event.preventDefault();
        handleNextVideo();
        break;
      case 'Escape':
        if (showSearch) {
          handleSearchToggle();
        } else if (showFilters) {
          handleFilterToggle();
        }
        break;
    }
  }, [commentModalOpen, handlePreviousVideo, handleNextVideo, showSearch, showFilters, handleSearchToggle, handleFilterToggle]);

  const handleShare = async (shortId: string): Promise<void> => {
    const shareUrl = `${window.location.origin}/shorts?v=${shortId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this Short!',
          url: shareUrl
        });
      } catch (error) {
        // Fallback to clipboard if share fails
        copyToClipboard(shareUrl);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // One-time cleanup effect to handle corrupted localStorage data
  useEffect(() => {
    try {
      // Check if localStorage contains invalid data and clean it up
      const likedShortsRaw = localStorage.getItem('likedShorts');
      const followedChannelsRaw = localStorage.getItem('followedChannels');

      if (likedShortsRaw && likedShortsRaw !== 'null') {
        const parsed = JSON.parse(likedShortsRaw);
        if (!Array.isArray(parsed)) {
          console.warn('Cleaning up invalid likedShorts data');
          localStorage.removeItem('likedShorts');
          setLikedShortsArray([]);
        }
      }
      if (followedChannelsRaw && followedChannelsRaw !== 'null') {
        const parsed = JSON.parse(followedChannelsRaw);
        if (!Array.isArray(parsed)) {
          console.warn('Cleaning up invalid followedChannels data');
          localStorage.removeItem('followedChannels');
          setFollowedChannelsArray([]);
        }
      }
    } catch (error) {
      console.warn('Error during localStorage cleanup:', error);
      // Clear all potentially corrupted data
      localStorage.removeItem('likedShorts');
      localStorage.removeItem('followedChannels');
      setLikedShortsArray([]);
      setFollowedChannelsArray([]);
    }
  }, []); // Run only once on mount

  // Touch handling for mobile scroll navigation
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  // Wheel event handler for scroll navigation
  const handleWheel = useCallback((event: WheelEvent) => {
    if (commentModalOpen || showSearch || showFilters || isScrolling) {
      return;
    }

    // Prevent default scroll behavior
    event.preventDefault();

    // Determine scroll direction
    const { deltaY } = event;

    // Add debouncing to prevent rapid scrolling
    if (Math.abs(deltaY) > 50) {
      setIsScrolling(true);
      if (deltaY > 0) {
        // Scrolling down - next video
        handleNextVideo();
      } else {
        // Scrolling up - previous video
        handlePreviousVideo();
      }

      // Reset scrolling flag after a delay
      setTimeout(() => setIsScrolling(false), 500);
    }
  }, [commentModalOpen, showSearch, showFilters, isScrolling, handleNextVideo, handlePreviousVideo]);

  // Touch event handlers for mobile navigation
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (commentModalOpen || showSearch || showFilters) {
      return;
    }
    if (event.touches?.[0]) {
      setTouchStartY(event.touches[0].clientY);
    }
  }, [commentModalOpen, showSearch, showFilters]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (commentModalOpen || showSearch || showFilters || touchStartY === null || isScrolling) {
      return;
    }

    if (event.changedTouches?.[0]) {
      const touchEndY = event.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaY) > minSwipeDistance) {
        setIsScrolling(true);
        if (deltaY > 0) {
          // Swiped up - next video
          handleNextVideo();
        } else {
          // Swiped down - previous video
          handlePreviousVideo();
        }

        // Reset scrolling flag after a delay
        setTimeout(() => setIsScrolling(false), 500);
      }
    }
    setTouchStartY(null);
  }, [commentModalOpen, showSearch, showFilters, touchStartY, isScrolling, handleNextVideo, handlePreviousVideo]);

  // Enhanced useEffect hooks
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => document.removeEventListener('keydown', handleKeyboardNavigation);
  }, [handleKeyboardNavigation]);

  // Add wheel event listener for scroll navigation
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
    return () => {}; // Return empty cleanup function if no container
  }, [handleWheel]);

  // Add touch event listeners for mobile navigation
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
    return () => {}; // Return empty cleanup function if no container
  }, [handleTouchStart, handleTouchEnd]);

  // Scroll to specific video: any when component mounts or when shorts data changes
  const initializedRef = useRef(false);
  useEffect(() => {
    if (targetVideoId && !initializedRef.current && containerRef.current) {
      const currentFilteredShorts = filteredShorts;
      if (currentFilteredShorts.length > 0) {
        const targetIndex = currentFilteredShorts.findIndex(short => short.id === targetVideoId);
        if (targetIndex !== -1) {
          setCurrentVideoIndex(targetIndex);
          const targetElement = containerRef.current.children[targetIndex] as HTMLElement;
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
        initializedRef.current = true;
      }
    }
  }, [targetVideoId, filteredShorts]);

  // Auto-advance to next video: any when current video ends
  useEffect(() => {
    const currentFilteredShorts = filteredShorts;
    if (isAutoAdvanceEnabled && currentVideoIndex < currentFilteredShorts.length - 1) {
      // This would be triggered by video end event in ShortDisplayCard
      // Implementation would be in the video player component
    }
  }, [isAutoAdvanceEnabled, currentVideoIndex, filteredShorts]);

  // Set up intersection observer to track which video is currently in view
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current || !filteredShorts.length) {
      return;
    }

    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const videoElement = entry.target as HTMLElement;
          const index = Array.from(containerRef.current?.children || []).indexOf(videoElement);
          if (index !== -1) {
            setCurrentVideoIndex((prevIndex) => {
              if (index !== prevIndex) {
                // Update URL without triggering scroll
                const currentFilteredShorts = filteredShorts;
                if (currentFilteredShorts[index]) {
                  const newUrl = `/shorts?v=${currentFilteredShorts[index].id}`;
                  window.history.replaceState(null, '', newUrl);
                }
                return index;
              }
              return prevIndex;
            });
          }
        }
      });
    }, {
      root: containerRef.current,
      threshold: 0.5,
      rootMargin: '0px'
    });

    // Observe all video elements
    Array.from(containerRef.current.children).forEach((child) => {
      observerRef.current?.observe(child);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredShorts.length]); // Only depend on length, not the entire array

  if (loading) {
    return <ShortsPageSkeleton />;
  }

  if (error) {
    return <ShortsPageError error={error} />;
  }

  if (filteredShorts.length === 0) {
    return (
      <div className="h-[calc(100vh-3.5rem)] bg-black flex flex-col">
        {/* Enhanced Header with Search and Filters */}
        <div className="relative z-10 bg-black/80 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-white text-lg font-semibold">Shorts</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSearchToggle}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Search shorts"
              >
                <className="w-5 h-5" />
              </button>
              <button
                onClick={handleFilterToggle}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Filter shorts"
              >
                <className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="px-4 pb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shorts..."
                  className="w-full bg-white/10 text-white placeholder-white/60 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-white/20"
                  autoFocus
                />
                <button
                  onClick={handleSearchToggle}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-white"
                >
                  <className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <ShortsFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onClose={() => setShowFilters(false)}
            />
          )}
        </div>

        <EmptyShortsState
          hasFilters={selectedCategory !== 'all' || debouncedSearchQuery !== ''}
          onClearFilters={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] bg-black relative">
      {/* Enhanced Header with Search and Filters */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-white text-lg font-semibold">Shorts</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSearchToggle}
              className={`p-2 rounded-full transition-colors ${
                showSearch ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Search shorts"
            >
              <className="w-5 h-5" />
            </button>
            <button
              onClick={handleFilterToggle}
              className={`p-2 rounded-full transition-colors ${
                showFilters ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Filter shorts"
            >
              <className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shorts..."
                className="w-full bg-white/10 text-white placeholder-white/60 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-white/20"
                autoFocus
              />
              <button
                onClick={handleSearchToggle}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-white"
              >
                <className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <ShortsFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onClose={() => setShowFilters(false)}
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 pointer-events-auto">
        <ShortsNavigation
          onPrevious={handlePreviousVideo}
          onNext={handleNextVideo}
          canGoPrevious={currentVideoIndex > 0}
          canGoNext={currentVideoIndex < filteredShorts.length - 1}
        />
      </div>

      {/* Shorts Feed */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        role="feed"
        aria-label="Shorts feed"
      >
        {filteredShorts.map((short: any, index) => (
          <div key={short.id || index} className="h-full w-full snap-start">
            <ShortDisplayCard
              short={short}
              isLiked={likedShorts.has(short.id)}
              isFollowed={followedChannels.has(short.channelName)}
              onLike={handleLike}
              onFollow={handleFollow}
              onComment={handleComment}
              onShare={handleShare}
              onVideoChange={() => handleVideoChange(index)}
              onVideoEnd={isAutoAdvanceEnabled ? handleNextVideo : () => {}}
              isActive={index === currentVideoIndex}
            />
          </div>
        ))}
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={commentModalOpen}
        onClose={() => {
          setCommentModalOpen(false);
          setSelectedShortForComment(null);
        }}
        shortId={selectedShortForComment?.id || ''}
        shortTitle={selectedShortForComment?.title || 'Short video'}
        onCommentSubmit={handleCommentSubmit}
      />
    </div>
  );
};

export default ShortsPage;