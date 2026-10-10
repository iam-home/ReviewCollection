// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage.tsx';
import WritePage from './WritePage.tsx';
import Detail from './Detail.tsx';
import Login from './LoginPage.tsx';

import './App.css'

export interface DataProps {
  id: string,
  subject: string,
  images: string,
  title: string,
  releaseDate: string,
  creator: string,
  rating: number,
  content: string,
  date: string,
  // createdAt: string; // createdAt: new Date().toISOString(),
  // 주제, 표지, 작품 이름, 작가/감독, 별점, 내용
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/write" element={<WritePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/detail/:id" element={<Detail />} />
    </Routes>
  );
}

export default App
