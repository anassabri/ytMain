import React, { useState } from 'react';

interface StudioDashboardPageProps {
  className?: string;
}

interface DashboardStats {
  totalViews: number;
  watchTime: number;
  subscribers: number;
  revenue: number;
}

const StudioDashboardPage: React.FC<StudioDashboardPageProps> = ({ className }) => {
  const [stats] = useState<DashboardStats>({
    totalViews: 1250000,
    watchTime: 45000,
    subscribers: 125000,
    revenue: 2500
  });

  const [timeRange, setTimeRange] = useState<'7d' | '28d' | '90d' | '365d'>('28d');

  return (
    <div className={`studio-dashboard-page ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Channel Dashboard</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="28d">Last 28 days</option>
            <option value="90d">Last 90 days</option>
            <option value="365d">Last year</option>
          </select>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Views</h3>
            <p className="text-3xl font-bold text-red-600">{stats.totalViews.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+12.5% from last period</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Watch Time (hours)</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.watchTime.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+8.3% from last period</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Subscribers</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.subscribers.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+5.2% from last period</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+15.7% from last period</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
            <div className="space-y-4">
              {[
                { title: 'My Latest Tutorial', views: '12.5K', status: 'Published' },
                { title: 'Behind the Scenes', views: '8.2K', status: 'Published' },
                { title: 'Q&A Session', views: '15.1K', status: 'Published' }
              ].map((video, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <h3 className="font-medium">{video.title}</h3>
                    <p className="text-sm text-gray-600">{video.views} views</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">{video.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Channel Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Average View Duration</span>
                <span className="font-semibold">4:32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Click-through Rate</span>
                <span className="font-semibold">5.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Engagement Rate</span>
                <span className="font-semibold">12.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Subscriber Growth</span>
                <span className="font-semibold text-green-600">+1,250</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioDashboardPage;