// src/services/axiosInstance.js

import axios from 'axios'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Base URL for your API
  timeout: 10000, // Optional: Set a timeout for requests
})

// Set up an interceptor to add the Authorization header with the Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken')
    
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error)
  }
)

export default axiosInstance
