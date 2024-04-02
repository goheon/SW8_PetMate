import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Notfound from './pages/Notfound';

import './swal-popup.scss';
import './reset.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
