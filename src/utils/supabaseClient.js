import { createClient } from '@supabase/supabase-js';

export default createClient(
  import.meta.env.REACT_APP_SUPABASE_URL,
  import.meta.env.REACT_APP_SUPABASE_KEY
);
