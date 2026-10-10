import { useParams, useNavigate } from 'react-router-dom';
import { type DataProps } from './App.tsx';
// import { useEffect, useState } from 'react'

function Detail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const subjectLabels: Record<string, string> = {
    movie: '영화를 다 본 날짜',
    book: '책을 다 읽은 날짜',
    // music: '음악을 들은 날짜',
  }

  const rawData = localStorage.getItem('NotUser_localStorage');
  const posts: DataProps[] = rawData ? JSON.parse(rawData) : [];

  const currentPost = posts.find((item) => item.id === id);

  if (!currentPost) {
    return (
      <div>
        <p>존재하지 않는 글입니다.</p>
        <button onClick={() => { navigate('/', { replace: true }) }}>메인으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)}>뒤로가기</button>

      <h2>{currentPost.title}</h2>
      <p><strong>작가/감독:</strong> {currentPost.creator}</p>
      <p><strong>별점:</strong> ⭐ {currentPost.rating}</p>
      <p><strong>{subjectLabels[currentPost.subject]}:</strong> {currentPost.date}</p>
      <p><strong>감상평:</strong> {currentPost.content}</p>
    </div>
  )
}

export default Detail;
