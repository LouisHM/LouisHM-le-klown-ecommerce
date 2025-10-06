import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client'
import type { Session } from '@supabase/supabase-js'

type User = import('@supabase/supabase-js').User

export type AppRole = 'admin' | 'user' | 'guest'

const user = ref<User | null>(null)
const role = ref<AppRole>('guest')
const authReady = ref(false)
const authLoading = ref(false)
const authError = ref<string | null>(null)

const isAuthenticated = computed(() => !!user.value)
const isAdmin = computed(() => role.value === 'admin')

let initialisePromise: Promise<void> | null = null
let unsubscribe: (() => void) | null = null

function resetAuthState() {
  user.value = null
  role.value = 'guest'
}

function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message
  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  if (typeof err === 'string') return err
  return 'Une erreur est survenue. Merci de réessayer.'
}

function redirectUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`
  }

  const site = import.meta.env.VITE_SITE_URL
  if (typeof site === 'string' && site.startsWith('http')) {
    return `${site.replace(/\/$/, '')}/auth/callback`
  }

  return '/auth/callback'
}

async function loadRole(userId: string) {
  const { data, error } = await supabase
    .from('utilisateurs')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.warn('[useAuth] Unable to load role:', error.message)
    role.value = 'user'
    return
  }

  const rawRole = typeof data?.role === 'string' ? data.role.toLowerCase() : null
  role.value = rawRole === 'admin' ? 'admin' : 'user'
}

async function applySession(session: Session | null) {
  const nextUser = session?.user ?? null
  user.value = nextUser

  if (!nextUser) {
    role.value = 'guest'
    return
  }

  await loadRole(nextUser.id)
}

export async function refreshSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('[useAuth] getSession failed:', error.message)
    resetAuthState()
    authReady.value = true
    return
  }

  await applySession(data.session ?? null)
  authReady.value = true
}

export async function initAuth(): Promise<void> {
  if (initialisePromise) return initialisePromise

  initialisePromise = (async () => {
    await refreshSession()

    if (unsubscribe) return

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await applySession(session ?? null)
    })

    unsubscribe = () => {
      data.subscription.unsubscribe()
      unsubscribe = null
    }
  })()

  return initialisePromise
}

export function clearAuthError() {
  authError.value = null
}

async function runWithState<T>(fn: () => Promise<T>): Promise<T> {
  authLoading.value = true
  authError.value = null
  try {
    const result = await fn()
    return result
  } catch (err) {
    authError.value = errorMessage(err)
    throw err
  } finally {
    authLoading.value = false
  }
}

export function getCurrentUser() {
  return user.value
}

export async function signUpWithEmail(email: string, password: string) {
  return runWithState(async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl() },
    })

    if (error) throw error
    return data
  })
}

export async function signInWithEmail(email: string, password: string) {
  return runWithState(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await refreshSession()
    return data
  })
}

export async function signInWithGoogle() {
  return runWithState(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl() },
    })
    if (error) throw error
  })
}

export async function sendPasswordReset(email: string) {
  return runWithState(async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl(),
    })
    if (error) throw error
  })
}

export async function signOut() {
  return runWithState(async () => {
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    if (error) throw error
    await refreshSession()
  })
}

export {
  user,
  role,
  authReady,
  authLoading,
  authError,
  isAuthenticated,
  isAdmin,
}

export default {
  initAuth,
  refreshSession,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  sendPasswordReset,
  signOut,
  clearAuthError,
  getCurrentUser,
  user,
  role,
  authReady,
  authLoading,
  authError,
  isAuthenticated,
  isAdmin,
}
