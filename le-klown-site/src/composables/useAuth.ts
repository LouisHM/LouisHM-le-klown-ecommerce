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
const firstName = ref('')
const lastName = ref('')

const SESSION_STARTED_AT_KEY = 'lk-session-started-at'
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000 // 24 heures

const isAuthenticated = computed(() => !!user.value)
const isAdmin = computed(() => role.value === 'admin')
const displayName = computed(() => {
  const parts = [firstName.value, lastName.value].filter(Boolean)
  if (parts.length) return parts.join(' ')
  return user.value?.user_metadata?.full_name ?? user.value?.email ?? ''
})

let initialisePromise: Promise<void> | null = null
let unsubscribe: (() => void) | null = null

function resetAuthState() {
  user.value = null
  role.value = 'guest'
  firstName.value = ''
  lastName.value = ''
  clearSessionStart()
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

function metaValue(u: User, keys: string[]): string | undefined {
  for (const key of keys) {
    const val = (u.user_metadata as Record<string, unknown> | null | undefined)?.[key]
    if (typeof val === 'string' && val.trim().length) return val.trim()
  }
  return undefined
}

async function syncProfile(u: User) {
  const metaFirst = metaValue(u, ['first_name', 'firstName', 'given_name'])
  const metaLast = metaValue(u, ['last_name', 'lastName', 'family_name'])

  let profile: { role: string | null; first_name: string | null; last_name: string | null } | null = null

  const { data, error } = await supabase
    .from('utilisateurs')
    .select('role, first_name, last_name')
    .eq('id', u.id)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    console.warn('[useAuth] Unable to load profile:', error.message)
  } else {
    profile = data ?? null
  }

  if (!profile) {
    const insertPayload = {
      id: u.id,
      role: 'user' as const,
      first_name: metaFirst ?? null,
      last_name: metaLast ?? null,
    }
    const { data: inserted, error: insertError } = await supabase
      .from('utilisateurs')
      .insert(insertPayload)
      .select('role, first_name, last_name')
      .single()

    if (insertError) {
      console.warn('[useAuth] Unable to insert profile:', insertError.message)
    } else {
      profile = inserted
    }
  } else {
    const updatePayload: Record<string, string | null> = {}
    if (metaFirst && metaFirst !== profile.first_name) updatePayload.first_name = metaFirst
    if (metaLast && metaLast !== profile.last_name) updatePayload.last_name = metaLast

    if (Object.keys(updatePayload).length) {
      const { data: updated, error: updateError } = await supabase
        .from('utilisateurs')
        .update(updatePayload)
        .eq('id', u.id)
        .select('role, first_name, last_name')
        .single()

      if (updateError) {
        console.warn('[useAuth] Unable to update profile:', updateError.message)
      } else {
        profile = updated
      }
    }
  }

  const effectiveRole = profile?.role?.toLowerCase() === 'admin' ? 'admin' : 'user'
  role.value = effectiveRole
  firstName.value = profile?.first_name ?? metaFirst ?? ''
  lastName.value = profile?.last_name ?? metaLast ?? ''
}

async function applySession(session: Session | null) {
  if (!session || !session.user) {
    user.value = null
    role.value = 'guest'
    firstName.value = ''
    lastName.value = ''
    clearSessionStart()
    return
  }

  if (typeof window !== 'undefined') {
    const startedAt = getSessionStart()
    const now = Date.now()
    if (startedAt !== null && now - startedAt > MAX_SESSION_AGE_MS) {
      clearSessionStart()
      await supabase.auth.signOut()
      user.value = null
      role.value = 'guest'
      firstName.value = ''
      lastName.value = ''
      return
    }

    setSessionStart(now)
  }

  const nextUser = session.user
  user.value = nextUser
  await syncProfile(nextUser)
}

function getSessionStart(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SESSION_STARTED_AT_KEY)
    if (!raw) return null
    const value = Number(raw)
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

function setSessionStart(timestamp: number) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SESSION_STARTED_AT_KEY, String(timestamp))
  } catch {
    /* ignore */
  }
}

function clearSessionStart() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(SESSION_STARTED_AT_KEY)
  } catch {
    /* ignore */
  }
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

export async function signUpWithEmail(params: { email: string; password: string; firstName: string; lastName: string }) {
  const { email, password, firstName: fn, lastName: ln } = params
  return runWithState(async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl(),
        data: {
          first_name: fn,
          last_name: ln,
          full_name: `${fn} ${ln}`.trim(),
        },
      },
    })

    if (error) throw error

    if (data?.user) {
      await syncProfile(data.user)
    }
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
      options: { redirectTo: redirectUrl(), queryParams: {prompt: 'select_account'} },
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

function purgeLocalTokens() {
  if (typeof window === 'undefined') return
  try {
    const projectRef = new URL(import.meta.env.VITE_SUPABASE_URL as string).host.split('.')[0]
    const prefixes = [`sb-${projectRef}-`, 'supabase.auth.']
    prefixes.forEach(prefix => {
      Object.keys(window.localStorage).forEach((key) => {
        if (key.startsWith(prefix)) window.localStorage.removeItem(key)
      })
      Object.keys(window.sessionStorage).forEach((key) => {
        if (key.startsWith(prefix)) window.sessionStorage.removeItem(key)
      })
    })
  } catch (err) {
    console.warn('[useAuth] Unable to purge local Supabase tokens', err)
  }
}

export async function signOut() {
  return runWithState(async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) throw error

    purgeLocalTokens()
    resetAuthState()
    authReady.value = true
  })
}

export {
  user,
  role,
  authReady,
  authLoading,
  authError,
  firstName,
  lastName,
  isAuthenticated,
  isAdmin,
  displayName,
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
  firstName,
  lastName,
  isAuthenticated,
  isAdmin,
  displayName,
}
