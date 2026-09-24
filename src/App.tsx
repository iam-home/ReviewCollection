// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage.tsx';
import WritePage from './WritePage.tsx';
import Login from './Login.tsx';

import './App.css'
function App() {

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/write" element={<WritePage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App
