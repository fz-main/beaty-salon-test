import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wlalwdlofssaooeicahv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Bp1eKW9qRmmQWS80HBILVA_bPeMBksB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
