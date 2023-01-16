import mock from '@/@mock-api/mock'
import items from '@/@mock-api/data/users'
import { paginateArray, paginateTotalPage } from '@/@mock-api/utils'

// api
const url = '/users'
const logRequest = '[mock-api][request]'
const logResponse = '[mock-api][response]'
const logError = '[mock-api][error]'

// search
mock.onGet(url).reply(async request => {
  console.debug(`${logRequest} GET ${url}:`, { params: request.params })
  let response = []
  try {
    const { page = 1, perPage = 10, keyword = '' } = request.params
    const keywordLower = keyword.toLowerCase()

    const filteredData = items.filter(item =>
      item.email.toLocaleLowerCase().includes(keywordLower) ||
      item.fullname.toLocaleLowerCase().includes(keywordLower) ||
      item.group.toLocaleLowerCase().includes(keywordLower))

    const paginateData = paginateArray(filteredData, perPage, page)

    response = [
      200,
      {
        data: paginateData,
        message: 'Data retrieve successfully',
      },
      {
        'page': page,
        'per-page': perPage,
        'total-page': paginateTotalPage(filteredData, perPage),
        'rows': paginateData.length,
        'total-rows': filteredData.length,
      },
    ]
  } catch (e) {
    console.error(`${logError} GET ${url}:`, e)
    response = [500, { message: 'Internal Server Error' }]
  }

  console.debug(`${logResponse} GET ${url}:`, response)

  return response
})

// find
mock.onGet(`${url}/find`).reply(async request => {
  console.debug(`${logRequest} GET ${url}/find:`, { params: request.params })
  let response = []
  try {
    const { id = '' } = request.params
    const data = items.find(it => it.id === id)
    if (data) {
      response = [200, { data, message: 'Ok' }]
    } else {
      response = [404, { data: null, message: 'Not Found' }]
    }
  } catch (e) {
    console.error(`${logError} GET ${url}/find:`, e)
    response = [500, { message: 'Internal Server Error' }]
  }

  console.debug(`${logResponse} GET ${url}/find:`, response)

  return response
})

// post
mock.onPost(`${url}`).reply(async request => {
  console.debug(`${logRequest} POST ${url}:`, { data: JSON.parse(request.data) })
  let response = []
  try {
    const data = JSON.parse(request.data)

    const item = {
      id: chance.guid(),
      username: data.email,
      email: data.email,
      fullname: data.fullname,
      group: data.group,
    }

    items.unshift(item)

    response = [200, { message: 'Ok' }]
  } catch (e) {
    console.error(`${logError} POST ${url}:`, e)
    response = [500, { message: 'Internal Server Error' }]
  }

  console.debug(`${logResponse} POST ${url}:`, response)

  return response
})

// put
mock.onPut(`${url}`).reply(async request => {
  console.debug(`${logRequest} PUT ${url}:`, { data: JSON.parse(request.data) })
  let response = []
  try {
    const data = JSON.parse(request.data)

    const index = items.findIndex(item => item.id == data.id)

    const item = {
      id: data.id,
      username: data.email,
      email: data.email,
      fullname: data.fullname,
      group: data.group,
    }

    items[index] = item

    response = [200, { message: 'Ok' }]
  } catch (e) {
    console.error(`${logError} PUT ${url}:`, e)
    response = [500, { message: 'Internal Server Error' }]
  }

  console.debug(`${logResponse} PUT ${url}:`, response)

  return response
})

// delete
mock.onDelete(`${url}`).reply(async request => {
  console.debug(`${logRequest} DELETE ${url}:`, { params: request.params })
  let response = []
  try {
    const { id } = request.params
    const index = items.findIndex(item => item.id == id)
    if (index > -1) {
      items.splice(index, 1)
    }

    response = [200, { message: 'Ok' }]
  } catch (e) {
    console.error(`${logError} DELETE ${url}:`, e)
    response = [500, { message: 'Internal Server Error' }]
  }

  console.debug(`${logResponse} DELETE ${url}:`, response)

  return response
})


