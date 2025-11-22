export interface Film {
  id: string;
  title: string;
  description: string;
  synopsis?: string;
  backdropUrl: string;
  posterUrl: string;
  trailerUrl?: string;
  genres: string[];
  rating: string;
  year: number;
  runtime?: number;
  director: string;
  cast: string[];
  production?: string;
  language?: string;
  country?: string;
}

export const FILMS_DATABASE: Record<string, Film> = {
  '1': {
    id: '1',
    title: 'Black Python',
    description: 'A Spencer Peter William Wangare Film. Starring Jamuga Stone, Joylene Tanpa, Jeremiah Hayka, Balem Asekim, and David Kaumara.',
    synopsis: 'A gripping Papua New Guinea story of courage, family, and redemption. In the heart of the PNG highlands, a young man must confront his past and fight for his family\'s honor against ancient traditions and modern challenges. This powerful drama explores themes of cultural identity, sacrifice, and the unbreakable bonds of family.',
    backdropUrl: '/black-python-poster.jpg',
    posterUrl: '/black-python-poster.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    genres: ['Drama', 'Action', 'Thriller'],
    rating: 'PG-13',
    year: 2024,
    runtime: 128,
    director: 'Spencer Peter William Wangare',
    cast: ['Jamuga Stone', 'Joylene Tanpa', 'Jeremiah Hayka', 'Balem Asekim', 'David Kaumara'],
    production: 'Pacific Media Solutions Production & THE WANS',
    language: 'English, Tok Pisin',
    country: 'Papua New Guinea',
  },
  '2': {
    id: '2',
    title: 'Warriors of the Highlands',
    description: 'An epic tale of tribal conflict and unity in the PNG highlands.',
    synopsis: 'Follow the journey of warriors as they navigate ancient rivalries and modern challenges in Papua New Guinea\'s breathtaking highlands. A story of honor, tradition, and the strength of community.',
    backdropUrl: 'https://images.squarespace-cdn.com/content/v1/68514c81437a5a3a6c11153b/1750158571960-6AMUGA4ZROG0JYQMKG9T/PNG_003.jpg?w=300&h=450&fit=crop',
    posterUrl: 'https://images.squarespace-cdn.com/content/v1/68514c81437a5a3a6c11153b/1750158571960-6AMUGA4ZROG0JYQMKG9T/PNG_003.jpg?w=300&h=450&fit=crop',
    genres: ['Action', 'Drama', 'History'],
    rating: 'R',
    year: 2023,
    runtime: 145,
    director: 'Michael Kandiu',
    cast: ['John Kapi', 'Mary Awi', 'Peter Muri'],
    language: 'Tok Pisin, English',
    country: 'Papua New Guinea',
  },
  '6': {
    id: '6',
    title: 'Spirit Houses',
    description: 'A mystical journey through PNG\'s spiritual traditions.',
    synopsis: 'Explore the sacred traditions of Papua New Guinea as a young anthropologist discovers the power of ancestral spirits and the importance of cultural preservation.',
    backdropUrl: 'https://c8.alamy.com/comp/EAK99C/hut-in-a-tribal-village-highlands-papua-new-guinea-EAK99C.jpg?w=300&h=450&fit=crop',
    posterUrl: 'https://c8.alamy.com/comp/EAK99C/hut-in-a-tribal-village-highlands-papua-new-guinea-EAK99C.jpg?w=300&h=450&fit=crop',
    genres: ['Drama', 'Mystery', 'Documentary'],
    rating: 'PG',
    year: 2023,
    runtime: 95,
    director: 'Sarah Kila',
    cast: ['James Kila', 'Anna Mori', 'Tom Wari'],
    language: 'English, Hiri Motu',
    country: 'Papua New Guinea',
  },
  '27': {
    id: '27',
    title: 'Lukim Yu',
    description: 'A touching love story set against the backdrop of Port Moresby.',
    synopsis: 'Two souls from different walks of life find connection in Papua New Guinea\'s capital city. A heartwarming tale of love, loss, and second chances.',
    backdropUrl: '/lukim-yu.jpg',
    posterUrl: '/lukim-yu.jpg',
    genres: ['Romance', 'Drama'],
    rating: 'PG-13',
    year: 2024,
    runtime: 102,
    director: 'Lisa Haro',
    cast: ['David Keli', 'Grace Maki', 'Paul Sori'],
    language: 'English, Tok Pisin',
    country: 'Papua New Guinea',
  },
  '28': {
    id: '28',
    title: 'WARA',
    description: 'A powerful environmental documentary about PNG\'s waterways.',
    synopsis: 'Journey through Papua New Guinea\'s majestic rivers and coastal regions, exploring the critical importance of water conservation and the communities that depend on these vital resources.',
    backdropUrl: '/wara.jpg',
    posterUrl: '/wara.jpg',
    genres: ['Documentary', 'Environmental'],
    rating: 'G',
    year: 2023,
    runtime: 88,
    director: 'Martin Moresby',
    cast: ['Narrator: Emma Wari'],
    language: 'English',
    country: 'Papua New Guinea',
  },
};

export function getFilmById(id: string): Film | undefined {
  return FILMS_DATABASE[id];
}

export function getAllFilms(): Film[] {
  return Object.values(FILMS_DATABASE);
}

export function searchFilms(query: string, filters?: {
  genre?: string;
  year?: number;
  rating?: string;
  language?: string;
}): Film[] {
  let results = getAllFilms();

  // Text search
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      (film) =>
        film.title.toLowerCase().includes(lowerQuery) ||
        film.description.toLowerCase().includes(lowerQuery) ||
        film.cast.some((actor) => actor.toLowerCase().includes(lowerQuery)) ||
        film.director.toLowerCase().includes(lowerQuery)
    );
  }

  // Apply filters
  if (filters?.genre) {
    results = results.filter((film) =>
      film.genres.some((g) => g.toLowerCase() === filters.genre?.toLowerCase())
    );
  }

  if (filters?.year) {
    results = results.filter((film) => film.year === filters.year);
  }

  if (filters?.rating) {
    results = results.filter((film) => film.rating === filters.rating);
  }

  if (filters?.language) {
    results = results.filter((film) =>
      film.language?.toLowerCase().includes(filters.language?.toLowerCase() || '')
    );
  }

  return results;
}
