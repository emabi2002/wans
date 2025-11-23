'use client';

import { Shield } from 'lucide-react';

export default function AccessControl() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-red-600" />
          Access Control
        </h1>
        <p className="text-gray-600">Manage user permissions and access levels</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Access control settings will be displayed here</p>
      </div>
    </div>
  );
}
