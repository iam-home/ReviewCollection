import { useNavigate } from 'react-router-dom';

function WritePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* <h1>글쓰기</h1> */}
      
      <p>여기는 점선 땡땡 네모박스 포스터자리 | 여기는 별점 자리</p> {/* 사이즈 다르게 할 거니까 둘이 나눠야됨. 지금은 보기 쉽게 하려고 이렇게 둔거임 */}
      <textarea placeholder="제목 입력" rows={5} cols={40} />
      <textarea placeholder="내용을 입력하세요..." rows={5} cols={40} />
      <br />

      <button onClick={() => { if (confirm("진짜 취소함?")) navigate('/'); }}>취소</button> {/* 이거 또 뒤로가기 불편함 */}
      <button onClick={()=>{ console.log('아직안되지롱'); navigate('/'); }}>등록</button> {/* 작게 안내창? toast?을 띄우든하셈. alert보다는 나을겨 */}
    </div>
  );
}

export default WritePage;
