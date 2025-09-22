// src/composables/useAuth.ts
import { ref } from 'vue'
import { supabase } from '@/supabase/client'
type User = import('@supabase/supabase-js').User

export type AppRole = 'admin' | 'user' | 'guest'

export const user = ref<User | null>(null)
export const role = ref<AppRole>('guest')
export const authLoading = ref(false)
export const authError = ref<string | null>(null)

function redirectUrl() {
  return `${window.location.origin}/auth/callback`
}

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

export function initAuth() {
  // initial fetch
  supabase.auth.getUser().then(({ data }) => {
    user.value = data.user ?? null
    if (user.value) fetchUserRole()
  })

  // keep in sync
  supabase.auth.onAuthStateChange(async (event, session) => {
    user.value = session?.user ?? null
    if (user.value && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
      await fetchUserRole()
    }
    if (event === 'SIGNED_OUT') {
      role.value = 'guest'
    }
  })
}

export async function signUpWithEmail(email: string, password: string) {
  authError.value = null
  authLoading.value = true
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl() },
    })
    if (error) throw error
    return data
  } catch (e: any) {
    authError.value = e?.message || 'Sign up failed'
    throw e
  } finally {
    authLoading.value = false
  }
}

export async function signInWithEmail(email: string, password: string) {
  authError.value = null
  authLoading.value = true
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  } catch (e: any) {
    authError.value = e?.message || 'Sign in failed'
    throw e
  } finally {
    authLoading.value = false
  }
}

export async function sendPasswordReset(email: string) {
  authError.value = null
  authLoading.value = true
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl(),
    })
    if (error) throw error
  } catch (e: any) {
    authError.value = e?.message || 'Reset failed'
    throw e
  } finally {
    authLoading.value = false
  }
}

export async function signInWithGoogle() {
  authError.value = null
  authLoading.value = true
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl(),
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) throw error
  } finally {
    authLoading.value = false
  }
}

export async function signOut() {
  await supabase.auth.signOut()
  user.value = null
  role.value = 'guest'
}
