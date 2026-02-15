
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvoxzykwohcqgeawojsh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3h6eWt3b2hjcWdlYXdvanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjMxOTIsImV4cCI6MjA4NjY5OTE5Mn0.fwsU0tGIlU8arlBo2w2RWafYiVfkndRnXv96vSn5DpA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
