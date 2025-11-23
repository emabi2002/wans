'use client';

import { useState } from 'react';
import { Search, Filter, User, Mail, Calendar, Shield, Ban } from 'lucide-react';

const USERS = [
  { id: 1, name: 'John Kassman', email: 'john.k@email.com', plan: 'Premium', status: 'Active', joined: '2024-01-15', revenue: '$119.88' },
  { id: 2, name: 'Sarah Malana', email: 'sarah.m@email.com', plan: 'Basic', status: 'Active', joined: '2024-02-20', revenue: '$59.88' },
  { id: 3, name: 'Peter Kaupa', email: 'peter.k@email.com', plan: 'Premium', status: 'Active', joined: '2024-01-05', revenue: '$119.88' },
  { id: 4, name: 'Mary Toua', email: 'mary.t@email.com', plan: 'Free', status: 'Active', joined: '2024-03-10', revenue: '$0.00' },
  { id: 5, name: 'David Aisi', email: 'david.a@email.com', plan: 'Premium', status: 'Suspended', joined: '2023-12-01', revenue: '$359.64' },
  { id: 6, name: 'Grace Laki', email: 'grace.l@email.com', plan: 'Basic', status: 'Active', joined: '2024-02-28', revenue: '$59.88' },
  { id: 7, name: 'Michael Pari', email: 'michael.p@email.com', plan: 'Premium', status: 'Cancelled', joined: '2023-11-15', revenue: '$239.76' },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = USERS.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">45,892 total users</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
          <User className="h-4 w-4" />
          Add New User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">45,892</p>
          <p className="text-sm text-green-600 mt-1">+12% this month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Premium Users</p>
          <p className="text-2xl font-bold text-purple-600">12,458</p>
          <p className="text-sm text-green-600 mt-1">+5.2%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Basic Users</p>
          <p className="text-2xl font-bold text-blue-600">18,234</p>
          <p className="text-sm text-green-600 mt-1">+8.1%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Free Users</p>
          <p className="text-2xl font-bold text-gray-600">15,200</p>
          <p className="text-sm text-gray-600 mt-1">-2.3%</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                    user.plan === 'Basic' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' :
                    user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.revenue}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded" title="View Profile">
                      <User className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Send Email">
                      <Mail className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Suspend User">
                      <Ban className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
