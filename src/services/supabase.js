// Servicio para conectar con Supabase.
// Un servicio es un archivo que ofrece una API (funciones o clases) para resolver alguna funcionalidad.
import { createClient } from '@supabase/supabase-js';

// Las credenciales las obtenemos de nuestro panel de Supabase.
const SUPABASE_URL = 'https://ehvkvaqqgkpwkmzzirvm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodmt2YXFxZ2twd2ttenppcnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTAwNDgsImV4cCI6MjA3NDk4NjA0OH0.SQMiXhKcTFodKKVD_YcvJbEb-1izWVAU5tyv69B-FNA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);