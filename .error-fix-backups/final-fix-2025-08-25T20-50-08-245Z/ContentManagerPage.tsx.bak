import React, { useState } from 'react';

const ContentManagerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <div className="content-manager-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Content Manager</h1>
        
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded ${activeTab === 'videos' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('playlists')}
              className={`px-4 py-2 rounded ${activeTab === 'playlists' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab('shorts')}
              className={`px-4 py-2 rounded ${activeTab === 'shorts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Shorts
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'videos' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Videos</h2>
              <p className="text-gray-600">Manage your uploaded videos, edit metadata, and view analytics.</p>
              <div className="mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
                  Upload Video
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Bulk Actions
                </button>
              </div>
            </div>
          )}
          {activeTab === 'playlists' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
              <p className="text-gray-600">Create and manage your video playlists.</p>
              <div className="mt-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Create Playlist
                </button>
              </div>
            </div>
          )}
          {activeTab === 'shorts' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Shorts</h2>
              <p className="text-gray-600">Manage your YouTube Shorts content.</p>
              <div className="mt-4">
                <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                  Create Short
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagerPage;