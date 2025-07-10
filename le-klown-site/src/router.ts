import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Shop from './pages/Shop.vue'
import Admin from './pages/Admin.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/shop', component: Shop },
  { path: '/admin', component: Admin },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
