import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1: 극장/시간, 2: 좌석, 3: 결제

  // 선택된 정보
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [selectedShowTime, setSelectedShowTime] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [peopleCount, setPeopleCount] = useState(1);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);

  // 임시 데이터
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

  // 좌석 생성
  const generateSeats = (): Seat[] => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;
    const seats: Seat[] = [];

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          isAvailable: Math.random() > 0.3, // 70% 확률로 예약 가능
          isSelected: false,
        });
      }
    });

    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(generateSeats());

  // 날짜 생성 (오늘부터 7일)
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
    const loadMovieDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getMovieDetail(parseInt(id));
        setMovie(data);
        
        // 오늘 날짜를 기본 선택
        setSelectedDate(dates[0].toISOString().split('T')[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetail();
  }, [id]);

  // 좌석 선택 핸들러
  const handleSeatClick = (seatId: string) => {
    setSeats(prev =>
      prev.map(seat => {
        if (seat.id === seatId && seat.isAvailable) {
          const isCurrentlySelected = seat.isSelected;
          
          // 선택 해제하는 경우
          if (isCurrentlySelected) {
            setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
            return { ...seat, isSelected: false };
          }
          
          // 인원수만큼만 선택 가능
          if (selectedSeats.length < peopleCount) {
            const updatedSeat = { ...seat, isSelected: true };
            setSelectedSeats(prev => [...prev, updatedSeat]);
            return updatedSeat;
          }
        }
        return seat;
      })
    );
  };

  // 인원 수 변경 시 좌석 초기화
  const handlePeopleCountChange = (count: number) => {
    setPeopleCount(count);
    setSelectedSeats([]);
    setSeats(prev => prev.map(seat => ({ ...seat, isSelected: false })));
  };

  // 다음 단계로
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedTheater || !selectedShowTime) {
        setShowModal(true);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedSeats.length !== peopleCount) {
        setShowModal(true);
        return;
      }
      setCurrentStep(3);
    }
  };

  // 이전 단계로
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // 결제하기
  const handlePayment = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    
    // 결제 완료 시 홈으로 이동
    if (currentStep === 3) {
      navigate('/');
    }
  };

  const getModalMessage = () => {
    if (currentStep === 1) {
      return { title: '알림', message: '극장과 시간을 선택해주세요.' };
    } else if (currentStep === 2) {
      return { title: '알림', message: `${peopleCount}명의 좌석을 선택해주세요.` };
    } else {
      return { title: '결제 완료', message: '예매가 완료되었습니다!\n(실제 결제 기능은 추후 구현 예정)' };
    }
  };

  if (loading || !movie) {
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

  const ticketPrice = 12000;
  const totalPrice = ticketPrice * peopleCount;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 영화 정보 헤더 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-6">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  <span>|</span>
                  <span>{movie.runtime}분</span>
                  <span>|</span>
                  <span>{movie.genres.map(g => g.name).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 진행 단계 표시 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: '극장/시간' },
                { step: 2, title: '좌석선택' },
                { step: 3, title: '결제' },
              ].map((item, index) => (
                <React.Fragment key={item.step}>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentStep >= item.step
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {item.step}
                    </div>
                    <span
                      className={`ml-3 font-medium ${
                        currentStep >= item.step ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        currentStep > item.step ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step 1: 극장 및 시간 선택 */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 날짜 선택 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">날짜 선택</h2>
                <div className="space-y-2">
                  {dates.map(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedDate === dateStr
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="font-medium">
                          {date.getMonth() + 1}/{date.getDate()} ({dayName})
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 극장 선택 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">극장 선택</h2>
                <div className="space-y-2">
                  {theaters.map(theater => (
                    <button
                      key={theater.id}
                      onClick={() => setSelectedTheater(theater.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedTheater === theater.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{theater.name}</div>
                      <div className="text-sm opacity-80">{theater.location}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 시간 선택 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">시간 선택</h2>
                <div className="grid grid-cols-2 gap-2">
                  {showTimes.map(showTime => (
                    <button
                      key={showTime.id}
                      onClick={() => setSelectedShowTime(showTime.id)}
                      disabled={showTime.availableSeats === 0}
                      className={`p-3 rounded-lg transition-colors ${
                        selectedShowTime === showTime.id
                          ? 'bg-purple-600 text-white'
                          : showTime.availableSeats === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{showTime.time}</div>
                      <div className="text-xs mt-1">
                        {showTime.availableSeats}/{showTime.totalSeats}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 좌석 선택 */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">인원 선택</h2>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(count => (
                    <button
                      key={count}
                      onClick={() => handlePeopleCountChange(count)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        peopleCount === count
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {count}명
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">좌석 선택</h2>
                
                {/* 스크린 */}
                <div className="mb-8">
                  <div className="bg-gray-200 text-center py-2 rounded-lg mb-4">
                    <span className="text-gray-600 text-sm">SCREEN</span>
                  </div>
                </div>

                {/* 좌석 범례 */}
                <div className="flex justify-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
                    <span>선택가능</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded"></div>
                    <span>선택됨</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    <span>예약불가</span>
                  </div>
                </div>

                {/* 좌석 그리드 */}
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
                      <div key={row} className="flex items-center gap-2 mb-2">
                        <span className="w-6 text-center font-medium text-gray-600">{row}</span>
                        {seats
                          .filter(seat => seat.row === row)
                          .map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id)}
                              disabled={!seat.isAvailable}
                              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                                seat.isSelected
                                  ? 'bg-purple-600 text-white'
                                  : seat.isAvailable
                                  ? 'bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700'
                                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              }`}
                            >
                              {seat.number}
                            </button>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 선택된 좌석 표시 */}
                {selectedSeats.length > 0 && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">선택한 좌석:</p>
                    <p className="text-purple-600 font-bold">
                      {selectedSeats.map(s => s.id).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: 결제 */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">결제 정보</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">영화</span>
                  <span className="font-medium">{movie.title}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">극장</span>
                  <span className="font-medium">
                    {theaters.find(t => t.id === selectedTheater)?.name}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">날짜</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">시간</span>
                  <span className="font-medium">
                    {showTimes.find(s => s.id === selectedShowTime)?.time}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">좌석</span>
                  <span className="font-medium">{selectedSeats.map(s => s.id).join(', ')}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">인원</span>
                  <span className="font-medium">{peopleCount}명</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-lg font-bold text-gray-900">총 결제금액</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  ※ 실제 결제 기능은 추후 구현 예정입니다.
                </p>
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex gap-4 mt-6">
            {currentStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                결제하기
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* 모달 */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        type={currentStep === 3 ? 'success' : 'warning'}
        title={getModalMessage().title}
        message={getModalMessage().message}
      />
    </div>
  );
};

export default BookingPage;