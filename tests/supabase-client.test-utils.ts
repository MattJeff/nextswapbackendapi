import { createClient } from '@supabase/supabase-js';

// Utilise les variables d'environnement du backend
export const supabaseTestClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
