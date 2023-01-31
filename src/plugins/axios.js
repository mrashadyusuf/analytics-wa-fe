import app from '@/main'
import axios from 'axios'

const axiosIns = axios.create({
// You can add your headers here
// ================================
// baseURL: 'https://some-domain.com/api/',
// timeout: 1000,
// headers: {'X-Custom-Header': 'foobar'}
})

axiosIns.interceptors.response.use(response => response, error => {
  const { response } = error
  const swal = app.config.globalProperties.$swal
  if (!response) {
    swal.fire({
      title: 'Something Went Wrong',
      html: `we are sorry for the inconvenience.`,
    })
    error.handled = true
  } else if (response.status >= 500) {
    swal.fire({
      title: 'Internal Server Error',
      html: `Please contact server Administrator.`,
    })
    error.handled = true
  }
  
  return Promise.reject(error)
})


export default axiosIns
