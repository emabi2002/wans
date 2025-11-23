'use client';

import { useState } from 'react';
import { Search, Filter, Edit, Trash2, Eye, MoreVertical, Upload } from 'lucide-react';

const FILMS = [
  { id: 1, title: 'Black Python', creator: 'Pacific Media Solutions', status: 'Published', views: '342K', revenue: '$12,450', date: '2024-11-20' },
  { id: 2, title: 'Lukim Yu', creator: 'PNG Studios', status: 'Published', views: '298K', revenue: '$10,230', date: '2024-11-18' },
  { id: 3, title: 'Wara', creator: 'Island Films', status: 'Published', views: '276K', revenue: '$9,870', date: '2024-11-15' },
  { id: 4, title: 'Plesman 2', creator: 'Jona Film', status: 'Published', views: '245K', revenue: '$8,540', date: '2024-11-12' },
  { id: 5, title: "I'm Moshanty", creator: 'Tim Wolfe Productions', status: 'Published', views: '198K', revenue: '$7,120', date: '2024-11-10' },
  { id: 6, title: 'Walk Among the Forgotten', creator: 'William Wangare', status: 'Processing', views: '0', revenue: '$0', date: '2024-11-22' },
  { id: 7, title: 'Village Stories', creator: 'PNG Studios', status: 'Draft', views: '0', revenue: '$0', date: '2024-11-21' },
];

export default function FilmsLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFilms = FILMS.filter(film =>
    film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    film.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Films Library</h1>
          <p className="text-gray-600 mt-2">Manage all content on the platform</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload New Film
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search films..."
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

      {/* Films Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Film</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFilms.map((film) => (
              <tr key={film.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{film.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{film.creator}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    film.status === 'Published' ? 'bg-green-100 text-green-800' :
                    film.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {film.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{film.views}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{film.revenue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{film.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="h-4 w-4 text-red-600" />
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
