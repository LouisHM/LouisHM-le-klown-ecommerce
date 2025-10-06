// src/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabase] Missing env VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})

export default supabase

// Debug helper (facultatif)
if (typeof window !== 'undefined') {
  ;(window as any).SB = {
    async user() { const { data } = await supabase.auth.getUser(); console.log('[SB.user]', data.user); return data.user },
    async session() { const { data } = await supabase.auth.getSession(); console.log('[SB.session]', data.session); return data.session },
  }
}
