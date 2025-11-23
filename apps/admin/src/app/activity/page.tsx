'use client';

import { Activity, Filter } from 'lucide-react';

export default function ActivityLog() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Activity className="h-6 w-6 mr-2 text-red-600" />
          Activity Log
        </h1>
        <p className="text-gray-600">Track all platform activities and events</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
        <p className="text-gray-500">Activity log data will be displayed here</p>
      </div>
    </div>
  );
}
