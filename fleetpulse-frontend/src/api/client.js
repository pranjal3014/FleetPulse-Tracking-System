import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:8080')
export const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } })

let refreshing = null
api.interceptors.request.use((config) => {
  const publicAuthUrls = ['/auth/login', '/auth/register-driver', '/auth/refresh', '/auth/logout']
  if (publicAuthUrls.includes(config.url)) return config

  const token = localStorage.getItem('fp_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((response) => response, async (error) => {
  const original = error.config
  if (error.response?.status !== 401 || original?._retry || original?.url === '/auth/refresh') return Promise.reject(error)
  original._retry = true
  const refreshToken = localStorage.getItem('fp_refresh_token')
  if (!refreshToken) return Promise.reject(error)
  try {
    refreshing ??= axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
    const { data } = await refreshing
    localStorage.setItem('fp_access_token', data.accessToken)
    original.headers.Authorization = `Bearer ${data.accessToken}`
    return api(original)
  } catch (refreshError) {
    localStorage.removeItem('fp_access_token')
    localStorage.removeItem('fp_refresh_token')
    localStorage.removeItem('fp_user')
    window.dispatchEvent(new Event('fleetpulse:session-expired'))
    return Promise.reject(refreshError)
  } finally { refreshing = null }
})

export const messageFromError = (error) => {
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return `Cannot reach FleetPulse backend at ${BASE_URL}. Make sure the Spring Boot app is running and CORS allows the frontend origin.`
  }
  return error.response?.data?.message || error.message || 'Something went wrong'
}
