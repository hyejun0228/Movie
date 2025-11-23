import { BASE_URL } from "../constants";
import type { Movie } from "../types/movie";

const API_KEY = import.meta.env.VITE_API_KEY;

export async function searchMoviesByName(
  query: string,
  page: number = 1
): Promise<Movie[]> {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await fetch(
    `${BASE_URL}search/movie?api_key=${API_KEY}&language=ko-KR&query=${query}&page=${page}`
  );

  if (!response.ok) {
    throw new Error("서버 상태가 이상합니다.");
  }

  const data = await response.json();
  return data.results;
}
