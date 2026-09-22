import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'SUA_PROJECT_URL_DO_SUPABASE';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_DO_SUPABASE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);