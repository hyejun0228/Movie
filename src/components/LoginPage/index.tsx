// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import Header from '../Header';
// import Footer from '../Footer';
// import Modal from '../Modal';

// interface LoginFormData {
//   email: string;
//   password: string;
//   rememberMe: boolean;
// }

// const LoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });

//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//   const [isLoading, setIsLoading] = useState(false);
  
//   const [showModal, setShowModal] = useState(false);
//   const [modalConfig, setModalConfig] = useState({
//     type: 'success' as 'success' | 'error',
//     title: '',
//     message: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     // 입력 시 해당 필드의 에러 제거
//     if (errors[name as keyof typeof errors]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: undefined
//       }));
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: { email?: string; password?: string } = {};

//     if (!formData.email) {
//       newErrors.email = '이메일을 입력해주세요.';
//     }

//     if (!formData.password) {
//       newErrors.password = '비밀번호를 입력해주세요.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // TODO: 실제 로그인 API 호출
//       // await loginApi(formData);
      
//       // 임시로 2초 대기 후 성공 처리
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // 성공 모달 표시
//       setModalConfig({
//         type: 'success',
//         title: '로그인 성공!',
//         message: 'MovieBox에 오신 것을 환영합니다.',
//       });
//       setShowModal(true);
//     } catch (error) {
//       console.error('로그인 실패:', error);
      
//       // 에러 모달 표시
//       setModalConfig({
//         type: 'error',
//         title: '로그인 실패',
//         message: '이메일과 비밀번호를 확인해주세요.',
//       });
//       setShowModal(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
    
//     // 성공한 경우에만 홈으로 이동
//     if (modalConfig.type === 'success') {
//       navigate('/');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header simple />

//       <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full">
//           {/* 헤더 */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
//             <p className="text-gray-600">MovieBox에 오신 것을 환영합니다!</p>
//           </div>

//           {/* 로그인 폼 */}
//           <div className="bg-white rounded-lg shadow-md p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* 이메일 */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   이메일
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
//                     errors.email ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="example@email.com"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//                 )}
//               </div>

//               {/* 비밀번호 */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   비밀번호
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
//                     errors.password ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="비밀번호를 입력하세요"
//                 />
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-500">{errors.password}</p>
//                 )}
//               </div>

//               {/* 로그인 유지 & 비밀번호 찾기 */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="rememberMe"
//                     name="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleChange}
//                     className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//                   />
//                   <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
//                     로그인 유지
//                   </label>
//                 </div>
//                 <button
//                   type="button"
//                   className="text-sm text-purple-600 hover:text-purple-700"
//                 >
//                   비밀번호 찾기
//                 </button>
//               </div>

//               {/* 로그인 버튼 */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
//                   isLoading
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : 'bg-purple-600 hover:bg-purple-700'
//                 }`}
//               >
//                 {isLoading ? '로그인 중...' : '로그인'}
//               </button>
//             </form>

//             {/* 회원가입 링크 */}
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 아직 계정이 없으신가요?{' '}
//                 <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
//                   회원가입
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />

//       {/* 모달 */}
//       <Modal
//         isOpen={showModal}
//         onClose={handleModalClose}
//         type={modalConfig.type}
//         title={modalConfig.title}
//         message={modalConfig.message}
//       />
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore'
import Header from '../Header';
import Footer from '../Footer';
import Modal from '../Modal';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 입력 시 해당 필드의 에러 제거
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Zustand 스토어의 login 액션 호출
      await login(formData.email, formData.password, formData.rememberMe);
      
      // 성공 모달 표시
      setModalConfig({
        type: 'success',
        title: '로그인 성공!',
        message: 'MovieBox에 오신 것을 환영합니다.',
      });
      setShowModal(true);
    } catch (error) {
      console.error('로그인 실패:', error);
      
      // 에러 모달 표시
      setModalConfig({
        type: 'error',
        title: '로그인 실패',
        message: error instanceof Error ? error.message : '이메일과 비밀번호를 확인해주세요.',
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    
    // 성공한 경우에만 홈으로 이동
    if (modalConfig.type === 'success') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header simple />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
            <p className="text-gray-600">MovieBox에 오신 것을 환영합니다!</p>
          </div>

          {/* 로그인 폼 */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="example@email.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* 로그인 유지 & 비밀번호 찾기 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                    로그인 유지
                  </label>
                </div>
                <button
                  type="button"
                  disabled={isLoading}
                  className="text-sm text-purple-600 hover:text-purple-700 disabled:text-gray-400"
                >
                  비밀번호 찾기
                </button>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    로그인 중...
                  </span>
                ) : (
                  '로그인'
                )}
              </button>
            </form>

            {/* 회원가입 링크 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                아직 계정이 없으신가요?{' '}
                <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                  회원가입
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

export default LoginPage;