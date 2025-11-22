import Link from 'next/link';
import {
  Film, Users, DollarSign, TrendingUp, Settings, Clock,
  CheckCircle, AlertCircle, PlayCircle, BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold">THE WANS Admin</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/content" className="text-gray-700 hover:text-gray-900">Content</Link>
              <Link href="/users" className="text-gray-700 hover:text-gray-900">Users</Link>
              <Link href="/windows" className="text-gray-700 hover:text-gray-900">Windows</Link>
              <Link href="/revenue" className="text-gray-700 hover:text-gray-900">Revenue</Link>
              <Link href="/analytics" className="text-gray-700 hover:text-gray-900">Analytics</Link>
              <Link href="/settings" className="text-gray-700 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
          <p className="mt-2 text-gray-600">Manage content, users, and platform operations</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">45,892</p>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
            <p className="mt-2 text-sm text-green-600">+12% this month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Films</p>
                <p className="text-3xl font-bold text-gray-900">1,284</p>
              </div>
              <Film className="h-12 w-12 text-red-600 opacity-20" />
            </div>
            <p className="mt-2 text-sm text-green-600">+8 this week</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$234.5K</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
            </div>
            <p className="mt-2 text-sm text-green-600">+24% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Streams</p>
                <p className="text-3xl font-bold text-gray-900">2,847</p>
              </div>
              <PlayCircle className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
            <p className="mt-2 text-sm text-green-600">Live now</p>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pending Actions</h2>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              8 items
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/content/pending"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-red-600 transition"
            >
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="font-semibold">Pending Approval</p>
                  <p className="text-sm text-gray-600">5 films waiting</p>
                </div>
              </div>
              <span className="text-red-600">→</span>
            </Link>

            <Link
              href="/transcoding/failed"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-red-600 transition"
            >
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="font-semibold">Failed Jobs</p>
                  <p className="text-sm text-gray-600">2 transcoding errors</p>
                </div>
              </div>
              <span className="text-red-600">→</span>
            </Link>

            <Link
              href="/users/reports"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-red-600 transition"
            >
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="font-semibold">User Reports</p>
                  <p className="text-sm text-gray-600">1 new report</p>
                </div>
              </div>
              <span className="text-red-600">→</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Content */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Submissions</h2>
                <Link href="/content" className="text-red-600 hover:text-red-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { title: 'Mountain Tales', creator: 'John Kassman', status: 'Pending', time: '2h ago' },
                { title: 'River of Life', creator: 'Sarah Malana', status: 'Approved', time: '5h ago' },
                { title: 'City Lights', creator: 'Peter Kaupa', status: 'Processing', time: '1d ago' },
              ].map((item, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">by {item.creator}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">System Status</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { service: 'API Gateway', status: 'Operational', uptime: '99.9%' },
                { service: 'Streaming CDN', status: 'Operational', uptime: '99.8%' },
                { service: 'Transcoding Queue', status: 'Operational', uptime: '98.5%' },
                { service: 'Database', status: 'Operational', uptime: '99.9%' },
                { service: 'Payment Gateway', status: 'Operational', uptime: '100%' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-900">{item.service}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-green-600 font-medium">{item.status}</span>
                    <p className="text-xs text-gray-500">{item.uptime} uptime</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Analytics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">12,458</p>
              <p className="text-xs text-green-600 mt-1">+5.2% this week</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Watch Time</p>
              <p className="text-2xl font-bold text-gray-900">38m</p>
              <p className="text-xs text-green-600 mt-1">+2.1% this week</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Bandwidth</p>
              <p className="text-2xl font-bold text-gray-900">2.4 TB</p>
              <p className="text-xs text-gray-600 mt-1">Today</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">847 GB</p>
              <p className="text-xs text-gray-600 mt-1">of 5 TB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
