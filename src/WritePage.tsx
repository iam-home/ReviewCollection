import { useNavigate } from 'react-router-dom';

function WritePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>글쓰기</h1>
      <textarea placeholder="내용을 입력하세요..." rows={5} cols={40} /><br />
      
      {/* 글 작성을 취소하거나 완료하면 다시 메인으로 복귀 */}
      <button onClick={() => navigate('/')}>메인으로 돌아가기</button> {/* 이거 또 뒤로가기 불편함 */}
    </div>
  );
}

export default WritePage;
