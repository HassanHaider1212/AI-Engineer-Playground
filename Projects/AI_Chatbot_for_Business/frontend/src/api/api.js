import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const botsAPI = {
  getAll: () => api.get('/bots'),
  getOne: (botId) => api.get(`/bots/${botId}`),
  create: (data) => api.post('/bots', data),
  delete: (botId) => api.delete(`/bots/${botId}`),
  uploadFile: (botId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/bots/${botId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadUrl: (botId, url) => {
    const formData = new FormData()
    formData.append('url', url)
    return api.post(`/bots/${botId}/upload-url`, formData)
  },
  train: (botId) => api.post(`/bots/${botId}/train`),
  getDocuments: (botId) => api.get(`/bots/${botId}/documents`),
}

export const chatAPI = {
  sendMessage: (data) => api.post('/chat', data),
}

export const leadsAPI = {
  getAll: () => api.get('/leads'),
  getByBot: (botId) => api.get(`/leads/${botId}`),
  create: (data) => api.post('/leads', data),
}

export const conversationsAPI = {
  getAll: () => api.get('/conversations'),
  getByBot: (botId) => api.get(`/conversations/${botId}`),
}

export default api
