import axios from 'axios'

/**
 * Спільний HTTP-клієнт для всіх запитів до бекенду.
 * baseURL '/api' — запити проходять через Vite-проксі (див. vite.config.js)
 * і потрапляють на бекенд за адресою localhost:3000.
 */
const api = axios.create({
  baseURL: '/api'
})

// Перехоплювач запитів: якщо є збережений токен адміна — додаємо його
// в заголовок Authorization для кожного запиту (потрібно для захищених ендпоінтів)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api