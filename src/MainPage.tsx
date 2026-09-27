import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { client, checkLogin } from './supabaseClient.ts';

function MainPage() {
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
<button onClick={ Logout }>일단 로그아웃</button>
        <header className="navbar-header">
            <div className="logo">ReviewCollection</div>
            {/* 프로토타입 이름 */}
            <nav>
                <ul className="nav-links">
                <li><a onClick={()=> setIsSearch(!isSearch) }>{isSearch ? "검색" : "검색"}</a></li>
                { session?.user
                ? <li><a onClick={()=>{ session?.user && console.log("유저 있으면 dropdown 메뉴 만들어서 로그아웃, 유저페이지 뭐 그런 거 띄우게 하셈"); }}>{ session.user.email }의 라이브러리</a></li>
                : <li><a onClick={()=>{ !session?.user && navigate('/login'); }}> (여기는 형광펜이나 포스트잇 같은 거로 가려둔 거처럼)의 라이브러리</a></li>
                }
                {/* @gmail.com 까지 나오는 거 너무 길어. 아이디를 정하게 하든가, 아니면 닉네임만 뜨게 하든가 */}

                {/* <li><a onClick={()=>{ session?.user ? console.log("멍청이") : navigate('/login'); }}>{ loginText }</a></li> */}
                </ul>
            </nav>
        </header>

        { isSearch && <Search/> }

        <div className='ctrl'>
            <div className="dropdown-container">
                <p id='filter-text' className="dropdown-btn" onClick={()=>{ setIsOpen(!isOpen) }}>필터</p>
                {/* 다른 곳 눌렀을 때 메뉴 안 없어짐. 없어지게 하셈. lostnfound 위치 선택하는 거기에 이거 있지않냐 */}
                {isOpen && (
                    <ul className="dropdown-menu">
                        <li><a onClick={()=>{ console.log("영화만 모아서 보여주기"); setIsOpen(false); }}>영화</a></li>
                        <li><a onClick={()=>{ console.log("책만 모아서 보여주기"); setIsOpen(false); }}>책</a></li>
                    </ul>
                )}
            </div>

            <button className="write-btn" onClick={()=>{ navigate('/write') }}>🔎 글쓰기</button>
        </div>

        <div className='card'> {/* 책자? 책꽂이? */}
            <p className='book-card'>여기는 api 연결해서 포스터 / 책표지 띄울듯</p>
            <p className='book-card'>test</p>
            <p className='book-card'>test2</p>
        </div>

        {/* 색은 질감처리된 초록? 굳이 초록일 필요는 없는데 질감 처리는 있는 게 좋을듯 싶음. 단색이면 심심하잖음 */}

    </div>
  );
}

const Search = () => <textarea placeholder="찾고 싶은 작품 검색"/>

export default MainPage;
