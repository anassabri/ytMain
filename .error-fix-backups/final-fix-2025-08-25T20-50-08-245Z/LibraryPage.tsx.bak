import React from 'react';

interface LibraryPageProps {
  className?: string;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ className }) => {
  return (
    <div className={`library-page ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Watch Later</h2>
            <p className="text-gray-600">Videos you've saved to watch later</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Liked Videos</h2>
            <p className="text-gray-600">Videos you've liked</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">History</h2>
            <p className="text-gray-600">Videos you've watched</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Playlists</h2>
            <p className="text-gray-600">Your created playlists</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Subscriptions</h2>
            <p className="text-gray-600">Channels you've subscribed to</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;