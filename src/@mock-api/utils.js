const secret = 'dd5f3089-40c3-403d-af14-d0c228b05cb4'

export const paginateArray = (array, perPage, page) => array.slice((page - 1) * perPage, page * perPage)

export const paginateTotalPage = (array, perPage) => {
  if (array.length % perPage > 0) {
    return parseInt(array.length / perPage) + 1
  } else {
    return parseInt(array.length / perPage)
  }
}

export const sortCompare = key => (a, b) => {
  const fieldA = a[key]
  const fieldB = b[key]

  let comparison = 0
  if (fieldA > fieldB) {
    comparison = 1
  } else if (fieldA < fieldB) {
    comparison = -1
  }
  
  return comparison
}

export const getRandomInt = (min, max) => {
  if (min > max) {
    const temp = max

    max = min
    min = temp
  }

  if (min <= 0) {
    return Math.floor(Math.random() * (max + Math.abs(min) + 1)) + min
  }
  
  return Math.floor(Math.random() * max) + min
}

export const randomDate = (start, end) => {
  const diff = end.getTime() - start.getTime()
  const newDiff = diff * Math.random()
  
  return new Date(start.getTime() + newDiff)
}

export const delay = milliseconds => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(milliseconds)
    }, milliseconds)
  })
}
