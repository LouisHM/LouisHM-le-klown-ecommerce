// src/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Pages (adjust to your actual files)
import Home from '@/pages/Home.vue'
import Shop from '@/pages/Shop.vue'
import Admin from '@/pages/Admin.vue'
import NotFound from '@/pages/NotFound.vue'
import AuthCallback from '@/pages/AuthCallback.vue'
import UsageConditions from './pages/UsageConditions.vue'
import ConfidentialityConditions from './pages/ConfidentialityConditions.vue'
import Events from '@/pages/Events.vue'


// Explicit typing avoids inference issues
const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/shop', component: Shop },
  { path: '/events', component: Events },
  { path: '/admin', component: Admin, meta: { requiresAuth: true } },
  { path: '/useTerms', component: UsageConditions },
  { path: '/confidentialityConditions', component: ConfidentialityConditions },
  { path: '/auth/callback', component: AuthCallback },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

export const router = createRouter({
  history: createWebHistory(), // or createWebHistory(import.meta.env.BASE_URL)
  routes,
})

export default router
