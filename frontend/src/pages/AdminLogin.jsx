import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

/**
 * Сторінка входу адміна.
 * Надсилає email і пароль на POST /api/auth/login; у разі успіху
 * зберігає JWT-токен у localStorage і перенаправляє на панель адміна.
 *
 * Важливо: форми навмисно вимкнені від автозаповнення браузера
 * (autoComplete="off" / "new-password"), щоб адмін вводив дані щоразу.
 */
export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' }) // Поля форми
  const [err, setErr] = useState('') // Повідомлення про помилку

  // Оновлення поля форми під час введення
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  // Відправка даних для входу
  const handleSubmit = async e => {
    e.preventDefault()
    setErr('')
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token) // Зберігаємо токен — він потрібен для панелі адміна
      navigate('/admin')
    } catch (e) {
      // Показуємо справжню помилку від бекенду (data.error)
      setErr(e.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="container">
      <h1>Admin Login</h1>
      {err && <div className="msg error">{err}</div>}
      {/* autoComplete="off" — браузер не зберігає і не підставляє логін/пароль */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} autoComplete="off" required />
        {/* new-password — додатково блокує пропозицію браузера зберегти пароль */}
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} autoComplete="new-password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}