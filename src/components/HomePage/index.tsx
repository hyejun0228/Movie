// import { useState, useEffect } from 'react';
// import Header from '../Header';
// import Footer from '../Footer';
// import MovieCard from '../MovieCard';
// import { getNowPlayingMovies, getPopularMovies, getTopRatedMovies } from '../../apis/Tmdbapi';
// import type { Movie } from 'types/movie';

// function HomePage() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [sortType, setSortType] = useState<'now_playing' | 'popular' | 'top_rated'>('now_playing');

//   useEffect(() => {
//     const loadMovies = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         let data;
//         switch (sortType) {
//           case 'popular':
//             data = await getPopularMovies(1);
//             break;
//           case 'top_rated':
//             data = await getTopRatedMovies(1);
//             break;
//           default:
//             data = await getNowPlayingMovies(1);
//         }
        
//         setMovies(data.results);
//       } catch (err) {
//         setError('영화 데이터를 불러오는데 실패했습니다.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMovies();
//   }, [sortType]);

//   const handleSortChange = (type: 'now_playing' | 'popular' | 'top_rated') => {
//     setSortType(type);
//   };
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header />
      
//       <main className="flex-grow">
//         <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//               영화 예매의 모든 것
//             </h1>
//             <p className="text-lg md:text-xl text-purple-100">
//               최신 영화를 편하게 예매하세요
//             </p>
//           </div>
//         </section>

//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//               {sortType === 'now_playing' && '현재 상영작'}
//               {sortType === 'popular' && '인기 영화'}
//               {sortType === 'top_rated' && '높은 평점 영화'}
//             </h2>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => handleSortChange('now_playing')}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   sortType === 'now_playing'
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 현재 상영작
//               </button>
//               <button
//                 onClick={() => handleSortChange('popular')}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   sortType === 'popular'
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 인기순
//               </button>
//               <button
//                 onClick={() => handleSortChange('top_rated')}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   sortType === 'top_rated'
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 평점순
//               </button>
//             </div>
//           </div>

//           {/* 로딩 상태 */}
//           {loading && (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//             </div>
//           )}

//           {/* 에러 상태 */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
//               {error}
//             </div>
//           )}

//           {/* 영화 목록 */}
//           {!loading && !error && movies.length > 0 && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//               {movies.map((movie) => (
//                 <MovieCard key={movie.id} movie={movie} />
//               ))}
//             </div>
//           )}

//           {/* 데이터 없음 */}
//           {!loading && !error && movies.length === 0 && (
//             <div className="text-center py-20">
//               <p className="text-gray-500 text-lg">
//                 영화 데이터가 없습니다.
//               </p>
//             </div>
//           )}
//         </section>

//         {/* Statistics Section */}
//         {!loading && !error && movies.length > 0 && (
//           <section className="bg-gray-100 py-12">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
//                 영화 통계
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white rounded-lg p-6 shadow-md">
//                   <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                     1위 영화
//                   </h3>
//                   <p className="text-2xl font-bold text-purple-600">
//                     {movies[0]?.title}
//                   </p>
//                   <p className="text-sm text-gray-500 mt-2">
//                     평점: ⭐ {movies[0]?.vote_average.toFixed(1)}
//                   </p>
//                 </div>
//                 <div className="bg-white rounded-lg p-6 shadow-md">
//                   <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                     평균 평점
//                   </h3>
//                   <p className="text-2xl font-bold text-purple-600">
//                     ⭐ {(movies.reduce((acc, m) => acc + m.vote_average, 0) / movies.length).toFixed(1)}
//                   </p>
//                   <p className="text-sm text-gray-500 mt-2">
//                     {movies.length}편의 평균
//                   </p>
//                 </div>
//                 <div className="bg-white rounded-lg p-6 shadow-md">
//                   <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                     최고 평점
//                   </h3>
//                   <p className="text-2xl font-bold text-purple-600">
//                     ⭐ {Math.max(...movies.map(m => m.vote_average)).toFixed(1)}
//                   </p>
//                   <p className="text-sm text-gray-500 mt-2">
//                     {movies.find(m => m.vote_average === Math.max(...movies.map(m => m.vote_average)))?.title}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// }

// export default HomePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import MovieCard from '../MovieCard';
import { getNowPlayingMovies, getPopularMovies, getTopRatedMovies } from '../../apis/Tmdbapi';
import type { Movie } from 'types/movie';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState<'now_playing' | 'popular' | 'top_rated'>('now_playing');

  // 영화 데이터 불러오기
  useEffect(() => {
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

    loadMovies();
  }, [sortType]);

  const handleSortChange = (type: 'now_playing' | 'popular' | 'top_rated') => {
    setSortType(type);
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              영화 예매의 모든 것
            </h1>
            <p className="text-lg md:text-xl text-purple-100">
              최신 영화를 편하게 예매하세요
            </p>
          </div>
        </section>

        {/* Movies Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {sortType === 'now_playing' && '현재 상영작'}
              {sortType === 'popular' && '인기 영화'}
              {sortType === 'top_rated' && '높은 평점 영화'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleSortChange('now_playing')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortType === 'now_playing'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                현재 상영작
              </button>
              <button
                onClick={() => handleSortChange('popular')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortType === 'popular'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                인기순
              </button>
              <button
                onClick={() => handleSortChange('top_rated')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortType === 'top_rated'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                평점순
              </button>
            </div>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* 영화 목록 */}
          {!loading && !error && movies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </div>
          )}

          {/* 데이터 없음 */}
          {!loading && !error && movies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                영화 데이터가 없습니다.
              </p>
            </div>
          )}
        </section>

        {/* Statistics Section */}
        {!loading && !error && movies.length > 0 && (
          <section className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                영화 통계
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    1위 영화
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {movies[0]?.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    평점: ⭐ {movies[0]?.vote_average.toFixed(1)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    평균 평점
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    ⭐ {(movies.reduce((acc, m) => acc + m.vote_average, 0) / movies.length).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {movies.length}편의 평균
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    최고 평점
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    ⭐ {Math.max(...movies.map(m => m.vote_average)).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {movies.find(m => m.vote_average === Math.max(...movies.map(m => m.vote_average)))?.title}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;