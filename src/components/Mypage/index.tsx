import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import Header from '../Header';
import Footer from '../Footer';

type TabType = 'profile' | 'bookings' | 'settings';

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const { bookings, cancelBooking } = useBookingStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: editForm.name,
      email: editForm.email,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/login');
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('예매를 취소하시겠습니까?')) {
      cancelBooking(bookingId);
    }
  };

  // 프로필 탭
  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* 프로필 카드 */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white text-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
            <p className="text-purple-200 text-lg">{user?.email}</p>
            <div className="mt-3 flex items-center space-x-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                🎬 영화 팬
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                ⭐ 회원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 정보 수정 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">개인 정보</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              수정
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    name: user?.name || '',
                    email: user?.email || '',
                  });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 w-24">이름</span>
              <span className="text-gray-900 font-medium">{user?.name}</span>
            </div>
            <div className="flex items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 w-24">이메일</span>
              <span className="text-gray-900 font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center py-3">
              <span className="text-gray-600 w-24">회원 ID</span>
              <span className="text-gray-900 font-medium">{user?.id}</span>
            </div>
          </div>
        )}
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🎬</div>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {bookings.filter(b => b.status === '관람 완료').length}
          </div>
          <div className="text-sm text-gray-600">관람한 영화</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🎫</div>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {bookings.filter(b => b.status === '예매 완료').length}
          </div>
          <div className="text-sm text-gray-600">예매 대기중</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}원
          </div>
          <div className="text-sm text-gray-600">총 결제금액</div>
        </div>
      </div>
    </div>
  );

  // 예매 내역 탭
  const renderBookingsTab = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">예매 내역</h3>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-600 mb-4">예매 내역이 없습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            영화 예매하러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* 포스터 */}
                <div className="md:w-32 h-48 md:h-auto">
                  <img
                    src={booking.moviePoster}
                    alt={booking.movieTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 정보 */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {booking.movieTitle}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {booking.theater} ({booking.theaterLocation})
                        </p>
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {booking.date} {booking.time}
                        </p>
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          좌석: {booking.seats.join(', ')} ({booking.peopleCount}명)
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === '예매 완료'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === '관람 완료'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-lg font-bold text-purple-600">
                      {booking.totalPrice.toLocaleString()}원
                    </div>
                    <div className="space-x-2">
                      {booking.status === '예매 완료' && (
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          예매 취소
                        </button>
                      )}
                      <button 
                        onClick={() => navigate(`/movie/${booking.movieId}`)}
                        className="px-4 py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        상세 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 설정 탭
  const renderSettingsTab = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">설정</h3>
      
      {/* 알림 설정 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-900 mb-4">알림 설정</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">이메일 알림</p>
              <p className="text-sm text-gray-600">예매 확인 및 이벤트 정보를 이메일로 받습니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">푸시 알림</p>
              <p className="text-sm text-gray-600">예매 시간 알림 및 이벤트 소식</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 비밀번호 변경 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-900 mb-4">보안</h4>
        <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">비밀번호 변경</p>
              <p className="text-sm text-gray-600">계정 보안을 위해 주기적으로 변경하세요</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* 계정 관리 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-900 mb-4">계정 관리</h4>
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">로그아웃</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg border border-red-300 hover:bg-red-50 transition-colors text-red-600">
            <div className="flex items-center justify-between">
              <span className="font-medium">회원 탈퇴</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* 탭 메뉴 */}
          <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  내 정보
                </span>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'bookings'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  예매 내역
                </span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  설정
                </span>
              </button>
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'bookings' && renderBookingsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPage;