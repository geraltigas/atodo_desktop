import axios from 'axios'

export const axios_ = axios.create({
  baseURL: 'http://localhost:50051',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' }
})

axios_.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    } else {
      return Promise.reject('Failed to get response')
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)
