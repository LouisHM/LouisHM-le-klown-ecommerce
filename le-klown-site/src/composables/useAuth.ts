import { ref } from 'vue'
import { supabase } from '../supabase/client'

export const user = ref<any>(null)
export const role = ref<string | null>(null)

export async function fetchUserRole() {
  const { data: sessionData } = await supabase.auth.getSession()

  if (!sessionData.session) {
    // 👉 Utilisateur non connecté → on réinitialise tout
    user.value = null
    role.value = null
    return
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
    role.value = 'user' // fallback de sécurité
  } else {
    role.value = data?.role || 'user'
  }
}
