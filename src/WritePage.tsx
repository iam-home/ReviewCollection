import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { checkLogin } from './supabaseClient.ts';



function WritePage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState<number>();
  const [content, setContent] = useState('');
  // const [selectedPoster, SetSelectedPoster] = useState('');

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
      {/* <h1>글쓰기</h1> */}
      <PosterSVG/> {/* 얘가 가장 왼쪽으로 가게 css 짜야됨 */}
      <Title/>

      <textarea placeholder='별점 입력하셈' value={ rating } onChange={(e)=> setRating(e.target.value) } />
      <textarea placeholder="내용을 입력하세요..." value={ content } onChange={(e)=> setContent(e.target.value) } rows={5} cols={40} />
      {/* <textarea placeholder='포스터 url' value={ selectedPoster } onChange={(e)=> SetSelectedPoster(e.target.value) } rows="{5}" cols="{40}" /> */}
      <br />

      <button onClick={() => { if (confirm("진짜 취소함?")) navigate('/', { replace: true }); }}>취소</button> {/* 이거 또 뒤로가기 불편함 */}
      <button onClick={async ()=>{ if ( await Post(isLogin, rating, content) ) navigate('/', { replace: true }); }}>등록</button>
      {/* 작게 안내창? toast?을 띄우든하셈. alert보다는 나을겨 */} {/* 되기는 되는데 등록 버튼 누르자마자 너무 갑자기 띡 넘어가니까 좀 어색함 */}

      {/* 로그인 유저면 User, 비로그인 유저면 NotUser */}
    </div>
  );
}

const Post = async (isLogin: boolean, rating: number, content: string) => {
  if (isLogin) { // 로그인 유저 디비

  }

  else { // 비로그인 유저 로컬스토리지
    interface NotUserPost {
      title: string;
      content: string;
      // createdAt: string;
    }
    const rawData = localStorage.getItem('NotUser_localStorage');
    const existingPosts: NotUserPost[] = rawData ? JSON.parse(rawData) : [];

    const newPost: GuestPost = {
      rating,
      content,
      // createdAt: new Date().toISOString(),
    };

    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem('NotUser_localStorage', JSON.stringify(updatedPosts));

    return true;
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

const Title = () => {
  return (
    <p>밑에 제목이랑 감독/저자 뭐 그런 거 띄우고 싶은데 이걸 컴포넌트로 나눠야되냐. SearchModal에서 아예 정보 다 빼서 파라미터로 넘기는 게 깔끔하려나 아니면 SearchModal에서 전부 다 처리를 하면 안되나</p>
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
