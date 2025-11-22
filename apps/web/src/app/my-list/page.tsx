'use client';

import Link from 'next/link';
import { Play, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { SocialShare } from '@/components/SocialShare';
import { useUserStore } from '@/store/userStore';

export default function MyListPage() {
  const { myList, removeFromMyList } = useUserStore();

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
              <Link href="/my-list" className="text-red-600 font-semibold">My List</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/search" className="hover:text-gray-300 transition">Search</Link>
            <Link href="/profiles" className="hover:text-gray-300 transition">
              <div className="h-8 w-8 bg-red-600 rounded flex items-center justify-center font-bold">
                U
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-8 md:px-16 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My List</h1>
              <p className="text-gray-400">
                {myList.length} {myList.length === 1 ? 'film' : 'films'} saved
              </p>
            </div>
            {myList.length > 0 && (
              <SocialShare
                title="My Watchlist on THE WANS"
                description={`Check out my watchlist with ${myList.length} amazing PNG and Pacific Islander films!`}
              />
            )}
          </div>

          {myList.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-12 w-12 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your list is empty</h2>
                <p className="text-gray-400 mb-6">
                  Add films to your list to watch them later
                </p>
              </div>
              <Link href="/">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  Browse Films
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {myList.map((film) => (
                <div key={film.id} className="group relative">
                  <Link
                    href={`/film/${film.id}`}
                    className="block relative aspect-[2/3] rounded overflow-hidden transition-transform hover:scale-105"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${film.posterUrl})` }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2 p-4">
                        <Play className="h-12 w-12 fill-current" />
                        <p className="text-sm font-medium text-center">{film.title}</p>
                      </div>
                    </div>
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromMyList(film.id)}
                    className="absolute top-2 right-2 z-10 p-2 bg-black/80 hover:bg-red-600 rounded-full transition opacity-0 group-hover:opacity-100"
                    aria-label="Remove from list"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {myList.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-800">
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your entire list?')) {
                    myList.forEach((film) => removeFromMyList(film.id));
                  }
                }}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
