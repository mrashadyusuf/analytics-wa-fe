// src/utils/authUtils.js

import jwtProvider from '@/auth/jwt/jwtProvider'
import authUtils from '@/auth/utils'

export const doLogout = (router, route) => {
  jwtProvider.removeAccessToken()
  jwtProvider.removeRefreshToken()
  authUtils.removeUser()
  authUtils.removeUserData()
  authUtils.removeUserPermissions()
  console.log("dologout")
  router.replace(route.query.to ? String(route.query.to) : '/auth/login')
}
