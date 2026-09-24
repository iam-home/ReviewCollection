import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('수파베이스 환경변수(URL 또는 ANON_KEY)가 세팅되지 않았습니다.');
}

export const client = createClient(supabaseUrl, supabaseKey);


export const checkLogin = async () => {
  try {
    const { data: { session }, error } = await client.auth.getSession();
    if (error) throw error;

    if (session) { // 로그인함
        return session;
    } else { // 로그인안함
        return false;
        }
  } catch (err: any) {
    console.error("error:", err.message);
    return false;
  }
}

// export const signOut = async () => {
//   const { error } = await client.auth.signOut();
//       if (error) console.error('Logout error:', error.message);
//       else {
//         location.reload();
//       }
// }

export const signInWithGoogle = async () => {
  const { error } = await client.auth.signInWithOAuth({ // data 있었는데 안 쓰는데 왜 만드냐고 경고 뜨길래 지움. 필요하면 만드셈
    provider: 'google',
    options: {
      // redirectTo: 'https://reviewcollection.pages.dev/',
      redirectTo: 'http://localhost:5173/',
      queryParams: {
        prompt: 'select_account',
        access_tpye: 'offline'
      }
    }
  });
  
  if (error) console.error('error:', error.message);
}


export const signInWithKakao = async () => {
  console.log("하는중");
}