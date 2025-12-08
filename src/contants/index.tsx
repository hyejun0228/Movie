export const BASE_URL = 'https://api.themoviedb.org/3/';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'w1280';

export const getImageUrl = (path: string, size: string = POSTER_SIZE) => {
  if (!path) return '/placeholder.jpg';
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getBackdropUrl = (path: string) => {
  return getImageUrl(path, BACKDROP_SIZE);
};