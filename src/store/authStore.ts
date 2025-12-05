import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 사용자 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// 인증 상태 타입
interface AuthState {
  // 상태
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  
  // 액션
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Mock 사용자 데이터 (테스트용)
const mockUsers = [
  {
    id: '1',
    email: 'alice5855@naver.com',
    password: 'alice5855',
    name: '김혜준',
    avatar: 'https://picsum.photos/200/300​',
  },
  {
    id: '2',
    email: 'admin@moviebox.com',
    password: 'admin1234',
    name: '관리자',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: '3',
    email: 'user@test.com',
    password: '123456',
    name: '홍길동',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      isAuthenticated: false,
      rememberMe: false,

      // 로그인 액션
      login: async (email: string, password: string, rememberMe: boolean) => {
        // 로딩 시뮬레이션 (1초 대기)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 사용자 찾기
        const foundUser = mockUsers.find(
          u => u.email === email && u.password === password
        );

        if (!foundUser) {
          throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
        }

        // 비밀번호를 제외한 사용자 정보만 저장
        const { password: _, ...userWithoutPassword } = foundUser;

        set({
          user: userWithoutPassword,
          isAuthenticated: true,
          rememberMe,
        });
      },

      // 로그아웃 액션
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          rememberMe: false,
        });
      },

      // 사용자 정보 업데이트
      updateUser: (updatedUser: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updatedUser },
          });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      // rememberMe가 true일 때만 localStorage에 저장
      // false면 sessionStorage에 저장하도록 커스터마이징
      partialize: (state) => ({
        user: state.rememberMe ? state.user : null,
        isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
        rememberMe: state.rememberMe,
      }),
    }
  )
);