'use client';

import { Video } from 'lucide-react';

export default function CreatorUploads() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Video className="h-6 w-6 mr-2 text-red-600" />
          Creator Uploads
        </h1>
        <p className="text-gray-600">Track and manage content uploaded by creators</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Creator upload tracking will be displayed here</p>
      </div>
    </div>
  );
}
