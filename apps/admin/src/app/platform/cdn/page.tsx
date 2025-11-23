'use client';

import { Database } from 'lucide-react';

export default function CDNSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Database className="h-6 w-6 mr-2 text-red-600" />
          CDN Settings
        </h1>
        <p className="text-gray-600">Manage content delivery network configuration</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">CDN settings will be displayed here</p>
      </div>
    </div>
  );
}
