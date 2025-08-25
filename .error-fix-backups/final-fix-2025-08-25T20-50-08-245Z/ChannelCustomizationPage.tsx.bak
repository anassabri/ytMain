import React, { useState } from 'react';

const ChannelCustomizationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('branding');

  return (
    <div className="channel-customization-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Channel Customization</h1>
        
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-4 py-2 rounded ${activeTab === 'branding' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Branding
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`px-4 py-2 rounded ${activeTab === 'layout' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Layout
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded ${activeTab === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Basic Info
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'branding' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Channel Branding</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Icon
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">Icon</span>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Upload New Icon
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Banner
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-4">Upload your channel banner (2560 x 1440 recommended)</p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Upload Banner
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Watermark
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Logo</span>
                    </div>
                    <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                      Upload Watermark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'layout' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Channel Layout</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Trailer
                  </label>
                  <p className="text-gray-600 mb-4">Set a video to introduce new visitors to your channel</p>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Select Trailer Video
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Sections
                  </label>
                  <p className="text-gray-600 mb-4">Organize your content into sections on your channel page</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Popular Uploads</span>
                      <button className="text-blue-500 hover:text-blue-700">Edit</button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Recent Uploads</span>
                      <button className="text-blue-500 hover:text-blue-700">Edit</button>
                    </div>
                  </div>
                  <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Add Section
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'info' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your channel name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your channel and what viewers can expect"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Keywords
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter keywords separated by commas"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Links
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Website URL"
                    />
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Social media URL"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    Save Changes
                  </button>
                  <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                    Cancel
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

export default ChannelCustomizationPage;