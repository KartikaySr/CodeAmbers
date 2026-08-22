import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set in .env');
}

// We use the service role key to bypass RLS for server-side actions like creating files during AI generation
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
