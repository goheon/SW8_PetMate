import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SingUp from './pages/SingUp';
import Login from './pages/Login';
import Notfound from './pages/Notfound';
import Mypage from './pages/Mypage';
import PetSitterList from './pages/PetSitterList';
import PetSitterInfo from './pages/PetSitterInfo';
import Admin from './pages/Admin';

import './swal-popup.scss';
import './reset.css';
import Reservation from './components/mypage/Reservation';
import Account from './components/mypage/Account';
import Point from './components/mypage/Point';
import Review from './components/mypage/Review';
import JoinExpert from './components/mypage/JoinExpert';
import OrderView from './components/mypage/OrderView';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SingUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />}>
          <Route path="account" element={<Account />} />
          <Route path="review" element={<Review />} />
          <Route path="point" element={<Point />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="join-expert" element={<JoinExpert />} />
          <Route path="order-view/:id" element={<OrderView />} />
        </Route>
        <Route path="/pet-sitter" element={<PetSitterList />} />
        <Route path="/pet-sitter/:sitterId" element={<PetSitterInfo />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
