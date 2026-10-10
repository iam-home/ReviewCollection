import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { checkLogin } from './supabaseClient.ts';
import { type DataProps } from './App.tsx';

function WritePage() {
  const navigate = useNavigate();
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
    setForAPI(null);
  }, [selectedSubject]);

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


  if (loading) {
    return <div>로그인 정보 확인 중...</div>;
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

    const PostData: DataProps = {
      ...forAPI,
      rating: rating,
      content: content,
      date: date,
    };

    if (await Post(isLogin, PostData)) navigate('/', { replace: true });
    // await Post(isLogin, PostData);
  };

  return (
    <div>
      {/* <h1>글쓰기</h1> */}
      <div className='dropdown-container'>
        <p className='dropdown-btn' onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}>{selectedSubject || '영화 / 도서 선택'}</p>
        {isOpen &&
          <ul className='dropdown-menu'>
            <li><a onClick={() => { setSelectedSubject('movie'); setIsOpen(false); }}>movies</a></li>
            <li><a onClick={() => { setSelectedSubject('book'); setIsOpen(false); }}>books</a></li>
            {/* <li><a onClick={()=>{ setSelectedSubject('music'); setIsOpen(false); }}>musics</a></li> */}
          </ul>
        }
      </div>

      <PosterSVG
        selectedSubject={selectedSubject}
        forAPI={forAPI}
        setForAPI={setForAPI}
      />

      {forAPI && (
        <div className='selected-info'>
          <strong>{forAPI.title}</strong> {forAPI.creator}
        </div>
      )}

      <input type="number"
        min="1" max="5" step="0.5"
        placeholder='별점 입력하셈'
        value={rating ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          setRating(val === '' ? undefined : Number(val));
        }} />

      <input type="date"
        placeholder='완독 날짜를 입력하세요.'
        value={date ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          setDate(val === '' ? '' : val);
        }} />

      <textarea placeholder="내용을 입력하세요..." value={content} onChange={(e) => setContent(e.target.value)} rows={5} cols={40} />
      <br />

      <button onClick={() => { if (confirm("진짜 취소함?")) navigate('/', { replace: true }); }}>취소</button> {/* 이거 또 뒤로가기 불편함 */}
      <button onClick={handleRegister}>등록</button>
      {/* 작게 안내창? toast?을 띄우든하셈. alert보다는 나을겨 */} {/* 되기는 되는데 등록 버튼 누르자마자 너무 갑자기 띡 넘어가니까 좀 어색함 */}

      {/* 로그인 유저면 User, 비로그인 유저면 NotUser */}
    </div>
  );
}


const Post = async (isLogin: boolean, PostData: DataProps) => {
  if (isLogin) { // 로그인 유저 디비

  }

  else { // 비로그인 유저 로컬스토리지
    const rawData = localStorage.getItem('NotUser_localStorage');

    // const existingPosts: NotUserPost[] = rawData ? JSON.parse(rawData) : [];
    let existingPosts: DataProps[] = [];
    if (rawData) {
      try {
        existingPosts = Array.isArray(JSON.parse(rawData)) ? JSON.parse(rawData) : [];
      } catch (error) {
        console.error(error);
        existingPosts = [];
      }
    }

    const updatedPosts = [PostData, ...existingPosts];
    localStorage.setItem('NotUser_localStorage', JSON.stringify(updatedPosts));

    // console.log(JSON.stringify(updatedPosts))
    return true;
  }
};

const PosterSVG = ({
  selectedSubject,
  forAPI,
  setForAPI
}: {
  selectedSubject: string,
  forAPI: DataProps | null,
  setForAPI: React.Dispatch<React.SetStateAction<DataProps | null>>;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      {openModal && (
        <SearchModal selectedSubject={selectedSubject}
          onClose={() => setOpenModal(false)}
          onSelectMedia={(mediaData) => setForAPI(mediaData)}
        />
      )}

      <div onClick={() => {
        if (!selectedSubject) {
          alert("카테고리를 먼저 선택해주세요.");
          return;
        }
        setOpenModal(true);
      }} style={{ cursor: 'pointer', display: 'inline-block' }} >
        {forAPI?.images ? (
          <img src={forAPI.images} alt={forAPI.title} width="200" height="300" style={{ borderRadius: '12px' }} />
        ) : (
          <svg width="200" height="300" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="380" height="580" rx="18" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="8 8" />
            <g stroke="#6B7280" strokeWidth="3" strokeLinecap="round">
              <line x1="200" y1="275" x2="200" y2="325" />
              <line x1="175" y1="300" x2="225" y2="300" />
            </g>
          </svg>
        )}
      </div>
    </>
  )
}

const SearchModal = ({
  selectedSubject,
  onClose,
  onSelectMedia,
}: {
  selectedSubject: string;
  onClose: () => void;
  onSelectMedia: (mediaData: DataProps) => void;
}) => {
  // const fucked: boolean = true;
  const [value, setValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    setValue('');
    setSearchResults([]);
  }, [selectedSubject]);

  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
  const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY;
  // const () = import.meta.env.VITE_();

  const handleSearch = async () => {
    if (!value.trim()) return;

    if (selectedSubject === "movie") {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(value)}&language=ko-KR`);
      const data = await response.json();
      // setSearchResults(data.results || []);
      // console.log(JSON.stringify(data));
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
    }


    else if (selectedSubject === "book") {
      const response = await fetch(`https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(value)}`,
        {
          method: 'GET',
          headers: { 'Authorization': `KakaoAK ${KAKAO_KEY}` }
        });
      const data = await response.json();
      setSearchResults(data.documents || []);
      // console.log(JSON.stringify(data));
    }

    // else if (selectedSubject === "music") {
    //   // alert(selectedSubject + value);

    //   // const response = await fetch(``)
    //   // const data = await response.json();
    //   // setSearchResults(data.results || []);
    //   // console.log(JSON.stringify(data));
    // }

  }

  return (
    <div className="modal-background" style={{ border: '1px solid black', padding: '10px', background: '#fff' }}>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="원하는 작품 검색" />
      <button onClick={handleSearch}>확인</button>

      <div className="results-list" style={{ marginTop: '10px' }}>
        {searchResults.map((item, index) => {
          const id = selectedSubject === 'movie' ? String(item.id) : item.isbn;
          const title = item.title;
          const images = selectedSubject === 'movie' ? (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '') : item.thumbnail;
          const creator = selectedSubject === 'movie'
            ? (item?.crew?.find((member: { job: string; name: string; }) => member.job === 'Director')?.name || '감독 미상')
            : (item.authors && item.authors.length > 0 ? item.authors.join(', ') : '저자 미상');
          const releaseDate = selectedSubject === 'movie' ? (item.release_date) : (item.datetime ? item.datetime.substr(0, 10) : '출판일 미상');
          {/* const date = selectedSubject === 'movie' ? item.date : item.date; */ }

          {/* 영화로 검색해둔 다음에 책으로 바꾸면 이상해짐. 기능상 오류는 없는데 그냥 기분나빠짐. 반대 경우도 똑같음 */ }
          {/*  검색창에도 작게 표지 띄우셈*/ }

          return (
            <div
              key={index}
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
              style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            >
              <strong>{title}</strong> ({releaseDate})
            </div>
          );
        })}
      </div>
      <button onClick={onClose}>닫기</button>
    </div> // 로컬스토리지든 디비든 표지 저장하고 -> 메인 페이지에 띄우게 하기
  );
};

export default WritePage;
