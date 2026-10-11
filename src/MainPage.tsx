import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { client, checkLogin } from './supabaseClient.ts';
import { type DataProps } from './App.tsx';

function MainPage() {
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // const [subject, SetSubject] = useState('');
  // const [toggleFriendModal, setToggleFriendModal] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await checkLogin();
      setSession(currentSession);
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading) {
    return <div>로그인 정보 확인 중...</div>;
  }

  // const loginText = session?.user ? "마이페이지? 로그아웃? 다크모드? 설정?" : "로그인하셈";

  const Logout = async () => {
    const { error } = await client.auth.signOut();
    if (!error) {
      setSession(null);
    }
  };

  return (
    <div className='no-cursor'> {/* 지금은 글 쓰는 것들이 MainPage 함수 밖에 있거나 아예 다른 파일이라 문제는 없는데 혹시 이 함수 안에서 글을 써야되는 일이 생기면 이거 빼야됨. 아닌가 안 빼도 글 쓸 수 있나 정확하지 않음 */}
      <button onClick={Logout}>일단 로그아웃</button>
      <header className="navbar-header">
        <div className="logo">ReviewCollection</div>
        {/* 프로토타입 이름 */}
        <nav>
          <ul className="nav-links">
            {/* <li><a onClick={() => { setToggleFriendModal(true); }}>친구</a></li> */}
            {/* {toggleFriendModal && <FriendModal />} */}
            {/* 닫는 거는 삭제 버튼 하나 만드셈 */}

            <li><a onClick={() => setIsSearch(!isSearch)}>{isSearch ? "검색" : "검색"}</a></li>
            {session?.user
              ? <li><a onClick={() => { session?.user && console.log("유저 있으면 dropdown 메뉴 만들어서 로그아웃, 유저페이지 뭐 그런 거 띄우게 하셈"); }}>{session.user.email}의 라이브러리</a></li>
              : <li><a onClick={() => { !session?.user && navigate('/login'); }}> (여기는 형광펜이나 포스트잇 같은 거로 가려둔 거처럼)의 라이브러리</a></li>
            }
            {/* @gmail.com 까지 나오는 거 너무 길어. 아이디를 정하게 하든가, 아니면 닉네임만 뜨게 하든가 */}

            {/* <li><a onClick={()=>{ session?.user ? console.log("멍청이") : navigate('/login'); }}>{ loginText }</a></li> */}
          </ul>
        </nav>
      </header>

      {isSearch && <Search />}

      <div className='ctrl'>
        {/* <div className="dropdown-container"> */}
        {/*   <p id='filter-text' className="dropdown-btn" onClick={() => { setIsOpen(!isOpen) }}>필터</p> */}
        {/* 다른 곳 눌렀을 때 메뉴 안 없어짐. 없어지게 하셈. lostnfound 위치 선택하는 거기에 이거 있지않냐 */}
        {/* {isOpen && ( */}
        {/*   <ul className="dropdown-menu"> */}
        {/*     <li><a onClick={() => { console.log("영화만 모아서 보여주기"); setIsOpen(false); }}>영화</a></li> */}
        {/*     <li><a onClick={() => { console.log("책만 모아서 보여주기"); setIsOpen(false); }}>책</a></li> */}
        {/* <li><a onClick={()=>{ console.log("음악만 모아서 보여주기"); setIsOpen(false); }}>음악</a></li> */}
        {/*     </ul> */}
        {/*   )} */}
        {/* </div> */}

        <button className="write-btn" onClick={() => { navigate('/write') }}>글쓰기</button>
      </div>

      {session ? <User /> : <NotUser />}

      {/* 색은 질감처리된 초록? 굳이 초록일 필요는 없는데 질감 처리는 있는 게 좋을듯 싶음. 단색이면 심심하잖음 */}

    </div>
  );
}

const Search = () => <textarea placeholder="찾고 싶은 작품 검색" />

const User = () => {
  return (
    <div className='card'> {/* 책자? 책꽂이? */}
      <p className='book-card'>여기는 api 연결해서 포스터 / 책표지 띄울듯</p>
      <p className='book-card'>test</p>
      <p className='book-card'>test2</p>
    </div>

  )
}

const NotUser = () => {
  const navigate = useNavigate();
  // const [savedData, setSavedDate] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [posts, setPosts] = useState<DataProps[]>(() => {
    const rawData = localStorage.getItem('NotUser_localStorage');
    return rawData ? JSON.parse(rawData) : [];
  });

  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenDropdownId(null);
    };

    if (openDropdownId !== null) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [openDropdownId]);

  // useEffect(() => {
  //   const data = localStorage.getItem('NotUser_localStorage');
  //   if (data) {
  //     const parsedData = JSON.parse(data);
  //     setSavedDate(parsedData);
  //     console.log(JSON.stringify(parsedData));
  //   }
  //   else setSavedDate('저장된 데이터가 없습니다.');
  // }, []);

  // for (let i: number = 0; i < posts.length; i++) {
  //   console.log(posts[i]);
  // }

  if (posts.length === 0) {
    return (
      <p>작품을 검색해서 추가해보세요.</p>
    )
  }

  return (
    <div className='main-container'>
      {/* <svg xmlns="http://w3.org" viewBox="0 0 400 300" width="100%" height="100%"> */}
      {/*   <rect width="400" height="300" rx="16" fill="#F3F4F6" /> */}
      {/**/}
      {/*   <g fill="none" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"> */}
      {/*     <rect x="120" y="80" width="160" height="120" rx="12" /> */}
      {/*     <polygon points="185,115 185,165 225,140" fill="#9CA3AF" /> */}
      {/*   </g> */}
      {/**/}
      {/*   <text x="200" y="240" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="500" fill="#9CA3AF" textAnchor="middle">No Media Available</text> */}
      {/* </svg> */}

      {/* <svg xmlns="http://w3.org" viewBox="0 0 400 300" width="100%" height="100%"> */}
      {/*   <rect width="400" height="300" rx="16" fill="#F3F4F6" /> */}
      {/*   <g fill="none" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"> */}
      {/*     <path d="M200,180 C170,150 140,150 110,150 L110,90 C140,90 170,90 200,120 Z" /> */}
      {/*     <path d="M200,180 C230,150 260,150 290,150 L290,90 C260,90 230,90 200,120 Z" /> */}
      {/*     <path d="M200,120 L200,195 L208,187 L216,195 L216,133" fill="#9CA3AF" stroke="none" /> */}
      {/*   </g> */}
      {/*   <text x="200" y="230" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="500" fill="#9CA3AF" textAnchor="middle">No Image Available</text> */}
      {/* </svg> */}

      <div className='media-grid'>
        {posts.map((item: DataProps, index: number) => {
          const isMenuOpen = openDropdownId === item.id;

          return (
            <div key={index} className="media-card" onClick={() => { navigate(`/detail/${item.id}`) }} style={{ cursor: 'pointer' }}>

              {/* 상단 */}
              <div className="image-wrapper">
                {item.images ? (
                  <img src={item.images} alt={item.title} className="media-image" />
                ) : (
                  <div className="no-image">No Image</div>
                )} {/* selectedSubject로 영화인지 책인지 */}
              </div>

              {/* 하단 */}
              <div className="info-wrapper">
                <span className='menu-btn' onClick={(e) => { e.stopPropagation(); }}>
                  <div className="dropdown-container">
                    <p id='filter-text' className="dropdown-btn" onClick={() => { setOpenDropdownId(isMenuOpen ? null : item.id) }}>⋮</p>
                    {isMenuOpen && (
                      <ul className="dropdown-menu">
                        <li><a onClick={() => { navigate(`/write/${item.id}`)
                          setOpenDropdownId(null);

                          
                        }}>수정</a></li>



                        <li><a onClick={() => {
                          if (!confirm(`${item.title} 기록을 정말 삭제하시겠습니까?`)) return;

                          const rawData = localStorage.getItem('NotUser_localStorage');
                          if (!rawData) return;

                          const existingPosts: DataProps[] = JSON.parse(rawData);
                          const updatedPosts = existingPosts.filter((post) => post.id !== item.id);

                          localStorage.setItem('NotUser_localStorage', JSON.stringify(updatedPosts));
                          setPosts(updatedPosts);

                          setOpenDropdownId(null);

                        }} style={{ color: 'orange' }}>삭제</a></li>
                      </ul>
                    )}
                  </div>
                </span>

                <h3 className="media-title">{item.title}</h3>
                <p className="media-creator">{item.creator}</p>
                {item.releaseDate && <span className="media-date">{item.releaseDate}</span>}
              </div>

            </div>
          );
        })}
      </div>

      {/* {JSON.stringify(savedData)} */}
      {/* {JSON.stringify(posts)} 엥 posts로 해도 되는데 */}

    </div>
  );
};

// const FriendModal = () => {
//   return (
//     <div> {/* style={{ position:"absolute" }} */}
//       <input type="text" placeholder="친구창을 하나 띄우고 거기에 친구 목록 만들고, 친구 추가 버튼도 만들자." />
//     </div>
//   )
// }

export default MainPage;
