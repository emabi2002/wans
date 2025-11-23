import Link from 'next/link';
import { Play } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';

const CATEGORIES = [
  {
    title: 'PNG Originals',
    films: [
      { id: '1', title: 'Black Python', posterUrl: '/black-python-poster.jpg' },
      { id: '27', title: 'Lukim Yu', posterUrl: '/lukim-yu.jpg' },
      { id: '28', title: 'WARA', posterUrl: '/wara.jpg' },
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

export default function BrowsePage() {
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
              <Link href="/browse" className="text-red-600 font-semibold">Browse</Link>
              <Link href="/my-list" className="hover:text-gray-300 transition">My List</Link>
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

      <div className="pt-24 px-8 md:px-16 pb-20">
        <h1 className="text-4xl font-bold mb-8">Browse</h1>

        <div className="space-y-12">
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
      </div>

      <Footer />
    </div>
  );
}
