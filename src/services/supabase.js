// Servicio para conectar con Supabase.
// Un servicio es un archivo que ofrece una API (funciones o clases) para resolver alguna funcionalidad.
import { createClient } from '@supabase/supabase-js';

// Las credenciales las obtenemos de nuestro panel de Supabase.
const SUPABASE_URL = 'https://kjhwnxkqmrsqrolwoksv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SK5DMl08iJ4HNIB0RdsikA_ZSlB7l2-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);