import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 예매 정보 타입
export interface Booking {
  id: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  theater: string;
  theaterLocation: string;
  date: string;
  time: string;
  seats: string[];
  peopleCount: number;
  totalPrice: number;
  status: '예매 완료' | '관람 완료' | '취소됨';
  bookedAt: string;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'bookedAt' | 'status'>) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingById: (bookingId: string) => Booking | undefined;
  getUserBookings: () => Booking[];
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],

      // 예매 추가
      addBooking: (booking) => {
        const newBooking: Booking = {
          ...booking,
          id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bookedAt: new Date().toISOString(),
          status: '예매 완료',
        };

        set((state) => ({
          bookings: [newBooking, ...state.bookings],
        }));
      },

      // 예매 취소
      cancelBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: '취소됨' as const }
              : booking
          ),
        }));
      },

      // ID로 예매 조회
      getBookingById: (bookingId) => {
        return get().bookings.find((booking) => booking.id === bookingId);
      },

      // 사용자의 모든 예매 조회
      getUserBookings: () => {
        return get().bookings;
      },
    }),
    {
      name: 'booking-storage',
    }
  )
);