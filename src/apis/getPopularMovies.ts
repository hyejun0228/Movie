import { BASE_URL } from "@/contants";
import type { Movie } from "types/movie";

const API_KEY = import.meta.env.VITE_API_KEY;

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const response = await fetch(
    `${BASE_URL}movie/popular?api_key=${API_KEY}&language=ko-KR&page=${page}`
  );

  if (!response.ok) {
    throw new Error("서버 상태가 이상합니다.");
  }

  const data = await response.json();
  return data.results;
}
