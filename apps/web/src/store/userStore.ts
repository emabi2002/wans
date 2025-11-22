import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Film {
  id: string;
  title: string;
  posterUrl: string;
}

interface WatchProgress {
  filmId: string;
  progress: number; // 0-100
  timestamp: number;
}

interface UserStore {
  myList: Film[];
  continueWatching: WatchProgress[];
  addToMyList: (film: Film) => void;
  removeFromMyList: (filmId: string) => void;
  isInMyList: (filmId: string) => boolean;
  updateWatchProgress: (filmId: string, progress: number) => void;
  getWatchProgress: (filmId: string) => number;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      myList: [],
      continueWatching: [],

      addToMyList: (film) => {
        const { myList } = get();
        if (!myList.find((f) => f.id === film.id)) {
          set({ myList: [...myList, film] });
        }
      },

      removeFromMyList: (filmId) => {
        const { myList } = get();
        set({ myList: myList.filter((f) => f.id !== filmId) });
      },

      isInMyList: (filmId) => {
        const { myList } = get();
        return myList.some((f) => f.id === filmId);
      },

      updateWatchProgress: (filmId, progress) => {
        const { continueWatching } = get();
        const existing = continueWatching.find((w) => w.filmId === filmId);

        if (existing) {
          set({
            continueWatching: continueWatching.map((w) =>
              w.filmId === filmId
                ? { ...w, progress, timestamp: Date.now() }
                : w
            ),
          });
        } else {
          set({
            continueWatching: [
              ...continueWatching,
              { filmId, progress, timestamp: Date.now() },
            ],
          });
        }
      },

      getWatchProgress: (filmId) => {
        const { continueWatching } = get();
        const item = continueWatching.find((w) => w.filmId === filmId);
        return item ? item.progress : 0;
      },
    }),
    {
      name: 'the-wans-user-storage',
    }
  )
);
