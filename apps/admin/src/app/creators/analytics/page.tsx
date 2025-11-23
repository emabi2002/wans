'use client';

import { TrendingUp } from 'lucide-react';

export default function CreatorAnalytics() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-red-600" />
          Creator Analytics
        </h1>
        <p className="text-gray-600">View performance metrics for content creators</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Creator analytics will be displayed here</p>
      </div>
    </div>
  );
}
