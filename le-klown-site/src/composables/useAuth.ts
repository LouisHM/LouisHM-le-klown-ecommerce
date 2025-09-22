// src/composables/useAuth.ts
import { ref } from 'vue'
import { supabase } from '@/supabase/client'

export type AppRole = 'admin' | 'user' | 'guest'

export const user = ref<import('@supabase/supabase-js').User | null>(null)
export const role = ref<AppRole>('guest')

export async function fetchUserRole(): Promise<AppRole> {
  const { data: sessionData } = await supabase.auth.getSession()

  if (!sessionData.session) {
    user.value = null
    role.value = 'guest'
    return role.value
  }

  const u = sessionData.session.user
  user.value = u

  const { data, error } = await supabase
    .from('utilisateurs')
    .select('role')
    .eq('id', u.id)
    .single()

  if (error) {
    console.error('Role fetch error:', error.message)
    role.value = 'user'
  } else {
    role.value = (data?.role as AppRole | null) ?? 'user'
  }

  return role.value
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
  user.value = null
  role.value = 'guest'
}
