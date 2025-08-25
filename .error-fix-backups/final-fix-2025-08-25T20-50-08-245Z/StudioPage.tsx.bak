import React, { useState } from 'react';

interface StudioPageProps {
  className?: string;
}

interface VideoStats {
  views: number;
  likes: number;
  comments: number;
  subscribers: number;
}

const StudioPage: React.FC<StudioPageProps> = ({ className }) => {
  const [stats] = useState<VideoStats>({
    views: 125000,
    likes: 8500,
    comments: 1200,
    subscribers: 45000
  });

  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'content' | 'analytics' | 'monetization'>('dashboard');

  return (
    <div className={`studio-page ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">YouTube Studio</h1>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          {(['dashboard', 'content', 'analytics', 'monetization'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedTab === tab
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {selectedTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700">Total Views</h3>
                <p className="text-3xl font-bold text-red-600">{stats.views.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700">Likes</h3>
                <p className="text-3xl font-bold text-green-600">{stats.likes.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700">Comments</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.comments.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700">Subscribers</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.subscribers.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 transition-colors">
                  <div className="text-lg font-semibold">Upload Video</div>
                  <div className="text-sm opacity-90">Share your content</div>
                </button>
                <button className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
                  <div className="text-lg font-semibold">Go Live</div>
                  <div className="text-sm opacity-90">Start streaming</div>
                </button>
                <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">
                  <div className="text-lg font-semibold">Create Short</div>
                  <div className="text-sm opacity-90">Make a short video</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {selectedTab === 'content' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Content Management</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">Videos</h3>
                  <p className="text-gray-600">Manage your uploaded videos</p>
                </div>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Manage
                </button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">Playlists</h3>
                  <p className="text-gray-600">Organize your content into playlists</p>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Manage
                </button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">Shorts</h3>
                  <p className="text-gray-600">Manage your short-form content</p>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Manage
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Channel Analytics</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded">
                  <h3 className="font-medium mb-2">Watch Time</h3>
                  <p className="text-2xl font-bold text-blue-600">2,450 hours</p>
                  <p className="text-sm text-gray-600">Last 28 days</p>
                </div>
                <div className="p-4 border rounded">
                  <h3 className="font-medium mb-2">Revenue</h3>
                  <p className="text-2xl font-bold text-green-600">$1,234</p>
                  <p className="text-sm text-gray-600">Last 28 days</p>
                </div>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-medium mb-2">Top Performing Videos</h3>
                <p className="text-gray-600">View detailed analytics for your best content</p>
              </div>
            </div>
          </div>
        )}

        {/* Monetization Tab */}
        {selectedTab === 'monetization' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Monetization</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">Ad Revenue</h3>
                  <p className="text-gray-600">Earnings from advertisements</p>
                </div>
                <span className="text-green-600 font-semibold">$1,234</span>
              </div>
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">Channel Memberships</h3>
                  <p className="text-gray-600">Revenue from channel memberships</p>
                </div>
                <span className="text-blue-600 font-semibold">$567</span>
              </div>
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">Super Chat & Super Thanks</h3>
                  <p className="text-gray-600">Fan funding features</p>
                </div>
                <span className="text-purple-600 font-semibold">$89</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioPage;