import Link from 'next/link';
import { Film, DollarSign, TrendingUp, Upload, BarChart3, Settings } from 'lucide-react';

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold">THE WANS Creator</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/upload" className="text-gray-700 hover:text-gray-900">Upload</Link>
              <Link href="/films" className="text-gray-700 hover:text-gray-900">My Films</Link>
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Creator</h1>
          <p className="mt-2 text-gray-600">Manage your films, track revenue, and grow your audience</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Films</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <Film className="h-12 w-12 text-red-600 opacity-20" />
            </div>
            <p className="mt-2 text-sm text-green-600">+2 this month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$24,560</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
            </div>
            <p className="mt-2 text-sm text-green-600">+18% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">156.2K</p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
            <p className="mt-2 text-sm text-green-600">+24% this week</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Watch Time</p>
                <p className="text-3xl font-bold text-gray-900">42m</p>
              </div>
              <BarChart3 className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
            <p className="mt-2 text-sm text-green-600">+5% this week</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/upload"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-600 transition"
            >
              <Upload className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="font-semibold">Upload New Film</p>
                <p className="text-sm text-gray-600">Start uploading your content</p>
              </div>
            </Link>

            <Link
              href="/revenue"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 transition"
            >
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="font-semibold">View Revenue</p>
                <p className="text-sm text-gray-600">Check your earnings</p>
              </div>
            </Link>

            <Link
              href="/analytics"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 transition"
            >
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold">Analytics</p>
                <p className="text-sm text-gray-600">Track performance</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Films */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Films</h2>
              <Link href="/films" className="text-red-600 hover:text-red-700 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { title: 'Warriors of the Highlands', status: 'Published', views: '45.2K', revenue: '$3,240' },
              { title: 'Ocean Guardians', status: 'Published', views: '32.8K', revenue: '$2,890' },
              { title: 'The Forest Spirits', status: 'Processing', views: '-', revenue: '-' },
              { title: 'Island Chronicles', status: 'Draft', views: '-', revenue: '-' },
            ].map((film, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{film.title}</h3>
                    <div className="flex items-center mt-1 space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        film.status === 'Published' ? 'bg-green-100 text-green-800' :
                        film.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {film.status}
                      </span>
                      {film.views !== '-' && (
                        <>
                          <span className="text-sm text-gray-600">{film.views} views</span>
                          <span className="text-sm font-medium text-green-600">{film.revenue}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/films/${index + 1}`}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
