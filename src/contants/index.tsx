export const BASE_URL = 'https://api.themoviedb.org/3/';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// 이미지 사이즈
export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'w1280';

// 이미지 URL 생성 헬퍼
export const getImageUrl = (path: string, size: string = POSTER_SIZE) => {
  if (!path) return '/placeholder.jpg'; // placeholder 이미지
  return `${IMAGE_BASE_URL}${size}${path}`;
};

// 백드롭 이미지 URL 생성 헬퍼
export const getBackdropUrl = (path: string) => {
  return getImageUrl(path, BACKDROP_SIZE);
};