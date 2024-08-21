// src/utils/authUtils.js

import jwtProvider from '@/auth/jwt/jwtProvider'
import authUtils from '@/auth/utils'
import { useRouter, useRoute } from 'vue-router'

export const doLogout = () => {
  const router = useRouter()
  const route = useRoute()

  jwtProvider.removeAccessToken()
  jwtProvider.removeRefreshToken()
  authUtils.removeUser()
  authUtils.removeUserData()
  authUtils.removeUserPermissions()

  router.replace(route.query.to ? String(route.query.to) : '/auth/login')
}
