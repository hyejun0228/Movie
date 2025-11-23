import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-purple-600">
              🎬 MovieBox
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              영화
            </Link>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              예매
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              극장
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              이벤트
            </a>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              회원가입
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                영화
              </Link>
              <a
                href="#"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                예매
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                극장
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                이벤트
              </a>
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors text-left"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;