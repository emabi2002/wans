'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Play, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { searchFilms, getAllFilms } from '@/lib/films';

const GENRES = ['Action', 'Drama', 'Thriller', 'Romance', 'Documentary', 'Comedy', 'History', 'Mystery', 'Environmental'];
const YEARS = [2024, 2023, 2022, 2021, 2020];
const RATINGS = ['G', 'PG', 'PG-13', 'R'];
const LANGUAGES = ['English', 'Tok Pisin', 'Hiri Motu'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    genre?: string;
    year?: number;
    rating?: string;
    language?: string;
  }>({});

  const results = query || Object.keys(filters).length > 0
    ? searchFilms(query, filters)
    : getAllFilms();

  const clearFilters = () => {
    setFilters({});
    setQuery('');
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || query;

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
            <Link href="/search" className="text-red-600 font-semibold">Search</Link>
            <Link href="/profiles" className="hover:text-gray-300 transition">
              <div className="h-8 w-8 bg-red-600 rounded flex items-center justify-center font-bold">
                U
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-8 md:px-16 pb-20">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-6">Search</h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for films, actors, directors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg bg-gray-900 border-gray-700 focus:border-white"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {Object.keys(filters).length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-600 rounded-full text-xs">
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-900 rounded-lg space-y-6">
              {/* Genre Filter */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          genre: prev.genre === genre ? undefined : genre,
                        }))
                      }
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        filters.genre === genre
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Year</h3>
                <div className="flex flex-wrap gap-2">
                  {YEARS.map((year) => (
                    <button
                      key={year}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          year: prev.year === year ? undefined : year,
                        }))
                      }
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        filters.year === year
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Rating</h3>
                <div className="flex flex-wrap gap-2">
                  {RATINGS.map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          rating: prev.rating === rating ? undefined : rating,
                        }))
                      }
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        filters.rating === rating
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Filter */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          language: prev.language === language ? undefined : language,
                        }))
                      }
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        filters.language === language
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div className="mb-6">
            <p className="text-gray-400">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No results found</h2>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {results.map((film) => (
                <Link
                  key={film.id}
                  href={`/film/${film.id}`}
                  className="group relative aspect-[2/3] rounded overflow-hidden transition-transform hover:scale-105"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${film.posterUrl})` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2 p-4">
                      <Play className="h-12 w-12 fill-current" />
                      <p className="text-sm font-medium text-center">{film.title}</p>
                      <p className="text-xs text-gray-300">{film.year}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
