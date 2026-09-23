import { useState } from 'react'
import './App.css'
function App() {

  //



  return ( // react why fun. JS is bruh
    <div className='App'>


      <header> {/* 여기는 일자로 */}
        <div>icon / logo</div>
        <div>here's (user)'s library.</div>
        <div>search button && box</div>
        <span onClick={()=>{ document.write("it whill be login button") }}>로그인 버튼</span>
      </header>
      <br/>

      <p>영화 / 책 모아보기? 필터임.</p> {/* align left */}
      <p>글쓰기 버튼</p> {/* a bit lower, align right */}
      <br/>

      <div> {/* 책자? 책꽂이? */}
        여기는 api 연결해서 포스터 / 책표지 띄울듯
      </div>

      {/* 색은 질감처리된 초록? 굳이 초록일 필요는 없는데 질감 처리는 있는 게 좋을듯 싶음. 단색이면 심심하잖음 */}


    </div>
  );
}
export default App
