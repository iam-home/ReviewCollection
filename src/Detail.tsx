import { useParams, useNavigate } from 'react-router-dom';
import { type DataProps } from './App.tsx';

function Detail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const subjectLabels: Record<string, string> = {
    movie: '영화 관람일',
    book: '완독일',
  };

  const rawData = localStorage.getItem('NotUser_localStorage');
  const posts: DataProps[] = rawData ? JSON.parse(rawData) : [];
  const currentPost = posts.find((item) => item.id === id);

  if (!currentPost) {
    return (
      <div className="no-cursor detail-not-found">
        <p>존재하지 않는 기록입니다.</p>
        <button className="submit-btn" onClick={() => { navigate('/', { replace: true }) }}>
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="no-cursor detail-page">
      <div className="detail-top-bar">
        <button className="cancel-btn" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
      </div>

      <div className="detail-container">
        <div className="detail-poster-wrapper">
          {currentPost.images ? (
            <img src={currentPost.images} alt={currentPost.title} className="detail-poster-img" />
          ) : (
            <div className="detail-no-image">No Images</div>
          )}
        </div>

        <div className="detail-content-wrapper">
          <div className="detail-header-info">
            <span className="detail-subject-badge">
              {currentPost.subject === 'movie' ? 'MOVIE' : 'BOOK'}
            </span>
            <h1 className="detail-title">{currentPost.title}</h1>
            <p className="detail-creator">{currentPost.creator}</p>
          </div>

          <div className="detail-meta-box">
            <div className="detail-meta-item">
              <span className="meta-label">별점</span>
              <span className="meta-value">⭐ {currentPost.rating} / 5.0</span>
            </div>
            {currentPost.date && (
              <div className="detail-meta-item">
                <span className="meta-label">{subjectLabels[currentPost.subject] || '기록일'}</span>
                <span className="meta-value">{currentPost.date}</span>
              </div>
            )}
            {currentPost.releaseDate && (
              <div className="detail-meta-item">
                <span className="meta-label">개봉/출판일</span>
                <span className="meta-value">{currentPost.releaseDate}</span>
              </div>
            )}
          </div>

          <div className="detail-review-section">
            <h3 className="review-heading">감상평 및 메모</h3>
            <div className="review-box">
              <p>{currentPost.content || '작성된 감상평이 없습니다.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
