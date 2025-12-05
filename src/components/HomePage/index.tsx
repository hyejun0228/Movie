import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Header from '../Header';
import Footer from '../Footer';
import MovieCard from '../MovieCard';
import { getNowPlayingMovies, getPopularMovies, getTopRatedMovies } from '../../apis/Tmdbapi';
import type { Movie } from 'types/movie';

type SortType = 'now_playing' | 'popular' | 'top_rated';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortType>('now_playing');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const bannerMovies = movies.slice(0, 3);

  useEffect(() => {
    loadMovies();
  }, [sortType]);

  useEffect(() => {
    if (bannerMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerMovies.length]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      switch (sortType) {
        case 'popular':
          data = await getPopularMovies(1);
          break;
        case 'top_rated':
          data = await getTopRatedMovies(1);
          break;
        default:
          data = await getNowPlayingMovies(1);
      }
      
      setMovies(data.results);
    } catch (err) {
      setError('영화 데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBooking = () => {
    if (isAuthenticated) {
      navigate('/booking');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Main Banner with Movie Posters */}
        {!loading && bannerMovies.length > 0 && (
          <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-black">
            {bannerMovies.map((movie, index) => (
              <div
                key={movie.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl text-white">
                      <div className="inline-block bg-purple-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                        🎬 현재 상영중
                      </div>
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                        {movie.title}
                      </h1>
                      <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-3">
                        {movie.overview || '최고의 영화 경험을 선사합니다.'}
                      </p>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </div>
                        <div className="text-gray-300">
                          {new Date(movie.release_date).getFullYear()}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/movie/${movie.id}`)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          예매하기
                        </button>
                        <button
                          onClick={() => navigate(`/movie/${movie.id}`)}
                          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-bold transition-colors"
                        >
                          상세정보
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {bannerMovies.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentBannerIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentBannerIndex
                          ? 'bg-purple-600 w-8'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {sortType === 'now_playing' && '현재 상영작'}
                {sortType === 'popular' && '인기 영화'}
                {sortType === 'top_rated' && '높은 평점 영화'}
              </h2>
              <p className="text-gray-600">
                {movies.length > 0 && `${movies.length}편의 영화`}
              </p>
            </div>
            
            {/* Filter Tabs - Desktop */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setSortType('now_playing')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  sortType === 'now_playing'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                현재 상영작
              </button>
              <button
                onClick={() => setSortType('popular')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  sortType === 'popular'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                인기순
              </button>
              <button
                onClick={() => setSortType('top_rated')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  sortType === 'top_rated'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                평점순
              </button>
            </div>
          </div>

          {/* Mobile Filter */}
          <div className="md:hidden mb-6">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="now_playing">🎬 현재 상영작</option>
              <option value="popular">🔥 인기순</option>
              <option value="top_rated">⭐ 평점순</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4" />
              <p className="text-gray-600">영화 정보를 불러오는 중...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Movies Grid */}
          {!loading && !error && movies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && movies.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-500 text-lg mb-2">영화 데이터가 없습니다.</p>
              <p className="text-gray-400 text-sm">잠시 후 다시 시도해주세요.</p>
            </div>
          )}
        </section>

        {/* Event & Benefits Section */}
        <section className="bg-gradient-to-r from-purple-50 to-indigo-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              🎉 이벤트 & 혜택
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Card 1 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-6xl">🎁</span>
                </div>
                <div className="p-6">
                  <div className="inline-block bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded mb-2">
                    진행중
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    신규 회원 혜택
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    첫 예매 시 5,000원 할인 쿠폰 증정
                  </p>
                  <button className="text-purple-600 font-medium text-sm hover:underline">
                    자세히 보기 →
                  </button>
                </div>
              </div>

              {/* Event Card 2 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-6xl">🍿</span>
                </div>
                <div className="p-6">
                  <div className="inline-block bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded mb-2">
                    상시
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    콤보 할인
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    팝콘+음료 세트 최대 30% 할인
                  </p>
                  <button className="text-purple-600 font-medium text-sm hover:underline">
                    자세히 보기 →
                  </button>
                </div>
              </div>

              {/* Event Card 3 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="h-48 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-6xl">💳</span>
                </div>
                <div className="p-6">
                  <div className="inline-block bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded mb-2">
                    D-7
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    카드 할인
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    제휴 카드 결제 시 즉시 할인
                  </p>
                  <button className="text-purple-600 font-medium text-sm hover:underline">
                    자세히 보기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Download Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  MovieBox 앱 다운로드
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  더 빠르고 편리한 예매, 지금 바로 다운로드하세요!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    App Store
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    Google Play
                  </button>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="inline-block bg-white p-8 rounded-2xl">
                  <div className="text-8xl">📱</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;