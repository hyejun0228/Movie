import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { getMovieDetail } from '../../apis/Tmdbapi';
import { getImageUrl, getBackdropUrl } from '../../contants';
import type { MovieDetail } from 'types/movieDetail';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovieDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetail(parseInt(id));
        setMovie(data);
      } catch (err) {
        setError('영화 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || '영화를 찾을 수 없습니다.'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getImageUrl(movie.poster_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분` : 'N/A';
  const budget = movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A';
  const revenue = movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* 배경 이미지 섹션 */}
        <div className="relative h-[500px] bg-gray-900">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
          </div>

          {/* 영화 정보 오버레이 */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
              {/* 포스터 */}
              <div className="flex-shrink-0">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-48 md:w-64 rounded-lg shadow-2xl"
                />
              </div>

              {/* 기본 정보 */}
              <div className="text-white pb-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
                {movie.original_title !== movie.title && (
                  <p className="text-xl text-gray-300 mb-4">{movie.original_title}</p>
                )}
                {movie.tagline && (
                  <p className="text-lg italic text-purple-300 mb-4">"{movie.tagline}"</p>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-xl font-bold">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-300">({movie.vote_count.toLocaleString()}명)</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span>{releaseYear}</span>
                  <span className="text-gray-300">|</span>
                  <span>{runtime}</span>
                  <span className="text-gray-300">|</span>
                  <span className="px-3 py-1 bg-purple-600 rounded-full text-sm">
                    {movie.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => navigate(`/booking/${movie.id}`)}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-semibold transition-colors"
                >
                  예매하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 섹션 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 줄거리 및 상세 정보 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 줄거리 */}
              <section className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">줄거리</h2>
                <p className="text-gray-700 leading-relaxed">
                  {movie.overview || '줄거리 정보가 없습니다.'}
                </p>
              </section>

              {/* 제작사 */}
              {movie.production_companies.length > 0 && (
                <section className="bg-white rounded-lg p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">제작사</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.production_companies.map((company) => (
                      <div
                        key={company.id}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg"
                      >
                        {company.logo_path ? (
                          <img
                            src={getImageUrl(company.logo_path, 'w200')}
                            alt={company.name}
                            className="h-12 object-contain mb-2"
                          />
                        ) : (
                          <div className="h-12 flex items-center justify-center mb-2">
                            <span className="text-gray-400 text-sm">No Logo</span>
                          </div>
                        )}
                        <p className="text-sm text-center text-gray-700">{company.name}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* 오른쪽: 추가 정보 */}
            <div className="space-y-6">
              {/* 영화 정보 */}
              <section className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">영화 정보</h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-600">개봉일</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {movie.release_date || 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">상영 시간</dt>
                    <dd className="text-base font-medium text-gray-900">{runtime}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">예산</dt>
                    <dd className="text-base font-medium text-gray-900">{budget}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">수익</dt>
                    <dd className="text-base font-medium text-gray-900">{revenue}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">원제</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {movie.original_title}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">원어</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {movie.original_language.toUpperCase()}
                    </dd>
                  </div>
                  {movie.imdb_id && (
                    <div>
                      <dt className="text-sm text-gray-600">IMDB</dt>
                      <dd className="text-base font-medium">
                        <a
                          href={`https://www.imdb.com/title/${movie.imdb_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          {movie.imdb_id}
                        </a>
                      </dd>
                    </div>
                  )}
                  {movie.homepage && (
                    <div>
                      <dt className="text-sm text-gray-600">공식 홈페이지</dt>
                      <dd className="text-base font-medium">
                        <a
                          href={movie.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 break-all"
                        >
                          방문하기
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* 제작 국가 */}
              {movie.production_countries.length > 0 && (
                <section className="bg-white rounded-lg p-6 shadow-md">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">제작 국가</h2>
                  <ul className="space-y-2">
                    {movie.production_countries.map((country) => (
                      <li key={country.iso_3166_1} className="text-gray-700">
                        {country.name}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 언어 */}
              {movie.spoken_languages.length > 0 && (
                <section className="bg-white rounded-lg p-6 shadow-md">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">언어</h2>
                  <ul className="space-y-2">
                    {movie.spoken_languages.map((language) => (
                      <li key={language.iso_639_1} className="text-gray-700">
                        {language.name}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetailPage;