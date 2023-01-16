/* eslint-disable global-require */
/* eslint-disable no-console */
import mock from '@/@mock-api/mock'
import { delay } from '@/@mock-api/utils'
import { jwtSign } from '@/@mock-api/jwt'
import items from '@/@mock-api/data/users'

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
      const accessToken = await jwtSign({ username: item.username, group: item.group })
      const refreshToken = await jwtSign({ username: item.username, group: item.group })

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
