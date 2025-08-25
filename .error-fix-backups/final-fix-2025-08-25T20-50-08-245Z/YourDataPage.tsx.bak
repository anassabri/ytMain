import React, { useState } from 'react';

interface YourDataPageProps {
  className?: string;
}

interface DataCategory {
  name: string;
  description: string;
  size: string;
  lastUpdated: string;
  downloadable: boolean;
}

const YourDataPage: React.FC<YourDataPageProps> = ({ className }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'download' | 'delete' | 'privacy'>('overview');
  
  const dataCategories: DataCategory[] = [
    {
      name: 'Watch History',
      description: 'Videos you\'ve watched on YouTube',
      size: '2.3 MB',
      lastUpdated: '2 hours ago',
      downloadable: true
    },
    {
      name: 'Search History',
      description: 'Your YouTube search queries',
      size: '1.1 MB',
      lastUpdated: '1 day ago',
      downloadable: true
    },
    {
      name: 'Comments',
      description: 'Comments you\'ve posted on videos',
      size: '0.8 MB',
      lastUpdated: '3 days ago',
      downloadable: true
    },
    {
      name: 'Liked Videos',
      description: 'Videos you\'ve liked or disliked',
      size: '0.5 MB',
      lastUpdated: '1 week ago',
      downloadable: true
    },
    {
      name: 'Subscriptions',
      description: 'Channels you\'ve subscribed to',
      size: '0.2 MB',
      lastUpdated: '2 weeks ago',
      downloadable: true
    },
    {
      name: 'Playlists',
      description: 'Playlists you\'ve created or saved',
      size: '0.3 MB',
      lastUpdated: '1 month ago',
      downloadable: true
    }
  ];

  return (
    <div className={`your-data-page ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Data in YouTube</h1>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          {(['overview', 'download', 'delete', 'privacy'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Data Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700">Total Data Size</h3>
                  <p className="text-3xl font-bold text-blue-600">5.2 MB</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700">Data Categories</h3>
                  <p className="text-3xl font-bold text-green-600">{dataCategories.length}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700">Last Export</h3>
                  <p className="text-3xl font-bold text-purple-600">Never</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Your Data Categories</h2>
              <div className="space-y-4">
                {dataCategories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded">
                    <div className="flex-1">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                      <p className="text-gray-500 text-xs mt-1">Last updated: {category.lastUpdated}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{category.size}</p>
                      {category.downloadable && (
                        <span className="text-green-600 text-xs">✓ Downloadable</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Download Tab */}
        {selectedTab === 'download' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Download Your Data</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Export Your YouTube Data</h3>
                <p className="text-blue-700 text-sm mb-4">
                  You can download a copy of your YouTube data to keep for your records or use with another service.
                </p>
                <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                  Create Export
                </button>
              </div>

              <div>
                <h3 className="font-medium mb-3">Select Data to Include</h3>
                <div className="space-y-2">
                  {dataCategories.map((category, index) => (
                    <label key={index} className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <div className="flex-1">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-gray-600 text-sm ml-2">({category.size})</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Export Format</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="format" className="mr-3" defaultChecked />
                    <span>JSON (Machine readable)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" className="mr-3" />
                    <span>HTML (Human readable)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Tab */}
        {selectedTab === 'delete' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Delete Your Data</h2>
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-800 mb-2">⚠️ Permanent Data Deletion</h3>
                <p className="text-red-700 text-sm mb-4">
                  Deleting your data is permanent and cannot be undone. Please consider downloading your data first.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Delete Watch History</h3>
                  <p className="text-gray-600 text-sm mb-3">Remove all videos from your watch history</p>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Delete Watch History
                  </button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Delete Search History</h3>
                  <p className="text-gray-600 text-sm mb-3">Remove all your search queries</p>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Delete Search History
                  </button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Delete All Activity</h3>
                  <p className="text-gray-600 text-sm mb-3">Remove all your YouTube activity data</p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Delete All Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {selectedTab === 'privacy' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Privacy Controls</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Activity Controls</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <h4 className="font-medium">YouTube Watch History</h4>
                      <p className="text-gray-600 text-sm">Save videos you watch to improve recommendations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <h4 className="font-medium">YouTube Search History</h4>
                      <p className="text-gray-600 text-sm">Save searches to improve recommendations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Data Retention</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="retention" className="mr-3" defaultChecked />
                    <span>Keep until I delete manually</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="retention" className="mr-3" />
                    <span>Auto-delete after 18 months</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="retention" className="mr-3" />
                    <span>Auto-delete after 36 months</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourDataPage;