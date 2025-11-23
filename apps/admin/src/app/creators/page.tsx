'use client';

import { UserCheck } from 'lucide-react';

export default function AllCreators() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <UserCheck className="h-6 w-6 mr-2 text-red-600" />
          All Creators
        </h1>
        <p className="text-gray-600">Manage content creators and their profiles</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Creator directory will be displayed here</p>
      </div>
    </div>
  );
}
