import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { canNavigate } from '@/@layouts/plugins/casl'
import routes from '~pages'
import authUtils from '@/auth/utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach(to => {
  const isLoggedIn = authUtils.isUserLoggedIn()

  if (!canNavigate(to)) {
    if (!isLoggedIn) {
      return { path: '/auth/login' }
    } else {
      return { path: '/forbidden' }
    }
  }

  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    return { path: authUtils.getHomeRouteForLoggedInUser() }
  }
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
