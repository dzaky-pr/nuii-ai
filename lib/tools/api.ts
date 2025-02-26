import axios, { AxiosError } from 'axios'
import { UninterceptedApiError } from '../types/api'

export const baseURL =
  process.env.NEXT_PUBLIC_RUN_MODE === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_DEV

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },

  withCredentials: false
})

api.defaults.withCredentials = false

api.interceptors.request.use(
  async config => {
    const token = await (window as any).Clerk.session.getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  config => {
    return config
  },
  (error: AxiosError<UninterceptedApiError>) => {
    if (error.response?.data.message) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message:
              typeof error.response.data.message === 'string'
                ? error.response.data.message
                : Object.values(error.response.data.message)[0][0]
          }
        }
      })
    }
    return Promise.reject(error)
  }
)

export default api
