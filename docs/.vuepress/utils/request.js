import axios from 'axios'
import auth from './auth'

let service = axios.create({
  baseURL:  'http://localhost:8000',
  timeout: 10000
})

// request
service.interceptors.request.use(
  config => {
    let token = auth.getToken()
    if (token) {
      config.headers.token = token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// response
service.interceptors.response.use(
  response => {
    let {code, message} = response.data
    if (code !== 10000) {
      // 登录失效
      if (code === 20000) {
        console.error('登录失效')
      }
      console.error(message)
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default service