'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Monitor,
  Shield,
  LogOut,
  Clock,
  Star,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { useUserStore } from '@/store/userStore';
import { useReviewStore } from '@/store/reviewStore';
import { getFilmById } from '@/lib/films';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'account' | 'history' | 'settings'>('account');
  const { continueWatching } = useUserStore();
  const { reviews } = useReviewStore();

  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : '';
  const userName = typeof window !== 'undefined' ? localStorage.getItem('user_name') : '';
  const userReviews = reviews.filter(r => r.userId === userEmail);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-black px-8 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo width={150} height={60} />
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/" className="hover:text-gray-300 transition">Home</Link>
              <Link href="/browse" className="hover:text-gray-300 transition">Browse</Link>
              <Link href="/my-list" className="hover:text-gray-300 transition">My List</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/search" className="hover:text-gray-300 transition">Search</Link>
            <Link href="/profile" className="text-red-600 font-semibold">Profile</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-8 md:px-16 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-red-600 rounded-full flex items-center justify-center text-4xl font-bold">
                {userName?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{userName || 'User'}</h1>
                <p className="text-gray-400">{userEmail}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full font-semibold">
                    Premium Member
                  </span>
                  <span className="text-gray-400">Joined Nov 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('account')}
              className={`pb-4 px-2 border-b-2 transition ${
                activeTab === 'account'
                  ? 'border-red-600 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-4 px-2 border-b-2 transition ${
                activeTab === 'history'
                  ? 'border-red-600 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-2 border-b-2 transition ${
                activeTab === 'settings'
                  ? 'border-red-600 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      defaultValue={userName || ''}
                      className="bg-black border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      defaultValue={userEmail || ''}
                      className="bg-black border-gray-700"
                      disabled
                    />
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Save Changes
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password & Security
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <Input type="password" className="bg-black border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <Input type="password" className="bg-black border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <Input type="password" className="bg-black border-gray-700" />
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Update Password
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black rounded border border-gray-700">
                    <div>
                      <p className="font-semibold">Premium Plan</p>
                      <p className="text-sm text-gray-400">PGK 19.99/month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Next billing date</p>
                      <p className="font-semibold">Dec 22, 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/pricing" className="flex-1">
                      <Button variant="outline" className="w-full border-gray-700">
                        Change Plan
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1 border-red-600 text-red-600 hover:bg-red-600/10">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'history' && (
            <div className="space-y-8">
              {/* Continue Watching */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  Continue Watching
                </h2>
                {continueWatching.length === 0 ? (
                  <p className="text-gray-400">No viewing history yet</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {continueWatching.map((item) => {
                      const film = getFilmById(item.filmId);
                      if (!film) return null;
                      return (
                        <Link
                          key={item.filmId}
                          href={`/watch/${item.filmId}`}
                          className="group"
                        >
                          <div className="relative aspect-[2/3] rounded overflow-hidden mb-2">
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${film.posterUrl})` }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                              <div
                                className="h-full bg-red-600"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                          <p className="font-medium line-clamp-1">{film.title}</p>
                          <p className="text-sm text-gray-400">{Math.round(item.progress)}% watched</p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Your Reviews */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  Your Reviews
                </h2>
                {userReviews.length === 0 ? (
                  <p className="text-gray-400">You haven't written any reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {userReviews.map((review) => {
                      const film = getFilmById(review.filmId);
                      if (!film) return null;
                      return (
                        <div
                          key={review.id}
                          className="bg-gray-900 rounded-lg p-4 border border-gray-800"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Link href={`/film/${review.filmId}`} className="font-semibold hover:text-red-500">
                              {film.title}
                            </Link>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'fill-gray-700 text-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Email notifications</span>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>New releases</span>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Special offers</span>
                    <input type="checkbox" className="w-4 h-4" />
                  </label>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Playback Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Quality</label>
                    <select className="w-full px-4 py-2 bg-black border border-gray-700 rounded">
                      <option>Auto</option>
                      <option>1080p</option>
                      <option>720p</option>
                      <option>480p</option>
                    </select>
                  </div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Autoplay next episode</span>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Skip intro</span>
                    <input type="checkbox" className="w-4 h-4" />
                  </label>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Parental Controls
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Content Rating Limit</label>
                    <select className="w-full px-4 py-2 bg-black border border-gray-700 rounded">
                      <option>All Ages (G)</option>
                      <option>Parental Guidance (PG)</option>
                      <option>PG-13</option>
                      <option>Restricted (R)</option>
                      <option>No Restrictions</option>
                    </select>
                  </div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Require PIN for mature content</span>
                    <input type="checkbox" className="w-4 h-4" />
                  </label>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Set Parental PIN
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6 text-red-500">Danger Zone</h2>
                <div className="space-y-4">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600/10"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
