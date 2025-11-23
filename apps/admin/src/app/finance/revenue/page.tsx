'use client';

import { DollarSign } from 'lucide-react';

export default function Revenue() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <DollarSign className="h-6 w-6 mr-2 text-red-600" />
          Revenue
        </h1>
        <p className="text-gray-600">Monitor platform revenue and earnings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Revenue tracking will be displayed here</p>
      </div>
    </div>
  );
}
