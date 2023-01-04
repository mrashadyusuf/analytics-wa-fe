/* eslint-disable global-require */
/* eslint-disable no-console */
import mock from '@/@mock-api/mock'
import { delay } from '@/@mock-api/utils'

import avatar1 from '@/assets/images/avatars/avatar-1.png'
import avatar2 from '@/assets/images/avatars/avatar-2.png'

const items = [
  {
    id: 1,
    username: 'admin@demo.com',
    email: 'admin@demo.com',
    fullname: 'Administrator',
    password: 'admin',
    avatar: avatar1,
    group: 'admin',
    permissions: [{ action: 'manage', subject: 'all' }],
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGRlbW8uY29tIiwicm9sZSI6ImFkbWluIn0.dxyNWWAJX3TA6eTUpy6X5wkbWez3LZ2qZ7wtYjB_xfc',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGRlbW8uY29tIiwicm9sZSI6ImFkbWluIn0.dxyNWWAJX3TA6eTUpy6X5wkbWez3LZ2qZ7wtYjB_xfc',
  },
  {
    id: 2,
    username: 'client@demo.com',
    email: 'client@demo.com',
    fullname: 'Client',
    password: 'client',
    avatar: avatar2,
    group: 'client',
    permissions: [
      { subject: 'Error', action: 'read' },
      { subject: 'Auth', action: 'read' },
      { subject: 'Profile', action: 'read' },
      { subject: 'Dashboard', action: 'read' },
    ],
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNsaWVudEBkZW1vLmNvbSIsInJvbGUiOiJjbGllbnQifQ.iAvLdKs4sIFyKDsOmniyMNJClBCAMl5ZsDu9CAx0-hA',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNsaWVudEBkZW1vLmNvbSIsInJvbGUiOiJjbGllbnQifQ.iAvLdKs4sIFyKDsOmniyMNJClBCAMl5ZsDu9CAx0-hA',
  },
]

// api
const url = '/auth'
const logRequest = '[mock-api][request]'
const logResponse = '[mock-api][response]'
const logError = '[mock-api][error]'

mock.onPost(`${url}/login`).reply(async request => {
  console.debug(`${logRequest} POST ${url}/login:`, { data: request.data && JSON.parse(request.data) })
  let response = []
  try {
    const { username, password } = JSON.parse(request.data)
    const item = items.find(u => u.username === username && u.password === password)
    if (!item) {
      response = [401, { message: 'Invalid Username or Password' }]
    } else {
      const userData = { ...item }
      const userPermissions = item.permissions
      const accessToken = item.accessToken
      const refreshToken = item.refreshToken

      delete userData.password
      delete userData.permissions
      delete userData.accessToken
      delete userData.refreshToken

      const body = { 
        data: { userData, userPermissions, accessToken, refreshToken },
        message: 'User login successfully',
      }

      response = [200, body]
    }
  } catch (e) {
    console.error(`${logError} POST ${url}/login:`, e)
    response = [500, e]
  }
  await delay(300)
  console.debug(`${logResponse} POST ${url}/login:`, response)
  
  return response
})

mock.onPost('/auth/logout').reply(async request => {
  console.debug(`${logRequest} POST ${url}/logout:`, { data: request.data && JSON.parse(request.data) })

  const response = [200, { message: 'User logout successfully' }]

  await delay(300)
  console.debug(`${logResponse} POST ${url}/logout:`, response)
  
  return response
})
