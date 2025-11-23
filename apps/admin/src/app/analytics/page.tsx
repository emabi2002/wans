'use client';

import { BarChart3, TrendingUp, Users, Eye, Clock, Globe, DollarSign, Play } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Sample data for charts
const revenueData = [
  { month: 'Jan', revenue: 45000, users: 3200, subscriptions: 280 },
  { month: 'Feb', revenue: 52000, users: 3800, subscriptions: 320 },
  { month: 'Mar', revenue: 48000, users: 4200, subscriptions: 350 },
  { month: 'Apr', revenue: 61000, users: 4800, subscriptions: 410 },
  { month: 'May', revenue: 75000, users: 5500, subscriptions: 480 },
  { month: 'Jun', revenue: 89200, users: 6200, subscriptions: 560 },
];

const viewsData = [
  { day: 'Mon', views: 12400, watchTime: 8200 },
  { day: 'Tue', views: 15800, watchTime: 9500 },
  { day: 'Wed', views: 13200, watchTime: 8800 },
  { day: 'Thu', views: 18900, watchTime: 11200 },
  { day: 'Fri', views: 22300, watchTime: 13500 },
  { day: 'Sat', views: 28700, watchTime: 17200 },
  { day: 'Sun', views: 25400, watchTime: 15800 },
];

const contentPerformance = [
  { name: 'Black Python', views: 342000, revenue: 12450 },
  { name: 'Lukim Yu', views: 298000, revenue: 10230 },
  { name: 'Wara', views: 276000, revenue: 9870 },
  { name: 'Plesman 2', views: 245000, revenue: 8540 },
  { name: "I'm Moshanty", views: 198000, revenue: 7120 },
];

const userDistribution = [
  { name: 'Premium', value: 12458, color: '#8b5cf6' },
  { name: 'Basic', value: 18234, color: '#3b82f6' },
  { name: 'Free', value: 15200, color: '#6b7280' },
];

const geoData = [
  { country: 'Papua New Guinea', users: 12453, percentage: 42 },
  { country: 'Australia', users: 8234, percentage: 28 },
  { country: 'New Zealand', users: 4567, percentage: 15 },
  { country: 'Fiji', users: 2345, percentage: 8 },
  { country: 'Others', users: 1892, percentage: 7 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform performance and user insights</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <Eye className="h-8 w-8 text-blue-600" />
            <span className="text-sm text-green-600 font-semibold">+15.3%</span>
          </div>
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-2xl font-bold text-gray-900">2.4M</p>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-purple-600" />
            <span className="text-sm text-green-600 font-semibold">+8.2%</span>
          </div>
          <p className="text-sm text-gray-600">Avg. Watch Time</p>
          <p className="text-2xl font-bold text-gray-900">42m</p>
          <p className="text-xs text-gray-500 mt-1">Per session</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-green-600" />
            <span className="text-sm text-green-600 font-semibold">+22.1%</span>
          </div>
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-gray-900">18,432</p>
          <p className="text-xs text-gray-500 mt-1">Daily average</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="text-sm text-green-600 font-semibold">+18.4%</span>
          </div>
          <p className="text-sm text-gray-600">Monthly Revenue</p>
          <p className="text-2xl font-bold text-gray-900">$89.2K</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>
      </div>

      {/* Revenue & Growth Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="subscriptions" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Views & Watch Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Daily Views & Watch Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#3b82f6" />
              <Bar dataKey="watchTime" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Performance & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900">Top Performing Content</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="views" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900">Geographic Distribution</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {geoData.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.country}</span>
                    <span className="text-sm text-gray-600">{item.users.toLocaleString()} users</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Real-Time Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Play className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">1,247</p>
            <p className="text-sm text-gray-600">Active Streams</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">3,892</p>
            <p className="text-sm text-gray-600">Online Users</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">52m</p>
            <p className="text-sm text-gray-600">Avg. Session</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">+24%</p>
            <p className="text-sm text-gray-600">Growth Today</p>
          </div>
        </div>
      </div>
    </div>
  );
}
