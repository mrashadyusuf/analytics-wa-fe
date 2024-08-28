import mock from '@/@mock-api/mock'
import { delay } from '@/@mock-api/utils'
import { jwtSign } from '@/@mock-api/jwt'
import { items as users } from '@/@mock-api/data/users'
import { items as permissions } from '@/@mock-api/data/permissions'

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
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) {
      response = [401, { message: 'Invalid Username or Password' }]
    } else {
      const userData = { ...user }
      const accessToken = await jwtSign({ username: user.username, group: user.group_code })
      const refreshToken = await jwtSign({ username: user.username, group: user.group_code })
      const userPermissions = permissions.filter(permission => permission.group_code === user.group_code)

      delete userData.password
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
