'use client';

import { Settings } from 'lucide-react';

export default function PlatformSettings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-red-600" />
          Platform Settings
        </h1>
        <p className="text-gray-600">Configure global platform settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Platform settings will be displayed here</p>
      </div>
    </div>
  );
}
