import { BASE_URL } from '../contants/index'
import type { MoviesResponse } from '../../types/movie';
import type { MovieDetail } from 'types/movieDetail';

const API_KEY = import.meta.env.VITE_API_KEY;

export async function getPopularMovies(page: number = 1): Promise<MoviesResponse> {
  const response = await fetch(
    `${BASE_URL}movie/popular?api_key=${API_KEY}&language=ko-KR&page=${page}`
  );

  if (!response.ok) {
    throw new Error('영화 데이터를 불러오는데 실패했습니다.');
  }

  const data: MoviesResponse = await response.json();
  return data;
}

// 현재 상영중인 영화 가져오기
export async function getNowPlayingMovies(page: number = 1): Promise<MoviesResponse> {
  const response = await fetch(
    `${BASE_URL}movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=KR&page=${page}`
  );

  if (!response.ok) {
    throw new Error('영화 데이터를 불러오는데 실패했습니다.');
  }

  const data: MoviesResponse = await response.json();
  return data;
}

export async function getUpcomingMovies(page: number = 1): Promise<MoviesResponse> {
  const response = await fetch(
    `${BASE_URL}movie/upcoming?api_key=${API_KEY}&language=ko-KR&region=KR&page=${page}`
  );

  if (!response.ok) {
    throw new Error('영화 데이터를 불러오는데 실패했습니다.');
  }

  const data: MoviesResponse = await response.json();
  return data;
}

export async function getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
  const response = await fetch(
    `${BASE_URL}movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=${page}`
  );

  if (!response.ok) {
    throw new Error('영화 데이터를 불러오는데 실패했습니다.');
  }

  const data: MoviesResponse = await response.json();
  return data;
}

export async function getMovieDetail(movieId: number): Promise<MovieDetail> {
  const response = await fetch(
    `${BASE_URL}movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
  );

  if (!response.ok) {
    throw new Error('영화 상세 정보를 불러오는데 실패했습니다.');
  }

  const data: MovieDetail = await response.json();
  return data;
}

export async function searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
  const response = await fetch(
    `${BASE_URL}search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}&page=${page}`
  );

  if (!response.ok) {
    throw new Error('영화 검색에 실패했습니다.');
  }

  const data: MoviesResponse = await response.json();
  return data;
}