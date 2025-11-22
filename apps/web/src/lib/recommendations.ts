import { Film, getAllFilms } from './films';

interface WatchProgress {
  filmId: string;
  progress: number;
  timestamp: number;
}

interface Review {
  filmId: string;
  rating: number;
}

export function getRecommendations(
  watchHistory: WatchProgress[],
  reviews: Review[],
  myList: { id: string }[],
  limit: number = 10
): Film[] {
  const allFilms = getAllFilms();
  const watchedFilmIds = new Set(watchHistory.map((w) => w.filmId));
  const myListIds = new Set(myList.map((item) => item.id));

  // Calculate scores for each unwatched film
  const filmScores = allFilms
    .filter((film) => !watchedFilmIds.has(film.id))
    .map((film) => {
      let score = 0;

      // 1. Genre matching (based on watched films)
      const watchedFilms = watchHistory
        .map((w) => allFilms.find((f) => f.id === w.filmId))
        .filter(Boolean) as Film[];

      const genreFrequency: Record<string, number> = {};
      watchedFilms.forEach((wf) => {
        wf.genres.forEach((genre) => {
          genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
        });
      });

      film.genres.forEach((genre) => {
        score += (genreFrequency[genre] || 0) * 10;
      });

      // 2. Rating-based recommendation (films from same director/cast as highly rated films)
      const highRatedReviews = reviews.filter((r) => r.rating >= 4);
      const highRatedFilms = highRatedReviews
        .map((r) => allFilms.find((f) => f.id === r.filmId))
        .filter(Boolean) as Film[];

      highRatedFilms.forEach((hrf) => {
        if (hrf.director === film.director) {
          score += 15;
        }
        const sharedCast = film.cast.filter((actor) => hrf.cast.includes(actor));
        score += sharedCast.length * 5;
      });

      // 3. Country/Production matching
      watchedFilms.forEach((wf) => {
        if (wf.country === film.country) {
          score += 8;
        }
        if (wf.production === film.production) {
          score += 6;
        }
      });

      // 4. Year proximity (prefer recent films)
      const currentYear = new Date().getFullYear();
      const yearDiff = Math.abs(currentYear - film.year);
      score += Math.max(0, 10 - yearDiff);

      // 5. Boost films in My List
      if (myListIds.has(film.id)) {
        score += 20;
      }

      // 6. Completion rate boost (if user finished similar films)
      const completedSimilarFilms = watchHistory.filter(
        (w) =>
          w.progress > 90 &&
          allFilms.find(
            (f) => f.id === w.filmId && f.genres.some((g) => film.genres.includes(g))
          )
      );
      score += completedSimilarFilms.length * 5;

      return { film, score };
    });

  // Sort by score and return top recommendations
  return filmScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((fs) => fs.film);
}

export function getTrendingFilms(limit: number = 10): Film[] {
  const allFilms = getAllFilms();

  // Simulate trending based on year and rating
  // In production, this would come from actual view counts
  return allFilms
    .sort((a, b) => {
      const scoreA = a.year * 0.1 + (a.rating === 'PG-13' ? 5 : 0);
      const scoreB = b.year * 0.1 + (b.rating === 'PG-13' ? 5 : 0);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export function getSimilarFilms(filmId: string, limit: number = 6): Film[] {
  const allFilms = getAllFilms();
  const targetFilm = allFilms.find((f) => f.id === filmId);

  if (!targetFilm) return [];

  return allFilms
    .filter((film) => film.id !== filmId)
    .map((film) => {
      let similarity = 0;

      // Genre matching
      const sharedGenres = film.genres.filter((g) => targetFilm.genres.includes(g));
      similarity += sharedGenres.length * 10;

      // Same director
      if (film.director === targetFilm.director) {
        similarity += 20;
      }

      // Shared cast
      const sharedCast = film.cast.filter((actor) => targetFilm.cast.includes(actor));
      similarity += sharedCast.length * 5;

      // Same country
      if (film.country === targetFilm.country) {
        similarity += 15;
      }

      // Similar year (within 3 years)
      const yearDiff = Math.abs(film.year - targetFilm.year);
      if (yearDiff <= 3) {
        similarity += 5;
      }

      return { film, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((s) => s.film);
}
