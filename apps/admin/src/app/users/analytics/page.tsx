'use client';

import { Eye } from 'lucide-react';

export default function UserAnalytics() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Eye className="h-6 w-6 mr-2 text-red-600" />
          User Analytics
        </h1>
        <p className="text-gray-600">View detailed user behavior and engagement analytics</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">User analytics data will be displayed here</p>
      </div>
    </div>
  );
}
