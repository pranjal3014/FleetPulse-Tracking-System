import { api } from './client'

export const authApi = {
  login: (body) => api.post('/auth/login', body),
  register: (body) => api.post('/auth/register-driver', body),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  pendingDrivers: () => api.get('/auth/pending-drivers'),
  approveDriver: (userId) => api.put(`/auth/approve-driver/${userId}`),
  rejectDriver: (userId) => api.put(`/auth/reject-driver/${userId}`),
}
export const vehicleApi = {
  all: () => api.get('/vehicles/'),
  one: (id) => api.get(`/vehicles/${id}`),
  create: (body) => api.post('/vehicles/add', body),
  update: (id, body) => api.put(`/vehicles/${id}`, body),
  remove: (id) => api.delete(`/vehicles/${id}`),
}
export const driverApi = {
  all: () => api.get('/drivers/'),
  create: (body) => api.post('/drivers/add', body),
  update: (id, body) => api.put(`/drivers/${id}`, body),
  remove: (id) => api.delete(`/drivers/${id}`),
}
export const tripApi = {
  all: () => api.get('/trips'),
  one: (id) => api.get(`/trips/${id}`),
  create: (body) => api.post('/trips/add', body),
  update: (id, body) => api.put(`/trips/${id}`, body),
  remove: (id) => api.delete(`/trips/${id}`),
  start: (id) => api.post(`/api/trips/${id}/start`),
  active: () => api.get('/api/trips/active'),
  route: (id) => api.get(`/trips/${id}/route`),
}
export const locationApi = {
  latest: (vehicleId) => api.get(`/api/locations/latest/${vehicleId}`),
  history: (vehicleId) => api.get(`/api/locations/history/${vehicleId}`),
}
