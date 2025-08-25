import React, { useState } from 'react';

interface AnalyticsPageProps {
  className?: string;
}

interface AnalyticsData {
  views: number;
  impressions: number;
  clickThroughRate: number;
  averageViewDuration: string;
  subscribersGained: number;
  revenue: number;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ className }) => {
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'watchTime' | 'subscribers' | 'revenue'>('views');
  const [timeRange, setTimeRange] = useState<'7d' | '28d' | '90d' | '365d'>('28d');
  
  const [analytics] = useState<AnalyticsData>({
    views: 1250000,
    impressions: 2500000,
    clickThroughRate: 5.8,
    averageViewDuration: '4:32',
    subscribersGained: 1250,
    revenue: 2500
  });

  const topVideos = [
    { title: 'How to Build a React App', views: 125000, duration: '12:34' },
    { title: 'JavaScript Tips and Tricks', views: 98000, duration: '8:45' },
    { title: 'CSS Grid Tutorial', views: 87000, duration: '15:22' },
    { title: 'Node.js Crash Course', views: 76000, duration: '18:10' },
    { title: 'Database Design Basics', views: 65000, duration: '22:15' }
  ];

  const audienceData = [
    { country: 'United States', percentage: 35 },
    { country: 'United Kingdom', percentage: 15 },
    { country: 'Canada', percentage: 12 },
    { country: 'Australia', percentage: 8 },
    { country: 'Germany', percentage: 7 }
  ];

  return (
    <div className={`analytics-page ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Channel Analytics</h1>
          <div className="flex space-x-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="views">Views</option>
              <option value="watchTime">Watch Time</option>
              <option value="subscribers">Subscribers</option>
              <option value="revenue">Revenue</option>
            </select>
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
        </div>
        
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Views</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.views.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+12.5% vs previous period</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Impressions</h3>
            <p className="text-3xl font-bold text-purple-600">{analytics.impressions.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+8.3% vs previous period</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Click-through Rate</h3>
            <p className="text-3xl font-bold text-orange-600">{analytics.clickThroughRate}%</p>
            <p className="text-sm text-red-600 mt-1">-0.2% vs previous period</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg. View Duration</h3>
            <p className="text-3xl font-bold text-green-600">{analytics.averageViewDuration}</p>
            <p className="text-sm text-green-600 mt-1">+5.2% vs previous period</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
            <div className="space-y-4">
              {[
                { source: 'YouTube Search', percentage: 45, color: 'bg-red-500' },
                { source: 'Suggested Videos', percentage: 25, color: 'bg-blue-500' },
                { source: 'External', percentage: 15, color: 'bg-green-500' },
                { source: 'Direct/Unknown', percentage: 10, color: 'bg-yellow-500' },
                { source: 'Playlists', percentage: 5, color: 'bg-purple-500' }
              ].map((source, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${source.color}`}></div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-sm">{source.source}</span>
                    <span className="text-sm font-semibold">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Top Videos</h2>
            <div className="space-y-4">
              {topVideos.map((video, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{video.title}</h3>
                    <p className="text-xs text-gray-600">{video.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{video.views.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Audience Geography</h2>
            <div className="space-y-4">
              {audienceData.map((country, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{country.country}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${country.percentage * 2}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-8">{country.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">${analytics.revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Last {timeRange}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">RPM</h3>
              <p className="text-2xl font-bold text-blue-600">$2.15</p>
              <p className="text-sm text-gray-600">Revenue per mille</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">CPM</h3>
              <p className="text-2xl font-bold text-purple-600">$3.45</p>
              <p className="text-sm text-gray-600">Cost per mille</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;