'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Play, Plus, Check, ArrowLeft, Clock, Calendar, Globe, Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { SocialShare } from '@/components/SocialShare';
import { useUserStore } from '@/store/userStore';
import { useReviewStore } from '@/store/reviewStore';
import { getFilmById, getAllFilms } from '@/lib/films';

export default function FilmDetailPage() {
  const params = useParams();
  const filmId = params.id as string;
  const film = getFilmById(filmId);
  const { addToMyList, removeFromMyList, isInMyList } = useUserStore();
  const { getFilmReviews, getAverageRating, addReview, markHelpful } = useReviewStore();

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const reviews = getFilmReviews(filmId);
  const averageRating = getAverageRating(filmId);

  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Film Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isInList = isInMyList(film.id);

  const handleMyListToggle = () => {
    if (isInList) {
      removeFromMyList(film.id);
    } else {
      addToMyList({
        id: film.id,
        title: film.title,
        posterUrl: film.posterUrl,
      });
    }
  };

  // Get related films (same genre)
  const relatedFilms = getAllFilms()
    .filter((f) => f.id !== film.id && f.genres.some((g) => film.genres.includes(g)))
    .slice(0, 6);

  const handleSubmitReview = () => {
    if (userRating === 0 || !reviewComment.trim()) {
      alert('Please provide a rating and comment');
      return;
    }

    // Get user info from localStorage (in production, use proper auth)
    const userName = localStorage.getItem('user_name') || 'Anonymous User';
    const userId = localStorage.getItem('user_email') || 'anonymous';

    addReview({
      filmId: film.id,
      userId,
      userName,
      rating: userRating,
      comment: reviewComment,
    });

    setUserRating(0);
    setReviewComment('');
    setShowReviewForm(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

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

      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${film.backdropUrl})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-4 hover:text-gray-300 transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{film.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
            <span className="px-3 py-1 border border-white/40 text-white/90">{film.rating}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {film.year}
            </span>
            {film.runtime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {film.runtime} min
              </span>
            )}
            {film.language && (
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {film.language}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/watch/${film.id}`}>
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Play
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
                  Add to My List
                </>
              )}
            </Button>
            <SocialShare
              title={film.title}
              description={`Watch ${film.title} on THE WANS - ${film.description}`}
            />
          </div>
        </div>
      </div>

      {/* Film Details */}
      <div className="px-8 md:px-16 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {film.synopsis || film.description}
              </p>
            </div>

            {/* Trailer */}
            {film.trailerUrl && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={film.trailerUrl.replace('watch?v=', 'embed/')}
                    title={`${film.title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Cast */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {film.cast.map((actor, index) => (
                  <div key={index} className="text-gray-300">
                    <div className="aspect-square bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-600">
                        {actor.charAt(0)}
                      </span>
                    </div>
                    <p className="font-medium">{actor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {film.genres.map((genre) => (
                  <span key={genre} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Director</h3>
              <p className="text-white">{film.director}</p>
            </div>

            {film.production && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Production</h3>
                <p className="text-white">{film.production}</p>
              </div>
            )}

            {film.country && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Country</h3>
                <p className="text-white">{film.country}</p>
              </div>
            )}

            {/* Rating Summary */}
            <div className="pt-6 border-t border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Viewer Rating</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                  <span className="text-2xl font-bold">
                    {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'fill-gray-700 text-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-800 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Reviews & Ratings</h2>
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-red-600 hover:bg-red-700"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Share Your Thoughts</h3>

              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoverRating || userRating)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'fill-gray-700 text-gray-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What did you think about this film?"
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-white focus:outline-none resize-none"
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                className="bg-red-600 hover:bg-red-700"
              >
                Submit Review
              </Button>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No reviews yet. Be the first to review this film!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 bg-gray-900 rounded-lg border border-gray-800"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center font-bold">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <p className="text-sm text-gray-400">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                    </div>
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

                  <p className="text-gray-300 leading-relaxed mb-4">{review.comment}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => markHelpful(review.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                    <SocialShare
                      title={`${review.userName}'s review of ${film.title}`}
                      description={review.comment}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Films */}
        {relatedFilms.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">More Like This</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedFilms.map((relatedFilm) => (
                <Link
                  key={relatedFilm.id}
                  href={`/film/${relatedFilm.id}`}
                  className="group relative aspect-[2/3] rounded overflow-hidden transition-transform hover:scale-105"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${relatedFilm.posterUrl})` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
                      <Play className="h-12 w-12 fill-current" />
                      <p className="text-sm font-medium text-center px-2">{relatedFilm.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
