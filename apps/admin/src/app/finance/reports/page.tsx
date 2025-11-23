'use client';

import { FileText } from 'lucide-react';

export default function FinancialReports() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-red-600" />
          Financial Reports
        </h1>
        <p className="text-gray-600">Generate and view financial reports</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Financial reports will be displayed here</p>
      </div>
    </div>
  );
}
