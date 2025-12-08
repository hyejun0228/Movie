import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import Header from '../Header';
import Footer from '../Footer';
import Modal from '../Modal';
import { getMovieDetail } from '../../apis/Tmdbapi';
import { getImageUrl } from '../../contants';
import type { MovieDetail } from 'types/movieDetail';

interface Theater {
  id: number;
  name: string;
  location: string;
}

interface ShowTime {
  id: number;
  time: string;
  availableSeats: number;
  totalSeats: number;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
}

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addBooking } = useBookingStore();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [selectedShowTime, setSelectedShowTime] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [peopleCount, setPeopleCount] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', message: '' });

  const theaters: Theater[] = [
    { id: 1, name: 'CGV 강남', location: '서울 강남구' },
    { id: 2, name: 'CGV 홍대', location: '서울 마포구' },
    { id: 3, name: '롯데시네마 월드타워', location: '서울 송파구' },
    { id: 4, name: '메가박스 코엑스', location: '서울 강남구' },
  ];

  const showTimes: ShowTime[] = [
    { id: 1, time: '10:00', availableSeats: 45, totalSeats: 100 },
    { id: 2, time: '12:30', availableSeats: 23, totalSeats: 100 },
    { id: 3, time: '15:00', availableSeats: 67, totalSeats: 100 },
    { id: 4, time: '17:30', availableSeats: 12, totalSeats: 100 },
    { id: 5, time: '20:00', availableSeats: 89, totalSeats: 100 },
    { id: 6, time: '22:30', availableSeats: 56, totalSeats: 100 },
  ];

  const generateSeats = (): Seat[] => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;
    const seats: Seat[] = [];

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const randomAvailable = Math.random() > 0.2;
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          isAvailable: randomAvailable,
          isSelected: false,
        });
      }
    });

    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>([]);

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadMovieDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getMovieDetail(parseInt(id));
        setMovie(data);
        
        setSelectedDate(dates[0].toISOString().split('T')[0]);
        setSeats(generateSeats());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetail();
  }, [id, isAuthenticated, navigate]);

  const handleSeatClick = (seatId: string) => {
    const clickedSeat = seats.find(s => s.id === seatId);
    if (!clickedSeat || !clickedSeat.isAvailable) return;

    if (clickedSeat.isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
      setSeats(prev => prev.map(seat => 
        seat.id === seatId ? { ...seat, isSelected: false } : seat
      ));
    } else {
      if (selectedSeats.length >= peopleCount) {
        setModalMessage({
          title: '알림',
          message: `최대 ${peopleCount}명까지 선택 가능합니다.`
        });
        setShowModal(true);
        return;
      }

      const updatedSeat = { ...clickedSeat, isSelected: true };
      setSelectedSeats(prev => [...prev, updatedSeat]);
      setSeats(prev => prev.map(seat => 
        seat.id === seatId ? updatedSeat : seat
      ));
    }
  };

  const handlePeopleCountChange = (count: number) => {
    setPeopleCount(count);
    setSelectedSeats([]);
    setSeats(prev => prev.map(seat => ({ ...seat, isSelected: false })));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedTheater || !selectedShowTime) {
        setModalMessage({
          title: '알림',
          message: '극장과 시간을 선택해주세요.'
        });
        setShowModal(true);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedSeats.length !== peopleCount) {
        setModalMessage({
          title: '알림',
          message: `${peopleCount}명의 좌석을 선택해주세요. (현재 ${selectedSeats.length}석)`
        });
        setShowModal(true);
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePayment = () => {
    if (!movie || !selectedTheater || !selectedShowTime) return;

    const selectedTheaterData = theaters.find(t => t.id === selectedTheater);
    const selectedShowTimeData = showTimes.find(s => s.id === selectedShowTime);
    addBooking({
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: getImageUrl(movie.poster_path),
      theater: selectedTheaterData?.name || '',
      theaterLocation: selectedTheaterData?.location || '',
      date: selectedDate,
      time: selectedShowTimeData?.time || '',
      seats: selectedSeats.map(s => s.id),
      peopleCount,
      totalPrice: 12000 * peopleCount,
    });

    setModalMessage({
      title: '예매 완료! 🎉',
      message: '예매가 완료되었습니다!\n마이페이지에서 확인하실 수 있습니다.'
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    
    if (currentStep === 3 && modalMessage.title.includes('예매 완료')) {
      navigate('/mypage');
    }
  };

  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600">영화 정보를 불러오는 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const ticketPrice = 12000;
  const totalPrice = ticketPrice * peopleCount;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-32 h-48 object-cover rounded-lg shadow-lg"
              />
              <div className="flex-1">
                <div className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  예매하기
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span>🕐 {movie.runtime}분</span>
                  <span className="text-gray-300">|</span>
                  <span>🎭 {movie.genres.map(g => g.name).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { step: 1, title: '극장/시간', icon: '🏢' },
                { step: 2, title: '좌석선택', icon: '💺' },
                { step: 3, title: '결제', icon: '💳' },
              ].map((item, index) => (
                <React.Fragment key={item.step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                        currentStep >= item.step
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        currentStep >= item.step ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className="flex-1 mx-4">
                      <div
                        className={`h-1 rounded-full transition-all ${
                          currentStep > item.step ? 'bg-purple-600' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 날짜 선택 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📅</span>
                  날짜 선택
                </h2>
                <div className="space-y-2">
                  {dates.map(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          selectedDate === dateStr
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-lg">
                              {date.getMonth() + 1}월 {date.getDate()}일
                            </div>
                            <div className={`text-sm ${selectedDate === dateStr ? 'text-purple-100' : 'text-gray-500'}`}>
                              {dayName}요일 {isToday && '(오늘)'}
                            </div>
                          </div>
                          {selectedDate === dateStr && (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🏢</span>
                  극장 선택
                </h2>
                <div className="space-y-2">
                  {theaters.map(theater => (
                    <button
                      key={theater.id}
                      onClick={() => setSelectedTheater(theater.id)}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        selectedTheater === theater.id
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{theater.name}</div>
                          <div className={`text-sm ${selectedTheater === theater.id ? 'text-purple-100' : 'text-gray-500'}`}>
                            {theater.location}
                          </div>
                        </div>
                        {selectedTheater === theater.id && (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🕐</span>
                  시간 선택
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {showTimes.map(showTime => {
                    const availabilityPercent = (showTime.availableSeats / showTime.totalSeats) * 100;
                    const isAlmostFull = availabilityPercent < 20;
                    
                    return (
                      <button
                        key={showTime.id}
                        onClick={() => setSelectedShowTime(showTime.id)}
                        disabled={showTime.availableSeats === 0}
                        className={`p-4 rounded-lg transition-all ${
                          selectedShowTime === showTime.id
                            ? 'bg-purple-600 text-white shadow-lg'
                            : showTime.availableSeats === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="font-bold text-lg mb-1">{showTime.time}</div>
                        <div className={`text-xs ${
                          selectedShowTime === showTime.id 
                            ? 'text-purple-100' 
                            : isAlmostFull 
                            ? 'text-red-500 font-medium' 
                            : 'text-gray-500'
                        }`}>
                          {showTime.availableSeats === 0 ? '매진' : `${showTime.availableSeats}석`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">👥</span>
                  인원 선택
                </h2>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(count => (
                    <button
                      key={count}
                      onClick={() => handlePeopleCountChange(count)}
                      className={`px-6 py-3 rounded-lg font-bold transition-all ${
                        peopleCount === count
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {count}명
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💺</span>
                  좌석 선택
                  <span className="ml-3 text-sm font-normal text-gray-500">
                    ({selectedSeats.length}/{peopleCount}석 선택)
                  </span>
                </h2>
                
                <div className="mb-8">
                  <div className="relative">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-200 py-3 rounded-t-[50%] text-center">
                      <span className="text-gray-600 font-bold">SCREEN</span>
                    </div>
                    <div className="h-2 bg-gray-200"></div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm font-medium">선택가능</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded shadow-lg"></div>
                    <span className="text-sm font-medium">선택됨</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                    <span className="text-sm font-medium">예약불가</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full px-4">
                    <div className="flex justify-center">
                      <div>
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
                          <div key={row} className="flex items-center gap-2 mb-3">
                            <span className="w-8 text-center font-bold text-gray-600">{row}</span>
                            <div className="flex gap-2">
                              {seats
                                .filter(seat => seat.row === row)
                                .map(seat => (
                                  <button
                                    key={seat.id}
                                    onClick={() => handleSeatClick(seat.id)}
                                    disabled={!seat.isAvailable}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                                      seat.isSelected
                                        ? 'bg-purple-600 text-white shadow-lg scale-110'
                                        : seat.isAvailable
                                        ? 'bg-gray-100 border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 text-gray-700'
                                        : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    {seat.number}
                                  </button>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="mt-8 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">선택한 좌석</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {selectedSeats.map(s => s.id).join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700 mb-2">결제 금액</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {(ticketPrice * selectedSeats.length).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-2">💳</span>
                결제 정보 확인
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">영화</p>
                    <p className="text-lg font-bold text-gray-900">{movie.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">극장</p>
                      <p className="font-bold text-gray-900">
                        {theaters.find(t => t.id === selectedTheater)?.name}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">상영시간</p>
                      <p className="font-bold text-gray-900">
                        {showTimes.find(s => s.id === selectedShowTime)?.time}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">날짜</p>
                    <p className="font-bold text-gray-900">{selectedDate}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">좌석</p>
                    <p className="font-bold text-gray-900">
                      {selectedSeats.map(s => s.id).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">결제 금액</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">일반</span>
                        <span className="font-medium">{peopleCount}명 × {ticketPrice.toLocaleString()}원</span>
                      </div>
                      <div className="border-t-2 border-purple-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900">총 결제금액</span>
                          <span className="text-3xl font-bold text-purple-600">
                            {totalPrice.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-2xl mr-2">ℹ️</span>
                      <div>
                        <p className="text-sm font-medium text-yellow-900 mb-1">안내사항</p>
                        <p className="text-xs text-yellow-800">
                          • 실제 결제 기능은 추후 구현 예정입니다.<br/>
                          • 예매 내역은 마이페이지에서 확인 가능합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            {currentStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="flex-1 py-4 px-6 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                ← 이전
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="flex-1 py-4 px-6 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30"
              >
                다음 →
              </button>
            ) : (
              <button
                onClick={handlePayment}
                className="flex-1 py-4 px-6 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30"
              >
                💳 결제하기
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        type={modalMessage.title.includes('예매 완료') ? 'success' : 'warning'}
        title={modalMessage.title}
        message={modalMessage.message}
      />
    </div>
  );
};

export default BookingPage;