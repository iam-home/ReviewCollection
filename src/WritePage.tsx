import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { checkLogin } from './supabaseClient.ts';
import { type DataProps } from './App.tsx';

function WritePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [rating, setRating] = useState<number>();
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [forAPI, setForAPI] = useState<DataProps | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const loggedIn = await checkLogin();
      setIsLogin(!!loggedIn);
      setLoading(false);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isEditMode) {
      const rawData = localStorage.getItem('NotUser_localStorage');
      if (rawData) {
        const posts: DataProps[] = JSON.parse(rawData);
        const targetPost = posts.find((p) => p.id === id);

        if (targetPost) {
          setSelectedSubject(targetPost.subject);
          setRating(targetPost.rating);
          setContent(targetPost.content);
          setDate(targetPost.date || '');
          setForAPI({
            id: targetPost.id,
            subject: targetPost.subject,
            images: targetPost.images,
            title: targetPost.title,
            creator: targetPost.creator,
            releaseDate: targetPost.releaseDate,
            rating: targetPost.rating,
            content: targetPost.content,
            date: targetPost.date,
          });
        }
      }
    }
  }, [id]);

  if (loading) {
    return <div className="no-cursor" style={{ textAlign: 'center', paddingTop: '100px' }}>로그인 정보 확인 중...</div>;
  }

  const handleRegister = async () => {
    if (!forAPI) {
      alert("작품을 검색해주세요.");
      return;
    }
    if (rating === undefined) {
      alert("별점을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (rating > 5) {
      alert("별점은 최대 5점입니다.");
      return;
    }

    const PostData: DataProps = {
      ...forAPI,
      id: isEditMode && id ? id : forAPI.id,
      rating: rating,
      content: content,
      date: date,
    };

    if (await Post(isLogin, PostData, isEditMode)) navigate('/', { replace: true });
  };

  return (
    <div className="no-cursor write-page">
      <button onClick={() => navigate('/', { replace: true })}>✕ 닫기</button>

      <div className="write-header">
        <p className="write-eyebrow">REVIEW COLLECTION</p>
        <h1>{isEditMode ? '기록 수정하기' : '새로운 기록 남기기'}</h1>
        <p>소중한 순간들을 기록하세요.</p>
      </div>

      <div className="write-form">
        {/* 카테고리 선택 */}
        <div className="form-section">
          <label className="form-label">카테고리</label>
          <div className='dropdown-container'>
            <button
              type="button"
              className='dropdown-btn'
              onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
            >
              {selectedSubject === 'movie' ? '영화' : selectedSubject === 'book' ? '도서' : '카테고리 선택'}
            </button>
            {isOpen &&
              <ul className='dropdown-menu'>
                <li><button type="button" onClick={() => {
                  setSelectedSubject('movie');
                  setIsOpen(false);
                  if (selectedSubject !== 'movie') setForAPI(null);
                }}>영화</button></li>
                <li><button type="button" onClick={() => {
                  setSelectedSubject('book');
                  setIsOpen(false);
                  if (selectedSubject !== 'book') setForAPI(null);
                }}>도서</button></li>
              </ul>
            }
          </div>
        </div>

        {/* 포스터 선택 영역 */}
        <div className="form-section media-picker-section">
          <label className="form-label">작품 표지 / 포스터</label>
          <PosterSVG
            isLogin={isLogin}
            selectedSubject={selectedSubject}
            forAPI={forAPI}
            setForAPI={setForAPI}
          />

          {forAPI && (
            <div className='selected-info'>
              <strong>{forAPI.title}</strong>
              <span>{forAPI.creator}</span>
            </div>
          )}
        </div>

        {/* 상세 입력 (별점 & 날짜) */}
        <div className="details-section">
          <div className="field-group">
            <label className="form-label">별점 (1 ~ 5)</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              placeholder='예: 4.5'
              value={rating ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setRating(val === '' ? undefined : Number(val));
              }}
            />
          </div>

          <div className="field-group">
            <label className="form-label">완독/관람 일자</label>
            <input
              type="date"
              value={date ?? ''}
              max={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
              onChange={(e) => {
                const val = e.target.value;
                setDate(val === '' ? '' : val);
              }}
            />
          </div>
        </div>

        {/* 내용 입력 */}
        <div className="form-section">
          <label className="form-label">감상평 및 메모</label>
          <textarea
            placeholder="작품에 대한 생각을 자유롭게 남겨주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 액션 버튼 */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => { if (confirm("작성을 취소하시겠습니까?")) navigate('/', { replace: true }); }}
          >
            취소
          </button>
          <button
            type="button"
            className="submit-btn"
            onClick={handleRegister}
          >
            {isEditMode ? '수정 완료' : '기록 등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

const Post = async (isLogin: boolean, PostData: DataProps, isEditMode: boolean) => {
  if (isLogin) {
    console.log("here's for db");
  }

  else {
    const rawData = localStorage.getItem('NotUser_localStorage');
    let existingPosts: DataProps[] = rawData ? JSON.parse(rawData) : [];
    if (!rawData && isEditMode) return;

    if (isEditMode) {
      existingPosts = existingPosts.map((post) => post.id === PostData.id ? PostData : post);
    } else {
      const isDuplicate = existingPosts.some((post) => post.id === PostData.id);
      if (isDuplicate) {
        existingPosts = existingPosts.map((post) => post.id === PostData.id ? PostData : post);
      } else {
        existingPosts = [PostData, ...existingPosts];
      }
    }

    localStorage.setItem('NotUser_localStorage', JSON.stringify(existingPosts));
    return true;
  }
};

const PosterSVG = ({
  isLogin,
  selectedSubject,
  forAPI,
  setForAPI
}: {
  isLogin: boolean,
  selectedSubject: string,
  forAPI: DataProps | null,
  setForAPI: React.Dispatch<React.SetStateAction<DataProps | null>>;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      {openModal && (
        <SearchModal
          isLogin={isLogin}
          selectedSubject={selectedSubject}
          onClose={() => setOpenModal(false)}
          onSelectMedia={(mediaData) => setForAPI(mediaData)}
        />
      )}

      <div
        className="poster-wrapper"
        onClick={() => {
          if (!selectedSubject) {
            alert("카테고리를 먼저 선택해주세요.");
            return;
          }
          setOpenModal(true);
        }}
      >
        {forAPI?.images ? (
          <img src={forAPI.images} alt={forAPI.title} width="160" height="230" className="poster-img" />
        ) : (
          <svg width="160" height="230" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg" className="poster-svg-box">
            <rect x="10" y="10" width="380" height="580" rx="18" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="8 8" />
            <g stroke="#6B7280" strokeWidth="3" strokeLinecap="round">
              <line x1="200" y1="275" x2="200" y2="325" />
              <line x1="175" y1="300" x2="225" y2="300" />
            </g>
          </svg>
        )}
      </div>
    </>
  );
}

const SearchModal = ({
  isLogin,
  selectedSubject,
  onClose,
  onSelectMedia,
}: {
  isLogin: boolean;
  selectedSubject: string;
  onClose: () => void;
  onSelectMedia: (mediaData: DataProps) => void;
}) => {
  const [value, setValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    setValue('');
    setSearchResults([]);
  }, [selectedSubject]);

  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
  const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY;

  const handleSearch = async () => {
    if (!value.trim()) return;

    if (selectedSubject === "movie") {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(value)}&language=ko-KR`);
      const data = await response.json();
      const movieResults = data.results || [];

      const moviesWithCredits = await Promise.all(
        movieResults.map(async (movie: any) => {
          try {
            const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_KEY}&language=ko-KR&append_to_response=credits`);
            const detailData = await detailRes.json();
            return { ...movie, crew: detailData.credits?.crew || [] };
          } catch (error) {
            return movie;
          }
        })
      );

      setSearchResults(moviesWithCredits);
    } else if (selectedSubject === "book") {
      const response = await fetch(`https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(value)}`, {
        method: 'GET',
        headers: { 'Authorization': `KakaoAK ${KAKAO_KEY}` }
      });
      const data = await response.json();
      setSearchResults(data.documents || []);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-search-row">
          <input
            type="text"
            className="modal-search-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={selectedSubject === 'movie' ? "영화 제목을 검색하세요" : "도서 제목을 검색하세요"}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="submit-btn">검색</button>
        </div>

        <div className="modal-results-list">
          {isLogin ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>For Login User</p>
          ) : (
            searchResults.map((item, index) => {
              const id = selectedSubject === 'movie' ? String(item.id) : item.isbn;
              const title = item.title;
              const images = selectedSubject === 'movie' ? (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '') : item.thumbnail;
              const creator = selectedSubject === 'movie'
                ? (item?.crew?.find((member: { job: string; name: string; }) => member.job === 'Director')?.name || '감독 미상')
                : (item.authors && item.authors.length > 0 ? item.authors.join(', ') : '저자 미상');
              const releaseDate = selectedSubject === 'movie' ? (item.release_date) : (item.datetime ? item.datetime.substr(0, 10) : '출판일 미상');

              return (
                <div
                  key={index}
                  className="modal-result-item"
                  onClick={() => {
                    onSelectMedia({
                      id: id,
                      subject: selectedSubject,
                      images: images,
                      title: title,
                      releaseDate: releaseDate,
                      creator: creator,
                      rating: 0,
                      content: '',
                      date: '',
                    });
                    onClose();
                  }}
                >
                  <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{title}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{releaseDate}</span>
                </div>
              );
            })
          )}
        </div>

        <button onClick={onClose} className="cancel-btn" style={{ width: '100%', marginTop: '8px' }}>닫기</button>
      </div>
    </div>
  );
};

export default WritePage;
