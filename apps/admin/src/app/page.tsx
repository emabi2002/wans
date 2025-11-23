'use client';

import Link from 'next/link';
import {
  Film, Users, DollarSign, TrendingUp,
  CheckCircle, AlertCircle, PlayCircle, Upload,
  UserPlus, Video, ChevronRight, UserCheck, Activity
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="p-6">
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
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% this month
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Films</p>
                  <p className="text-3xl font-bold text-gray-900">1,234</p>
                </div>
                <Film className="h-12 w-12 text-red-600 opacity-20" />
              </div>
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <Upload className="h-4 w-4 mr-1" />
                +24 new this week
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">$892K</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
              </div>
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +18% vs last month
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Creators</p>
                  <p className="text-3xl font-bold text-gray-900">342</p>
                </div>
                <UserCheck className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <UserPlus className="h-4 w-4 mr-1" />
                +8 new this month
              </p>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Content Uploads */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-red-600" />
                  Recent Content Uploads
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { title: 'Black Python', creator: 'Pacific Media Solutions', status: 'Published', time: '2 hours ago' },
                  { title: 'Lukim Yu', creator: 'PNG Studios', status: 'Processing', time: '5 hours ago' },
                  { title: 'Wara', creator: 'Island Films', status: 'Published', time: '1 day ago' },
                  { title: 'Plesman 2', creator: 'Jona Film', status: 'Review', time: '2 days ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center">
                      <Video className="h-10 w-10 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.creator}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        item.status === 'Published' ? 'bg-green-100 text-green-800' :
                        item.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Health */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-red-600" />
                  Platform Health
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'API Response Time', value: '124ms', status: 'good', icon: CheckCircle },
                  { label: 'Streaming Uptime', value: '99.98%', status: 'good', icon: CheckCircle },
                  { label: 'CDN Performance', value: 'Optimal', status: 'good', icon: CheckCircle },
                  { label: 'Storage Used', value: '2.4TB / 5TB', status: 'warning', icon: AlertCircle },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 mr-3 ${
                          item.status === 'good' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </div>
                      <span className={`font-semibold ${
                        item.status === 'good' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Today's Watch Time</h3>
              <p className="text-2xl font-bold text-gray-900">28,547 hours</p>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <PlayCircle className="h-4 w-4 mr-2" />
                12,483 active viewers
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Pending Reviews</h3>
              <p className="text-2xl font-bold text-gray-900">23 items</p>
              <div className="mt-4">
                <Link href="/content/review" className="text-sm text-red-600 hover:text-red-700 flex items-center">
                  Review now <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Creator Payouts Due</h3>
              <p className="text-2xl font-bold text-gray-900">$124,500</p>
              <div className="mt-4">
                <Link href="/finance/payouts" className="text-sm text-red-600 hover:text-red-700 flex items-center">
                  Process payouts <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
    </div>
  );
}
