'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Film, Users, DollarSign, Settings,
  Upload, UserPlus, Video, Eye, Award, Globe,
  Menu, X, ChevronRight, Home, FileText, Package, CreditCard,
  UserCheck, Tv, Database, Activity, BarChart3, Shield,
  PlayCircle, TrendingUp
} from 'lucide-react';

// Sidebar menu items
const menuSections = [
  {
    title: 'Overview',
    items: [
      { icon: Home, label: 'Dashboard', href: '/' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics' },
      { icon: Activity, label: 'Activity Log', href: '/activity' },
    ]
  },
  {
    title: 'Content',
    items: [
      { icon: Film, label: 'Films Library', href: '/content/films' },
      { icon: Upload, label: 'Upload Content', href: '/content/upload' },
      { icon: Package, label: 'Categories', href: '/content/categories' },
      { icon: Award, label: 'Featured', href: '/content/featured' },
    ]
  },
  {
    title: 'Users',
    items: [
      { icon: Users, label: 'All Users', href: '/users' },
      { icon: UserPlus, label: 'Subscriptions', href: '/users/subscriptions' },
      { icon: Shield, label: 'Access Control', href: '/users/access' },
      { icon: Eye, label: 'User Analytics', href: '/users/analytics' },
    ]
  },
  {
    title: 'Creators',
    items: [
      { icon: UserCheck, label: 'All Creators', href: '/creators' },
      { icon: Video, label: 'Creator Uploads', href: '/creators/uploads' },
      { icon: DollarSign, label: 'Revenue Share', href: '/creators/revenue' },
      { icon: TrendingUp, label: 'Creator Analytics', href: '/creators/analytics' },
    ]
  },
  {
    title: 'Finance',
    items: [
      { icon: DollarSign, label: 'Revenue', href: '/finance/revenue' },
      { icon: CreditCard, label: 'Payments', href: '/finance/payments' },
      { icon: FileText, label: 'Reports', href: '/finance/reports' },
    ]
  },
  {
    title: 'Platform',
    items: [
      { icon: Tv, label: 'Windows/Licensing', href: '/platform/windows' },
      { icon: PlayCircle, label: 'Streaming', href: '/platform/streaming' },
      { icon: Database, label: 'CDN Settings', href: '/platform/cdn' },
      { icon: Settings, label: 'Platform Settings', href: '/settings' },
    ]
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-screen z-50`}>
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen && (
            <div className="flex items-center">
              <Film className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-lg font-bold">THE WANS</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              {sidebarOpen && (
                <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-2.5 ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    } transition-colors`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                    {isActive && sidebarOpen && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold">
                EM
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Emmanuel</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold mx-auto">
              EM
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex flex-col min-h-screen ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
            <p className="text-sm text-gray-600">Welcome back, Emmanuel</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Globe className="h-5 w-5 text-gray-600" />
            </button>
            <Link
              href="https://wanltd.netlify.app"
              target="_blank"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Site
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
