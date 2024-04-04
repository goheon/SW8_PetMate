import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Notfound from './pages/Notfound';
import PetSitterInfo from './pages/PetSitterInfo';
import './reset.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 경로 수정 필요path: pet-sitter-list/:id */}
        <Route path="/pet" element={<PetSitterInfo />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
