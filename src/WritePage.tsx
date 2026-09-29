import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { checkLogin } from './supabaseClient.ts';



function WritePage() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const loggedIn = await checkLogin();
      setIsLogin(!!loggedIn);
      setLoading(false);
    };
    fetchSession();
  }, []);
  
  if (loading) {
    return <div>로그인 정보 확인 중...</div>; 
  }

  return (
    <div>
      <PosterSVG/> {/* 얘가 가장 왼쪽으로 가게 css 짜야됨 */}
      {/* <h1>글쓰기</h1> */}
      <textarea placeholder="제목 입력" value={ title } onChange={(e)=> setTitle(e.target.value) } rows={5} cols={40} />
      <p>star review position here</p>
      <textarea placeholder="내용을 입력하세요..." value={ content } onChange={(e)=> setContent(e.target.value) } rows={5} cols={40} />
      <br />

      <button onClick={() => { if (confirm("진짜 취소함?")) navigate('/', { replace: true }); }}>취소</button> {/* 이거 또 뒤로가기 불편함 */}
      <button onClick={()=>{ Post(isLogin, title, content) }}>등록</button> {/* 작게 안내창? toast?을 띄우든하셈. alert보다는 나을겨 */} {/* navigate('/'); 이거 일단 뺐음 */}

      {/* 로그인 유저면 User, 비로그인 유저면 NotUser */}
    </div>
  );
}

const Post = async (isLogin: boolean, title: string, content: string) => {
  if (isLogin) { // 로그인 유저 디비
    alert("User");
    alert(title + content);
  }
  else { // 비로그인 유저 로컬스토리지
    const notUser = JSON.parse(localStorage.getItem('value')) || []; // what is value?
    notUser.unshift(title);
    notUser.unshift(content);
    localStorage.setItem('value', JSON.stringify(notUser));
  }
}

const PosterSVG = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
  <>
      { openModal && <SearchModal/> }

      <svg onClick={()=>{ setOpenModal(true); }}
        width="400"
        height="600"
        viewBox="0 0 400 600"
        xmlns="http://www.w3.org/2000/svg"
      >

        <rect
          x="10"
          y="10"
          width="380"
          height="580"
          rx="18"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />

        <g
          stroke="#6B7280"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line x1="200" y1="275" x2="200" y2="325" />
          <line x1="175" y1="300" x2="225" y2="300" />
        </g>
      </svg>
    </>
  )
}

const SearchModal = () => {
  const [searchPoster, setSearchPoster] = useState('');
  const TMDB_Key = import.meta.env.VITE_TMDB_Key;

  const TMDB = async (test: string) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_Key}&query=${test}&language=ko-KR`); // this's search. is this u want?
    const data = await response.json();
    // console.log(data); 
    alert(JSON.stringify(data));
  }

  return (
    <div>
      <input type="text" value={ searchPoster } onChange={(e) => setSearchPoster(e.target.value) } placeholder="원하는 작품 검색" />
      <button onClick={()=>{ TMDB(`${searchPoster}`); }}>save</button> {/* 그냥 검색만 하는 게 아니라 포스터를 불러오게 하고, 그 불러온 값을 PosterSVG에 대신 넣으면 될듯 */}
    </div>
  )
}

export default WritePage; {/* 제목 내용 하나라도 공백이면 빠꾸 잊지말자 */}
