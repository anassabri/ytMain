import React, { useState } from 'react';

interface AdminPageProps {
  className?: string;
}

interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalViews: number;
  activeUsers: number;
}

const AdminPage: React.FC<AdminPageProps> = ({ className }) => {
  const [stats] = useState<AdminStats>({
    totalUsers: 125000,
    totalVideos: 45000,
    totalViews: 2500000,
    activeUsers: 8500
  });

  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'reports'>('overview');

  return (
    <div className={`admin-page ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          {(['overview', 'users', 'content', 'reports'] as const).map((tab) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700">Total Videos</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalVideos.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700">Total Views</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">User Moderation</h3>
                  <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Manage
                </button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">Banned Users</h3>
                  <p className="text-gray-600">View and manage banned accounts</p>
                </div>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  View
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
                  <h3 className="font-medium">Video Moderation</h3>
                  <p className="text-gray-600">Review flagged videos and content</p>
                </div>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                  Review
                </button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">Copyright Claims</h3>
                  <p className="text-gray-600">Handle copyright and DMCA requests</p>
                </div>
                <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                  Handle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {selectedTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Reports & Analytics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">User Reports</h3>
                  <p className="text-gray-600">View user-submitted reports</p>
                </div>
                <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
                  View Reports
                </button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-medium">System Analytics</h3>
                  <p className="text-gray-600">Platform performance and usage analytics</p>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;