import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  badge?: string;
  category: '할인' | '프로모션' | '시사회' | '이벤트';
}

const EventPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const events: Event[] = [
    {
      id: 1,
      title: '신규 회원 50% 할인',
      description: '첫 예매 시 티켓 가격 50% 할인! 지금 바로 회원가입하고 혜택을 받으세요.',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      badge: 'NEW',
      category: '할인',
    },
    {
      id: 2,
      title: '주말 특별 프로모션',
      description: '매주 토요일, 일요일 모든 상영관 20% 할인! 주말에 영화 보러 오세요.',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
      startDate: '2024-11-01',
      endDate: '2024-12-31',
      category: '프로모션',
    },
    {
      id: 3,
      title: '조조 할인 이벤트',
      description: '오전 10시 이전 상영작 30% 할인! 아침 일찍 영화를 즐기세요.',
      image: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=800&q=80',
      startDate: '2024-11-15',
      endDate: '2024-12-15',
      category: '할인',
    },
    {
      id: 4,
      title: '신작 영화 시사회',
      description: '개봉 전 먼저 보는 특별한 기회! 시사회에 초대합니다.',
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
      startDate: '2024-11-20',
      endDate: '2024-11-25',
      badge: 'HOT',
      category: '시사회',
    },
    {
      id: 5,
      title: '커플 패키지 특가',
      description: '2인 관람 + 팝콘 콤보 세트를 특별 가격에! 연인과 함께 즐기세요.',
      image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&q=80',
      startDate: '2024-11-01',
      endDate: '2024-12-14',
      category: '프로모션',
    },
    {
      id: 6,
      title: '가족 영화 축제',
      description: '온 가족이 함께 즐기는 영화 축제! 가족 단위 특별 할인 제공.',
      image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&q=80',
      startDate: '2024-12-01',
      endDate: '2024-12-25',
      badge: 'NEW',
      category: '이벤트',
    },
    {
      id: 7,
      title: '학생 할인 프로모션',
      description: '학생증 제시 시 모든 영화 40% 할인! 청소년의 문화생활을 응원합니다.',
      image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&q=80',
      startDate: '2024-11-01',
      endDate: '2025-02-28',
      category: '할인',
    },
    {
      id: 8,
      title: '생일자 무료 관람',
      description: '생일 당일 신분증 제시하면 영화 무료 관람! 특별한 날을 더 특별하게.',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      badge: 'HOT',
      category: '이벤트',
    },
  ];

  const categories = ['전체', '할인', '프로모션', '시사회', '이벤트'];

  const filteredEvents =
    selectedCategory === '전체'
      ? events
      : events.filter((event) => event.category === selectedCategory);

  const isEventActive = (endDate: string) => {
    return new Date(endDate) >= new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              이벤트
            </h1>
            <p className="text-lg md:text-xl text-purple-100">
              다양한 할인과 프로모션을 만나보세요
            </p>
          </div>
        </section>

        <section className="bg-white border-b sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === '전체'
                ? `전체 이벤트 ${filteredEvents.length}건`
                : `${selectedCategory} ${filteredEvents.length}건`}
            </h2>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                  
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {event.badge && (
                      <div
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                          event.badge === 'NEW'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {event.badge}
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-black bg-opacity-60 text-white">
                      {event.category}
                    </div>
                    
                    {!isEventActive(event.endDate) && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          종료된 이벤트
                        </span>
                      </div>
                    )}
                  </div>

                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {event.startDate} ~ {event.endDate}
                      </span>
                    </div>

                    
                    <button
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        isEventActive(event.endDate)
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!isEventActive(event.endDate)}
                    >
                      {isEventActive(event.endDate)
                        ? '자세히 보기'
                        : '종료된 이벤트'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                해당 카테고리의 이벤트가 없습니다.
              </p>
            </div>
          )}
        </section>

        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              더 많은 혜택을 받고 싶으신가요?
            </h2>
            <p className="text-lg text-purple-100 mb-8">
              회원가입하고 다양한 이벤트와 할인 혜택을 누리세요!
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/signup"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                회원가입
              </a>
              <a
                href="/"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-purple-600 transition-colors"
              >
                영화 보러가기
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EventPage;