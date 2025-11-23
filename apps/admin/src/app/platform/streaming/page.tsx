'use client';

import { PlayCircle } from 'lucide-react';

export default function StreamingSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <PlayCircle className="h-6 w-6 mr-2 text-red-600" />
          Streaming Settings
        </h1>
        <p className="text-gray-600">Configure streaming infrastructure and settings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Streaming configuration will be displayed here</p>
      </div>
    </div>
  );
}
