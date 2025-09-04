// Servicio para conectar con Supabase.
// Un servicio es un archivo que ofrece una API (funciones o clases) para resolver alguna funcionalidad.
import { createClient } from '@supabase/supabase-js';

// Las credenciales las obtenemos de nuestro panel de Supabase.
const SUPABASE_URL = 'https://gobjyhmipqgqgffyguof.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UGgGt2kg3KEfbnBhkpA9hw_3SZMYEC-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);