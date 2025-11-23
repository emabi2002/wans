'use client';

import { Tv } from 'lucide-react';

export default function WindowsLicensing() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Tv className="h-6 w-6 mr-2 text-red-600" />
          Windows/Licensing
        </h1>
        <p className="text-gray-600">Manage licensing windows and content availability</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Licensing management will be displayed here</p>
      </div>
    </div>
  );
}
