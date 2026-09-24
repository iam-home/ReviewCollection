import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
// import { supabase } from './supabaseClient';

function MainPage() {
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='no-cursor'> {/* 지금은 글 쓰는 것들이 MainPage 함수 밖에 있거나 아예 다른 파일이라 문제는 없는데 혹시 이 함수 안에서 글을 써야되는 일이 생기면 이거 빼야됨. 아닌가 안 빼도 글 쓸 수 있나 정확하지 않음 */}
<p>a</p>
        <header className="navbar-header">
            <div className="logo">로고? 아이콘? 이름?</div>
            <nav>

                <p>누구누구의 라이브러리</p> {/* 이거 어떡함 */}

                <ul className="nav-links">
                <li><a onClick={()=> setIsSearch(!isSearch) }>{isSearch ? "검색" : "검색"}</a></li> {/* 텍스트 선택? 이거 안 뜨게 하고 싶은데 */}
                <li><a href="/login">로그인</a></li>
                </ul>
            </nav>
        </header>

        { isSearch && <Search/> }

        <div className='ctrl'>
            <div className="dropdown-container">
                <p id='filter-text' className="dropdown-btn" onClick={()=>{ setIsOpen(!isOpen) }}>필터</p>
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