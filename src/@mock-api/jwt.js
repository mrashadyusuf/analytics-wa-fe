// https://stateful.com/blog/key-generation-webcrypto
function Base64Decode(strBase64) {
  strBase64 = strBase64.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')

  return window.atob(strBase64)
}

function Base64Encode(str) {
  const base64string = window.btoa(str)

  return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const secret = 'dd5f3089-40c3-403d-af14-d0c228b05cb4'
const header = { alg: "HS256", typ: "JWT" }

// https://stackoverflow.com/a/67432483
export const jwtSign = async data => {
  const jwtHeader = Base64Encode(JSON.stringify(header))
  const jwtBody = Base64Encode(JSON.stringify(data))
  const jwtPayload = `${jwtHeader}.${jwtBody}`

  const enc = new TextEncoder('utf-8')
  const algorithm = { name: "HMAC", hash: "SHA-256" }

  const key = await crypto.subtle.importKey("raw", enc.encode(secret), algorithm, false, ["sign", "verify"])
  const signature = await crypto.subtle.sign(algorithm.name, key, enc.encode(jwtPayload))
  const jwtSignature = Base64Encode(String.fromCharCode(...new Uint8Array(signature)))

  return `${jwtPayload}.${jwtSignature}`
}
