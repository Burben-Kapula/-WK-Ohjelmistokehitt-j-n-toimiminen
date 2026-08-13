import { useState } from 'react'
import api from '../api'

/**
 * Сторінка оформлення замовлення відвідувачем.
 * Відправляє дані форми на бекенд (POST /api/order) і показує результат.
 */
export default function Order() {
  // Стан полів форми замовлення
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', orderText: ''
  })
  const [msg, setMsg] = useState({ text: '', type: '' }) // Повідомлення про результат

  // Оновлює поле форми під час введення (за іменем поля)
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  // Відправка замовлення: надсилаємо всі поля на бекенд
  const handleSubmit = async e => {
    e.preventDefault()
    setMsg({ text: '', type: '' })
    try {
      await api.post('/order', form)
      setMsg({ text: 'Order placed successfully!', type: 'success' })
      setForm({ name: '', email: '', phone: '', password: '', orderText: '' }) // Очищаємо форму
    } catch (e) {
      // Показуємо помилку від бекенду (data.error), якщо вона є
      setMsg({ text: e.response?.data?.error || 'Failed to place order', type: 'error' })
    }
  }

  return (
    <div className="container">
      <h1>Make an Order</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <textarea name="orderText" placeholder="Order details" value={form.orderText} onChange={handleChange} rows={4} required />
        <button type="submit">Submit</button>
      </form>
      {msg.text && <div className={`msg ${msg.type}`}>{msg.text}</div>}
    </div>
  )
}