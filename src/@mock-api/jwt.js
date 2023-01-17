import CryptoJS from "crypto-js"

// https://stateful.com/blog/key-generation-webcrypto
function Base64Decode(strBase64) {
  strBase64 = strBase64.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')

  return window.atob(strBase64)
}

function Base64Encode(str) {
  const base64string = window.btoa(str)

  return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

// https://www.jonathan-petitcolas.com/2014/11/27/creating-json-web-token-in-javascript.html
function Base64Url(source) {
  // Encode in classical base64
  let encodedSource = CryptoJS.enc.Base64.stringify(source)

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '')

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-')
  encodedSource = encodedSource.replace(/\//g, '_')

  return encodedSource
}


const secret = 'dd5f3089-40c3-403d-af14-d0c228b05cb4'
const header = { alg: "HS256", typ: "JWT" }

export const jwtSign = async data => {
  const jwtHeader = Base64Encode(JSON.stringify(header))
  const jwtBody = Base64Encode(JSON.stringify(data))
  const jwtPayload = `${jwtHeader}.${jwtBody}`

  // using - window.crypto [only works on https]
  // https://stackoverflow.com/a/67432483
  // const enc = new TextEncoder('utf-8')
  // const algorithm = { name: "HMAC", hash: "SHA-256" }
  // const key = await crypto.subtle.importKey("raw", enc.encode(secret), algorithm, false, ["sign", "verify"])
  // const signature = await crypto.subtle.sign(algorithm.name, key, enc.encode(jwtPayload))
  // const jwtSignature = Base64Encode(String.fromCharCode(...new Uint8Array(signature)))

  // using - crypto-js
  // https://www.jonathan-petitcolas.com/2014/11/27/creating-json-web-token-in-javascript.html
  const signature = CryptoJS.HmacSHA256(jwtPayload, secret)
  const jwtSignature = Base64Url(signature)

  return `${jwtPayload}.${jwtSignature}`
}
