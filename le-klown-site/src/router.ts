// src/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Pages
import Home from '@/pages/Home.vue'
import Shop from '@/pages/Shop.vue'
import Events from '@/pages/Events.vue'
import Admin from '@/pages/Admin.vue'
import AuthCallback from '@/pages/AuthCallback.vue'
import NotFound from '@/pages/NotFound.vue'
import UsageConditions from '@/pages/UsageConditions.vue'
import ConfidentialityConditions from '@/pages/ConfidentialityConditions.vue'

import { supabase } from '@/supabase/client'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/shop', component: Shop },
  { path: '/events', component: Events },
  { path: '/admin', component: Admin, meta: { requiresAdmin: true } }, // ✅ admin only
  { path: '/useTerms', component: UsageConditions },
  { path: '/privacy', component: ConfidentialityConditions },
  { path: '/auth/callback', component: AuthCallback },
  { path: '/403', component: { template: '<div class="pt-24 text-center text-light">403 – Forbidden</div>' } },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!to.meta?.requiresAdmin) return true

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    return '/403'
  }

  const userId = sessionData.session.user.id
  const { data: profile, error } = await supabase
    .from('utilisateurs')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('[router] Unable to verify admin role:', error.message)
    return '/403'
  }

  return profile?.role === 'admin' ? true : '/403'
})

export default router
