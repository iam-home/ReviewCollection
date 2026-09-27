import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { signInWithGoogle, signInWithKakao, signInWithEmail, signUpWithEmail } from './supabaseClient.ts';

function Login() {
  const navigate = useNavigate();
  const [signUp, setSignUp] = useState(false);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (whatUWant: boolean) => { // true: Sign In, false: Sign Up
    const fullEmail = nickname.includes('@') ? nickname : `${nickname}@gmail.com`;
    let isSuccess: boolean = false;
    // 둘 중 하나 이상이 공백이면 빠꾸
    if (whatUWant) { // Sign In
      isSuccess = await signInWithEmail(fullEmail, password);
    }
    else if (!whatUWant) { // Sign Up
      isSuccess = await signUpWithEmail(fullEmail, password);
    }

    if (isSuccess) navigate('/', { replace: true })
  };


  return (
    <div>
      
      { !signUp ? <h2>로그인</h2>
      : <>
        <h2>회원가입</h2>
        <p>알아두기: 비밀번호 찾기 못함</p> {/* 이거를 그 동그라미 안에 느낌표 있는 거 있잖음 그거 눌렀을 때 보이게 하자 */}
      </>
      }

        { !signUp &&
        <>
          <button onClick={ signInWithGoogle }>구글 로그인</button><br />
          <button onClick={ signInWithKakao }>카카오 로그인</button>
          {/* 아이콘도 넣으면 이쁠 거 같음 */}
          <p>-------------또는-------------</p>
        </>
        }
        
        <input type="text" placeholder="아이디" value={ nickname } onChange={(e) => setNickname(e.target.value)}/><br />
        <input type="password" placeholder="비밀번호" value={ password } onChange={(e) => setPassword(e.target.value)}/><br />

        { !signUp ?
          <p>계정이 없냐? <a className='no-cursur' onClick={()=>{ setSignUp(true); }} style={{ cursor: 'pointer', color: 'blue' }}>회원가입</a></p>
          : <p>마음이 바뀌었어요 <a className='no-cursur' onClick={()=>{ setSignUp(false); }} style={{ cursor: 'pointer', color: 'blue' }}>로그인</a></p>
        }
        
        <button onClick={()=>{ if (confirm('진짜 나감?')) navigate('/'); }}>안할래요</button>
        { !signUp ? <button onClick={()=>{ handleLogin(true) }}>로그인</button> : <button onClick={()=>{ handleLogin(false) }} >회원가입</button> }


        {/* 비밀번호 찾기 */}
        {/* 최근에 사용한 수단 */}


    </div>
  );
}

export default Login;
