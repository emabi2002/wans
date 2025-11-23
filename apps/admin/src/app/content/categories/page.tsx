'use client';

import { Package } from 'lucide-react';

export default function Categories() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="h-6 w-6 mr-2 text-red-600" />
          Categories
        </h1>
        <p className="text-gray-600">Manage content categories and genres</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Categories management will be displayed here</p>
      </div>
    </div>
  );
}
