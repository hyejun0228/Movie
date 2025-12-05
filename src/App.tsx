import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import MovieDetailPage from './components/MovieDetailPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import BookingPage from './components/BookingPage';
import EventPage from './components/EventPage';
import MyPage from './components/Mypage';
import TheatersPage from './components/TheaterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/theaters" element={<TheatersPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
