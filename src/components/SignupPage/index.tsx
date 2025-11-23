import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Modal from '../Modal';

interface FormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  birthDate: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  phone?: string;
  birthDate?: string;
  agreeTerms?: string;
  agreePrivacy?: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    birthDate: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  // 이메일 유효성 검사
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 (8자 이상, 영문+숫자+특수문자)
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // 전화번호 유효성 검사
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 입력 시 해당 필드의 에러 제거
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // 전체 동의 체크박스 핸들러
  const handleAllAgree = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    }));
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.';
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 실제 회원가입 API 호출
      // await signupApi(formData);
      
      // 임시로 2초 대기 후 성공 처리
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공 모달 표시
      setModalConfig({
        type: 'success',
        title: '회원가입 완료!',
        message: 'MovieBox 회원이 되신 것을 축하합니다.',
      });
      setShowModal(true);
    } catch (error) {
      console.error('회원가입 실패:', error);
      
      // 에러 모달 표시
      setModalConfig({
        type: 'error',
        title: '회원가입 실패',
        message: '회원가입에 실패했습니다. 다시 시도해주세요.',
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    
    // 성공한 경우에만 로그인 페이지로 이동
    if (modalConfig.type === 'success') {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
            <p className="text-gray-600">MovieBox에 오신 것을 환영합니다!</p>
          </div>

          {/* 회원가입 폼 */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="8자 이상, 영문, 숫자, 특수문자 포함"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="비밀번호를 다시 입력해주세요"
                />
                {errors.passwordConfirm && (
                  <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm}</p>
                )}
              </div>

              {/* 이름 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="홍길동"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* 전화번호 */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="010-1234-5678"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* 생년월일 */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                  생년월일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>
                )}
              </div>

              {/* 약관 동의 */}
              <div className="border-t pt-6">
                <div className="space-y-4">
                  {/* 전체 동의 */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agreeAll"
                      checked={formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing}
                      onChange={(e) => handleAllAgree(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="agreeAll" className="ml-3 text-base font-medium text-gray-900">
                      전체 동의
                    </label>
                  </div>

                  <div className="ml-8 space-y-3">
                    {/* 이용약관 동의 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="agreeTerms" className="ml-3 text-sm text-gray-700">
                          이용약관 동의 <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        보기
                      </button>
                    </div>
                    {errors.agreeTerms && (
                      <p className="ml-7 text-sm text-red-500">{errors.agreeTerms}</p>
                    )}

                    {/* 개인정보처리방침 동의 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="agreePrivacy"
                          name="agreePrivacy"
                          checked={formData.agreePrivacy}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="agreePrivacy" className="ml-3 text-sm text-gray-700">
                          개인정보처리방침 동의 <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        보기
                      </button>
                    </div>
                    {errors.agreePrivacy && (
                      <p className="ml-7 text-sm text-red-500">{errors.agreePrivacy}</p>
                    )}

                    {/* 마케팅 정보 수신 동의 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="agreeMarketing"
                          name="agreeMarketing"
                          checked={formData.agreeMarketing}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="agreeMarketing" className="ml-3 text-sm text-gray-700">
                          마케팅 정보 수신 동의 (선택)
                        </label>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isLoading ? '처리중...' : '회원가입'}
              </button>
            </form>

            {/* 로그인 링크 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  로그인
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* 모달 */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
};

export default SignupPage;