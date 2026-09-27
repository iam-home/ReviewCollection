import { createClient } from '@supabase/supabase-js';
// import { href } from 'react-router-dom';

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
      redirectTo: import.meta.env.DEV ? 'http://localhost:5173/' : 'https://reviewcollection.pages.dev/',
      queryParams: {
        prompt: 'select_account',
        access_tpye: 'offline'
      }
    }
  });
  
  if (error) console.error('error:', error.message);
  {/* 에러 메시지 이거 나중에 싹 지우셈. 유저들한테 이걸 왜 보여줌 */}
}


export const signInWithKakao = async () => {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: import.meta.env.DEV ? 'http://localhost:5173/' : 'https://reviewcollection.pages.dev/',
      queryParams: {
        prompt: 'select_account',
        access_tpye: 'offline'
      }
    }
  });
  if (error) console.error('error: ', error.message);
}

export const signUpWithEmail = async (fullEmail: string, password: string) => {
  try {
    const { error } = await client.auth.signUp({
      email: fullEmail,
      password: password,
    });
    if (error) {
      console.log("실패했지렁");
      return false;
    }

    return true;
  
  } catch (e) {
    console.log("실패했지렁");
    return false;
  }
}
 // 얘들 diplay name이 없는데. nickname을 어떻게 써먹냐
export const signInWithEmail = async (fullEmail: string, password: string) => {
  try {
    const { error } = await client.auth.signInWithPassword({
      email: fullEmail,
      password: password,
    });
    if (error) {
      console.log("실패했지렁");
      return false;
    }

    return true;

  } catch (e) {
    console.log("실패했지렁");
    return false;
  }
}

// async function dever() {
//   try {
//     const { data, error } = await client.auth.signInWithPassword({
//     email: 'test@gmail.com',
//     password: 'uiopui'
//   });
//   if (error) {
//     console.error(error);
//     return false;
//   }
//   return true;
//   } catch (e) {
//     console.error(e);
//     return false;
//   }
// }

// export const getUserInfo = async () => {
//   const { data: { user }, error } = await client.auth.getUser();

//   if (user) {
    
//     // const email = user.email; // || user.user_metadata.email
//     const nickname = user.user_metadata.full_name;
//     // const profileImage = user.user_metadata.avatar_url; // 카카오 프로필 이미지 URL

//   }
// };