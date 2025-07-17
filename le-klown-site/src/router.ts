import { createRouter, createWebHistory } from 'vue-router'
import Admin from './pages/Admin.vue'
import Home from './pages/Home.vue'
import Events from './pages/Events.vue'
import Shop from './pages/Shop.vue'
import { role } from './composables/useAuth'

const routes = [
  { path: '/', component: Home },
  { path: '/shop', component: Shop },
  { path: '/admin', component: Admin, meta: { requiresAdmin: true }},
  { path: '/events', component: Events },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && role.value !== 'admin') {
    next('/') // ou afficher une page 403
  } else {
    next()
  }
})

export { router }
