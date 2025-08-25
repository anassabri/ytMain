import React, { useState } from 'react';

const PlaylistManagerPage: React.FC = () => {
  const [playlists] = useState([
    { id: 1, name: 'My Favorites', videoCount: 25, visibility: 'Public' },
    { id: 2, name: 'Watch Later', videoCount: 12, visibility: 'Private' },
    { id: 3, name: 'Music Collection', videoCount: 45, visibility: 'Unlisted' },
  ]);

  return (
    <div className="playlist-manager-page">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Playlist Manager</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create New Playlist
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Your Playlists</h2>
            <p className="text-gray-600 mt-1">Manage your video playlists and their settings</p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Playlist Name</th>
                    <th className="text-left py-2">Videos</th>
                    <th className="text-left py-2">Visibility</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {playlists.map((playlist) => (
                    <tr key={playlist.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div className="font-medium">{playlist.name}</div>
                      </td>
                      <td className="py-3">
                        <span className="text-gray-600">{playlist.videoCount} videos</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          playlist.visibility === 'Public' ? 'bg-green-100 text-green-800' :
                          playlist.visibility === 'Private' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {playlist.visibility}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700 text-sm">
                            Edit
                          </button>
                          <button className="text-green-500 hover:text-green-700 text-sm">
                            View
                          </button>
                          <button className="text-red-500 hover:text-red-700 text-sm">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
                Import Playlist
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
                Export Playlists
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
                Bulk Edit
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Playlists:</span>
                <span className="font-medium">{playlists.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Videos:</span>
                <span className="font-medium">{playlists.reduce((sum, p) => sum + p.videoCount, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Public Playlists:</span>
                <span className="font-medium">{playlists.filter(p => p.visibility === 'Public').length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use descriptive playlist names</li>
              <li>• Organize videos by theme or topic</li>
              <li>• Set appropriate visibility settings</li>
              <li>• Add playlist descriptions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistManagerPage;