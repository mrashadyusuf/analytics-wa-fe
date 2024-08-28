export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns = null

  // jwtConfig <= Will be used by this service
  jwtConfig = null

  // jwtTokenType used by this service
  jwtTokenType = 'Bearer'

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // For Refreshing Token
  subscribers = []

  constructor(axiosIns, jwtConfig) {
    this.axiosIns = axiosIns
    this.jwtConfig = jwtConfig

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      config => {
        // Get token from localStorage
        const accessToken = this.getAccessToken()

        // If token is present add it to request's Header Name
        if (accessToken) {
          config.headers.Authorization = `${this.jwtTokenType} ${accessToken}`
        }
        
        return config
      },
      error => {
        return Promise.reject(error)
      },
    )

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      response => response,
      error => {
        const { config, response } = error
        const originalRequest = config

        if (response && response.status === 401 && config.url !== '/auth/login') {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true
            // eslint-disable-next-line promise/no-promise-in-callback
            this.refresh({ refreshToken: this.getRefreshToken }).then(r => {
              this.isAlreadyFetchingAccessToken = false

              // Update accessToken in localStorage
              this.setAccessToken(r.data.accessToken)
              this.setRefreshToken(r.data.refreshToken)

              this.onAccessTokenFetched(r.data.accessToken)
            })
          }

          // return original request
          return new Promise(resolve => {
            this.addSubscriber(accessToken => {
              // Make sure to assign accessToken according to your response.
              // Check: https://pixinvent.ticksy.com/ticket/2413870
              // Change Authorization header
              originalRequest.headers.Authorization = `${this.jwtTokenType} ${accessToken}`
              resolve(this.axiosIns(originalRequest))
            })
          })
        }

        return Promise.reject(error)
      },
    )
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  setAccessToken(value) {
    localStorage.setItem(this.jwtConfig.storageAccessTokenKey, value)
  }

  getAccessToken() {
    return localStorage.getItem(this.jwtConfig.storageAccessTokenKey)
  }

  removeAccessToken() {
    localStorage.removeItem(this.jwtConfig.storageAccessTokenKey)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKey, value)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKey)
  }

  removeRefreshToken() {
    localStorage.removeItem(this.jwtConfig.storageRefreshTokenKey)
  }

  login(...args) {
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args)
  }

  logout(...args) {
    return this.axiosIns.post(this.jwtConfig.logoutEndpoint, ...args)
  }

  refresh(...args) {
    return this.axiosIns.post(this.jwtConfig.refreshEndpoint, ...args)
  }
}
