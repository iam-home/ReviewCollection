import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('수파베이스 환경변수(URL 또는 ANON_KEY)가 세팅되지 않았습니다.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);