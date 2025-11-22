'use client';

import Link from 'next/link';
import { Play, Info, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { useUserStore } from '@/store/userStore';
import { useReviewStore } from '@/store/reviewStore';
import { getFilmById } from '@/lib/films';
import { getRecommendations, getTrendingFilms } from '@/lib/recommendations';

const FEATURED_FILM = {
  id: '1',
  title: 'Black Python',
  description: 'A Spencer Peter William Wangare Film. Starring Jamuga Stone, Joylene Tanpa, Jeremiah Hayka, Balem Asekim, and David Kaumara. A gripping Papua New Guinea story of courage, family, and redemption.',
  backdropUrl: '/black-python-poster.jpg',
  posterUrl: '/black-python-poster.jpg',
  genres: ['Drama', 'Action', 'Thriller'],
  rating: 'PG-13',
  year: 2024,
  director: 'Spencer Peter William Wangare',
  cast: ['Jamuga Stone', 'Joylene Tanpa', 'Jeremiah Hayka', 'Balem Asekim', 'David Kaumara'],
  production: 'Pacific Media Solutions Production & THE WANS',
};

const CATEGORIES = [
  {
    title: 'PNG Originals',
    films: [
      { id: '1', title: 'Black Python', posterUrl: '/black-python-poster.jpg' },
      { id: '27', title: 'Lukim Yu', posterUrl: '/lukim-yu.jpg' },
      { id: '28', title: 'WARA', posterUrl: '/wara.jpg' },
      { id: '29', title: 'Plesman 2: Rising from the Ashes', posterUrl: '/plesman2.jpg' },
      { id: '30', title: "I'm Moshanty. Do You Love Me?", posterUrl: '/moshanty.jpg' },
      { id: '31', title: 'Walk Among the Forgotten', posterUrl: '/walk-among-forgotten.jpg' },
      { id: '2', title: 'Warriors of the Highlands', posterUrl: 'https://images.squarespace-cdn.com/content/v1/68514c81437a5a3a6c11153b/1750158571960-6AMUGA4ZROG0JYQMKG9T/PNG_003.jpg?w=300&h=450&fit=crop' },
      { id: '6', title: 'Spirit Houses', posterUrl: 'https://c8.alamy.com/comp/EAK99C/hut-in-a-tribal-village-highlands-papua-new-guinea-EAK99C.jpg?w=300&h=450&fit=crop' },
    ],
  },
  {
    title: 'Pacific Islander Films',
    films: [
      { id: '32', title: 'Moana', posterUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=450&fit=crop' },
      { id: '33', title: 'The Orator', posterUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop' },
      { id: '34', title: 'Vai', posterUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=450&fit=crop' },
      { id: '35', title: 'One Thousand Ropes', posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop' },
      { id: '36', title: 'The Islands', posterUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=450&fit=crop' },
    ],
  },
  {
    title: 'Asian Cinema',
    films: [
      { id: '37', title: 'Parasite', posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop' },
      { id: '38', title: 'Crouching Tiger', posterUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=450&fit=crop' },
      { id: '39', title: 'Train to Busan', posterUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=450&fit=crop' },
      { id: '40', title: 'Your Name', posterUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=450&fit=crop' },
      { id: '41', title: 'Ong-Bak', posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop' },
    ],
  },
  {
    title: 'International Films',
    films: [
      { id: '42', title: 'The Godfather', posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop' },
      { id: '43', title: 'Inception', posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop' },
      { id: '44', title: 'The Shawshank Redemption', posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop' },
      { id: '45', title: 'Pulp Fiction', posterUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=450&fit=crop' },
      { id: '46', title: 'The Dark Knight', posterUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop' },
    ],
  },
];

export default function HomePage() {
  const { myList, addToMyList, removeFromMyList, isInMyList, continueWatching } = useUserStore();
  const { reviews } = useReviewStore();
  const isInList = isInMyList(FEATURED_FILM.id);

  // Get personalized recommendations
  const recommendations = getRecommendations(continueWatching, reviews, myList, 6);
  const trendingFilms = getTrendingFilms(6);

  const handleMyListToggle = () => {
    if (isInList) {
      removeFromMyList(FEATURED_FILM.id);
    } else {
      addToMyList({
        id: FEATURED_FILM.id,
        title: FEATURED_FILM.title,
        posterUrl: FEATURED_FILM.posterUrl,
      });
    }
  };

  // Get continue watching films with details
  const continueWatchingFilms = continueWatching
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6)
    .map((item) => {
      const film = getFilmById(item.filmId);
      return film ? { ...film, progress: item.progress } : null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-black to-transparent px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo width={150} height={60} />
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/" className="hover:text-gray-300 transition">Home</Link>
              <Link href="/browse" className="hover:text-gray-300 transition">Browse</Link>
              <Link href="/my-list" className="hover:text-gray-300 transition">My List</Link>
              <Link href="/pricing" className="hover:text-gray-300 transition">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/search" className="hover:text-gray-300 transition">Search</Link>
            <Link href="/login" className="hover:text-gray-300 transition">Sign In</Link>
            <Link href="/profile" className="hover:text-gray-300 transition">
              <div className="h-8 w-8 bg-red-600 rounded flex items-center justify-center font-bold">
                U
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Full Poster Background */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${FEATURED_FILM.backdropUrl})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
          }}
        />

        {/* Info Overlay - Left Side */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-32 pb-8 px-8 md:px-16">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-2xl">
              {FEATURED_FILM.title}
            </h1>
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2 py-1 border border-white/40 text-white/90">{FEATURED_FILM.rating}</span>
              <span className="text-white/90">{FEATURED_FILM.year}</span>
              <span className="text-white/90">{FEATURED_FILM.genres.join(' • ')}</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-gray-300">
                {FEATURED_FILM.production}
              </p>
              <p className="text-sm md:text-base text-gray-200 max-w-xl leading-relaxed">
                {FEATURED_FILM.description}
              </p>
              <p className="text-sm text-gray-300">
                Director: {FEATURED_FILM.director}
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Link href={`/watch/${FEATURED_FILM.id}`}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Play
                </Button>
              </Link>
              <Link href={`/film/${FEATURED_FILM.id}`}>
                <Button size="lg" variant="outline" className="bg-gray-500/30 border-white/30 hover:bg-gray-500/50">
                  <Info className="mr-2 h-5 w-5" />
                  More Info
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="bg-gray-500/30 border-white/30 hover:bg-gray-500/50"
                onClick={handleMyListToggle}
              >
                {isInList ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    In My List
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    My List
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="relative bg-black pb-20 px-8 md:px-16 space-y-16">
        {/* Recommended for You */}
        {recommendations.length > 0 && continueWatching.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recommendations.map((film) => (
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
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Trending Now */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingFilms.map((film) => (
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Continue Watching */}
        {continueWatchingFilms.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Continue Watching</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {continueWatchingFilms.map((film) => {
                if (!film) return null;
                return (
                  <Link
                    key={film.id}
                    href={`/watch/${film.id}`}
                    className="group relative aspect-[2/3] rounded overflow-hidden transition-transform hover:scale-105">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${film.posterUrl})` }}
                    />
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-red-600"
                        style={{ width: `${film.progress}%` }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
                        <Play className="h-12 w-12 fill-current" />
                        <p className="text-sm font-medium text-center px-2">{film.title}</p>
                        <p className="text-xs text-gray-300">{Math.round(film.progress)}% watched</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {CATEGORIES.map((category) => (
          <div key={category.title}>
            <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {category.films.map((film) => (
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
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
                      <Play className="h-12 w-12 fill-current" />
                      <p className="text-sm font-medium text-center px-2">{film.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
