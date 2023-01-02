import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isUserLoggedIn } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (!isLoggedIn && to.path !== '/auth/login') {
    return next({ path: '/auth/login' })
  }

  next()
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
