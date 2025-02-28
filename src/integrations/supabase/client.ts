
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mkoccpfryilhnolregjz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rb2NjcGZyeWlsaG5vbHJlZ2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMTMyMTksImV4cCI6MjA1NDc4OTIxOX0.VWIpUJREJUQyDDTdRO0jwWX8pbc8VJGudpD8T76B78s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
