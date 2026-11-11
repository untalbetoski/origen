// Claves públicas del proyecto Supabase "origen" (la anon/publishable key es segura de exponer:
// toda la escritura está protegida por RLS). Las variables de entorno, si existen, tienen prioridad.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xhwkvadzknvbqyeydalc.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_pAyGsiO9mlXDiiliVjdd9Q_NTZFs7b9";
