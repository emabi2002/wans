import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  filmId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
  helpful: number;
}

interface ReviewStore {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => void;
  getFilmReviews: (filmId: string) => Review[];
  getAverageRating: (filmId: string) => number;
  markHelpful: (reviewId: string) => void;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [
        // Sample reviews
        {
          id: '1',
          filmId: '1',
          userId: 'user1',
          userName: 'John Kapi',
          rating: 5,
          comment: 'An incredible story that truly captures the spirit of Papua New Guinea. The performances are outstanding and the cinematography is breathtaking. A must-watch!',
          createdAt: Date.now() - 86400000 * 5,
          helpful: 12,
        },
        {
          id: '2',
          filmId: '1',
          userId: 'user2',
          userName: 'Maria Tanaka',
          rating: 4,
          comment: 'Powerful and emotional. Black Python showcases the talent of PNG filmmakers and tells an authentic local story.',
          createdAt: Date.now() - 86400000 * 3,
          helpful: 8,
        },
        {
          id: '3',
          filmId: '1',
          userId: 'user3',
          userName: 'Peter Kaupa',
          rating: 5,
          comment: 'Finally, a film that represents our culture authentically! The cast and crew did an amazing job. Proud to be Papua New Guinean!',
          createdAt: Date.now() - 86400000,
          helpful: 15,
        },
      ],

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now(),
          helpful: 0,
        };
        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }));
      },

      getFilmReviews: (filmId) => {
        const { reviews } = get();
        return reviews
          .filter((r) => r.filmId === filmId)
          .sort((a, b) => b.createdAt - a.createdAt);
      },

      getAverageRating: (filmId) => {
        const filmReviews = get().getFilmReviews(filmId);
        if (filmReviews.length === 0) return 0;
        const sum = filmReviews.reduce((acc, r) => acc + r.rating, 0);
        return sum / filmReviews.length;
      },

      markHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
          ),
        }));
      },
    }),
    {
      name: 'the-wans-reviews-storage',
    }
  )
);
