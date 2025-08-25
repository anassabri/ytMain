import React, { useState } from 'react';
import { FireIcon } from '@heroicons/react/24/solid';
import CategoryTabs from '../components/CategoryTabs';
import PageLayout from '../components/PageLayout';
import VideoGrid from '../components/VideoGrid';
import { useTrendingVideos } from '../hooks/index';

const TrendingPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'music' | 'gaming' | 'news' | 'movies'>('all');
  const { data: trendingVideos, loading, error } = useTrendingVideos(activeCategory);

  const categories = [
    { id: 'all' as const, label: 'All', icon: '🔥' },
    { id: 'music' as const, label: 'Music', icon: '🎵' },
    { id: 'gaming' as const, label: 'Gaming', icon: '🎮' },
    { id: 'news' as const, label: 'News', icon: '📰' },
    { id: 'movies' as const, label: 'Movies', icon: '🎬' }
  ];

  return (
    <PageLayout
      title="Trending"
      icon={<FireIcon className="w-8 h-8 text-red-500" />}
      data={trendingVideos}
      loading={loading}
      error={error}
      emptyState={{
        title: 'No trending videos found',
        message: 'Check back later for the latest trending content.'
      }}
      headerActions={<CategoryTabs categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />}
    >
      {(videos: any) => <VideoGrid videos={videos || []} />}
    </PageLayout>
  );
};

export default TrendingPage;