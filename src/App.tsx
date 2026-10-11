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
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/write/:id?" element={<WritePage />} />
        {/* write, write/:id 로 나누든가 아니면 write/:id?로 하셈*/}
        
        <Route path="/login" element={<Login />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>

      <Citation/>
    </>
  );
}

const Citation = () => {
  return (
    <footer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
        <img src="https://www.themoviedb.org/assets/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
        alt='TMDB 공식 로고'
        style={{ height: '20px', width: 'auto', display: 'block'}} />
      </a>
      <p style={{ fontSize: '15px', color: '#343f43', margin: '0' }}>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </footer>
  )
}

export default App
