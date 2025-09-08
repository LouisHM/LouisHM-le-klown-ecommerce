import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Events from '@/pages/Events.vue'
import Shop from '@/pages/Shop.vue'
import Admin from '@/pages/Admin.vue'
import { role, fetchUserRole } from '@/composables/useAuth'

const routes = [
  { path: '/', component: Home },
  { path: '/events', component: Events },
  { path: '/shop', component: Shop },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAdmin: true },
  },
  // Catch-all route (404)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Guard global pour vérifier les droits admin
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin) {
    await fetchUserRole() // s'assure que le rôle est à jour
    if (role.value === 'admin') {
      next()
    } else {
      next('/403') // ou next('/') si tu préfères
    }
  } else {
    next()
  }
})

export { router }
