import React, { useState } from 'react';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="community-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Community</h1>
        
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 rounded ${activeTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Community Posts
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded ${activeTab === 'comments' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Comments
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-4 py-2 rounded ${activeTab === 'moderation' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Moderation
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'posts' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Community Posts</h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Create Post
                </button>
              </div>
              <p className="text-gray-600 mb-4">Share updates, polls, and engage with your community.</p>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="text-gray-800">Sample community post content...</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Posted 2 hours ago • 45 likes • 12 comments
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'comments' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Comments</h2>
              <p className="text-gray-600 mb-4">Manage and respond to comments on your content.</p>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="text-gray-800">"Great video! Thanks for sharing."</p>
                  <div className="mt-2 text-sm text-gray-500">
                    From: User123 • On: Video Title • 1 hour ago
                  </div>
                  <div className="mt-2">
                    <button className="text-blue-500 hover:text-blue-700 mr-4">Reply</button>
                    <button className="text-red-500 hover:text-red-700">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'moderation' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Moderation Tools</h2>
              <p className="text-gray-600 mb-4">Configure moderation settings and manage blocked users.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Auto-moderation</h3>
                  <p className="text-sm text-gray-600 mb-2">Automatically filter inappropriate content</p>
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    Configure
                  </button>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Blocked Users</h3>
                  <p className="text-sm text-gray-600 mb-2">Manage your blocked users list</p>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    View List
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;