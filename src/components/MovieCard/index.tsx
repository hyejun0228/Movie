import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from 'types/movie';
import { getImageUrl } from '../../contants';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const navigate = useNavigate();
  const posterUrl = getImageUrl(movie.poster_path);
  const rating = movie.vote_average.toFixed(1);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/booking/${movie.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-200">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* 평점 배지 */}
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
          ⭐ {rating}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 min-h-[3.5rem]">
          {movie.title}
        </h3>
        
        {/* 통계 정보 */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">개봉</span>
            <span className="font-medium text-gray-900">{releaseYear}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">평가</span>
            <span className="font-medium text-purple-600">{movie.vote_count.toLocaleString()}명</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">인기도</span>
            <span className="font-medium text-gray-900">{Math.round(movie.popularity)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button 
            className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
            onClick={handleBookingClick}
          >
            예매하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
