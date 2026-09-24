import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      
        <h2>로그인</h2>

        {/* <p>아이디</p> */}
        <input type="text" placeholder="아이디"/>
        <br />

        {/* <p>비밀번호</p> */}
        <input type="password" placeholder="비밀번호"/>
        <br />

        <button onClick={()=>{ if (confirm('진짜 나감?')) navigate('/'); }}>안할래요</button>
        <button onClick={()=> { console.log('아직안되지롱'); navigate('/'); }}>로그인</button>

    </div>
  );
}

export default Login;
