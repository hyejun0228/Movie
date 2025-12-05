import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

interface Theater {
  id: number;
  name: string;
  brand: 'CGV' | '롯데시네마' | '메가박스';
  region: string;
  district: string;
  address: string;
  tel: string;
  screens: number;
  seats: number;
  parking: boolean;
  facilities: string[];
  latitude: number;
  longitude: number;
}

const TheatersPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>('서울');
  const [selectedBrand, setSelectedBrand] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 극장 데이터
  const theaters: Theater[] = [
    // 서울 - CGV
    {
      id: 1,
      name: 'CGV 강남',
      brand: 'CGV',
      region: '서울',
      district: '강남구',
      address: '서울 강남구 강남대로 438',
      tel: '1544-1122',
      screens: 12,
      seats: 2100,
      parking: true,
      facilities: ['4DX', 'IMAX', 'SCREENX', '돌비 애트모스'],
      latitude: 37.5014,
      longitude: 127.0258,
    },
    {
      id: 2,
      name: 'CGV 홍대',
      brand: 'CGV',
      region: '서울',
      district: '마포구',
      address: '서울 마포구 양화로 153',
      tel: '1544-1122',
      screens: 10,
      seats: 1800,
      parking: true,
      facilities: ['4DX', 'SCREENX', '돌비 애트모스'],
      latitude: 37.5563,
      longitude: 126.9234,
    },
    {
      id: 3,
      name: 'CGV 용산아이파크몰',
      brand: 'CGV',
      region: '서울',
      district: '용산구',
      address: '서울 용산구 한강대로23길 55',
      tel: '1544-1122',
      screens: 14,
      seats: 2500,
      parking: true,
      facilities: ['IMAX', 'SCREENX', '돌비 애트모스', 'VIP'],
      latitude: 37.5290,
      longitude: 126.9654,
    },
    // 서울 - 롯데시네마
    {
      id: 4,
      name: '롯데시네마 월드타워',
      brand: '롯데시네마',
      region: '서울',
      district: '송파구',
      address: '서울 송파구 올림픽로 300',
      tel: '1544-8855',
      screens: 16,
      seats: 3000,
      parking: true,
      facilities: ['슈퍼 플렉스', 'SUPER 4D', 'IMAX', '돌비 애트모스'],
      latitude: 37.5125,
      longitude: 127.1025,
    },
    {
      id: 5,
      name: '롯데시네마 명동',
      brand: '롯데시네마',
      region: '서울',
      district: '중구',
      address: '서울 중구 명동8길 52',
      tel: '1544-8855',
      screens: 8,
      seats: 1400,
      parking: false,
      facilities: ['SUPER 4D', '돌비 애트모스'],
      latitude: 37.5636,
      longitude: 126.9850,
    },
    // 서울 - 메가박스
    {
      id: 6,
      name: '메가박스 코엑스',
      brand: '메가박스',
      region: '서울',
      district: '강남구',
      address: '서울 강남구 영동대로 513',
      tel: '1544-0070',
      screens: 13,
      seats: 2400,
      parking: true,
      facilities: ['MX', 'COMFORT', '돌비 애트모스', 'VIP'],
      latitude: 37.5115,
      longitude: 127.0595,
    },
    {
      id: 7,
      name: '메가박스 상봉',
      brand: '메가박스',
      region: '서울',
      district: '중랑구',
      address: '서울 중랑구 망우로 353',
      tel: '1544-0070',
      screens: 11,
      seats: 2000,
      parking: true,
      facilities: ['MX', 'COMFORT', '돌비 애트모스'],
      latitude: 37.5967,
      longitude: 127.0896,
    },
    // 경기
    {
      id: 8,
      name: 'CGV 수원',
      brand: 'CGV',
      region: '경기',
      district: '수원',
      address: '경기 수원시 팔달구 중부대로 210',
      tel: '1544-1122',
      screens: 10,
      seats: 1700,
      parking: true,
      facilities: ['4DX', 'SCREENX'],
      latitude: 37.2662,
      longitude: 127.0011,
    },
    {
      id: 9,
      name: '롯데시네마 일산',
      brand: '롯데시네마',
      region: '경기',
      district: '고양',
      address: '경기 고양시 일산서구 중앙로 1036',
      tel: '1544-8855',
      screens: 12,
      seats: 2100,
      parking: true,
      facilities: ['슈퍼 플렉스', 'SUPER 4D'],
      latitude: 37.6580,
      longitude: 126.7720,
    },
    {
      id: 10,
      name: '메가박스 분당',
      brand: '메가박스',
      region: '경기',
      district: '성남',
      address: '경기 성남시 분당구 황새울로 200',
      tel: '1544-0070',
      screens: 9,
      seats: 1600,
      parking: true,
      facilities: ['MX', 'COMFORT'],
      latitude: 37.3826,
      longitude: 127.1188,
    },
    // 인천
    {
      id: 11,
      name: 'CGV 인천',
      brand: 'CGV',
      region: '인천',
      district: '남동구',
      address: '인천 남동구 인주대로 593',
      tel: '1544-1122',
      screens: 11,
      seats: 1900,
      parking: true,
      facilities: ['4DX', 'SCREENX'],
      latitude: 37.4457,
      longitude: 126.6916,
    },
    {
      id: 12,
      name: '롯데시네마 인천',
      brand: '롯데시네마',
      region: '인천',
      district: '미추홀구',
      address: '인천 미추홀구 연남로 35',
      tel: '1544-8855',
      screens: 8,
      seats: 1400,
      parking: true,
      facilities: ['SUPER 4D'],
      latitude: 37.4634,
      longitude: 126.6507,
    },
  ];

  // 지역 목록
  const regions = ['서울', '경기', '인천', '부산', '대구', '대전', '광주'];

  // 브랜드 목록
  const brands = ['전체', 'CGV', '롯데시네마', '메가박스'];

  // 필터링된 극장
  const filteredTheaters = theaters.filter(theater => {
    const matchRegion = theater.region === selectedRegion;
    const matchBrand = selectedBrand === '전체' || theater.brand === selectedBrand;
    const matchSearch = 
      theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theater.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theater.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchRegion && matchBrand && matchSearch;
  });

  // 지역별 구 목록
  const districts = Array.from(new Set(filteredTheaters.map(t => t.district))).sort();

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'CGV':
        return 'bg-red-100 text-red-700 border-red-200';
      case '롯데시네마':
        return 'bg-red-100 text-red-700 border-red-200';
      case '메가박스':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🏢 극장 찾기
            </h1>
            <p className="text-lg md:text-xl text-purple-100">
              가까운 극장에서 영화를 즐기세요
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="bg-white shadow-md border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* 검색바 */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="극장명, 지역으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 필터 */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* 지역 선택 */}
              <div className="flex-1">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {regions.map(region => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                        selectedRegion === region
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* 브랜드 선택 */}
              <div className="flex gap-2">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedBrand === brand
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Theater List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 결과 헤더 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedRegion} 극장
            </h2>
            <p className="text-gray-600">
              총 {filteredTheaters.length}개의 극장
            </p>
          </div>

          {/* 구별 그룹 */}
          {districts.length > 0 ? (
            <div className="space-y-8">
              {districts.map(district => {
                const districtTheaters = filteredTheaters.filter(t => t.district === district);
                return (
                  <div key={district}>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-2xl mr-2">📍</span>
                      {district}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {districtTheaters.map(theater => (
                        <div
                          key={theater.id}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer"
                          onClick={() => navigate('/booking')}
                        >
                          {/* 헤더 */}
                          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-xl font-bold text-white">
                                {theater.name}
                              </h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBrandColor(theater.brand)}`}>
                                {theater.brand}
                              </span>
                            </div>
                          </div>

                          {/* 본문 */}
                          <div className="p-6">
                            {/* 주소 */}
                            <div className="mb-4">
                              <p className="flex items-start text-sm text-gray-600">
                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {theater.address}
                              </p>
                              <p className="flex items-center text-sm text-gray-600 mt-2">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {theater.tel}
                              </p>
                            </div>

                            {/* 정보 */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-600 mb-1">상영관</p>
                                <p className="text-lg font-bold text-purple-600">{theater.screens}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-600 mb-1">좌석</p>
                                <p className="text-lg font-bold text-purple-600">{theater.seats}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-600 mb-1">주차</p>
                                <p className="text-lg font-bold text-purple-600">
                                  {theater.parking ? '가능' : '불가'}
                                </p>
                              </div>
                            </div>

                            {/* 특별관 */}
                            <div className="mb-4">
                              <p className="text-xs text-gray-600 mb-2">특별관</p>
                              <div className="flex flex-wrap gap-2">
                                {theater.facilities.map((facility, index) => (
                                  <span
                                    key={index}
                                    className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                                  >
                                    {facility}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* 버튼 */}
                            <div className="flex gap-2">
                              <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm">
                                예매하기
                              </button>
                              <button className="px-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 검색 결과 없음 */
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg mb-2">검색 결과가 없습니다.</p>
              <p className="text-gray-500 text-sm">다른 검색어를 입력해보세요.</p>
            </div>
          )}
        </section>

        {/* Info Section */}
        <section className="bg-gradient-to-r from-purple-50 to-indigo-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              💡 특별관 안내
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* IMAX */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4 text-center">🎬</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">IMAX</h3>
                <p className="text-sm text-gray-600 text-center">
                  초대형 스크린과 최첨단 사운드 시스템으로 압도적인 몰입감
                </p>
              </div>

              {/* 4DX */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4 text-center">🎢</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">4DX</h3>
                <p className="text-sm text-gray-600 text-center">
                  모션 시트와 환경 효과로 영화 속으로 들어가는 듯한 체험
                </p>
              </div>

              {/* SCREENX */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4 text-center">📺</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">SCREENX</h3>
                <p className="text-sm text-gray-600 text-center">
                  270도 3면 상영으로 더욱 넓은 화면의 영화 감상
                </p>
              </div>

              {/* 돌비 애트모스 */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4 text-center">🔊</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">돌비 애트모스</h3>
                <p className="text-sm text-gray-600 text-center">
                  입체 음향 기술로 생생하고 몰입감 있는 사운드
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TheatersPage;