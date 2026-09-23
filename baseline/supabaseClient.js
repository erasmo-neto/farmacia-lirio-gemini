import { createClient } from '@supabase/supabase-js';

// Substitua pelos seus dados reais do painel do Supabase
const SUPABASE_URL = 'https://favkqdbvqqzyihbvqwux.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdmtxZGJ2cXF6eWloYnZxd3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTQ0NzIsImV4cCI6MjEwNTU3MDQ3Mn0.UyAf35cnX80mE8c1l9qm4_Q55w74k0rEUuCKslCBoS4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);