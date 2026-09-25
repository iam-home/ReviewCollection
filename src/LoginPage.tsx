import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithKakao } from './supabaseClient.ts';

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      
        <h2>로그인</h2>

        <button onClick={ signInWithGoogle }>구글 로그인</button>
        <button onClick={ signInWithKakao }>카카오 로그인</button>
        {/* 아이콘도 넣으면 이쁠 거 같음 */}
        <br />

        {/* 비밀번호 찾기 */}
        {/* 최근에 사용한 수단 */}

        <button onClick={()=>{ if (confirm('진짜 나감?')) navigate('/'); }}>안할래요</button>

    </div>
  );
}

export default Login;
