import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home' // Головна сторінка зі списком публікацій
import Order from './pages/Order' // Сторінка оформлення замовлення
import AdminLogin from './pages/AdminLogin' // Вхід адміна
import AdminPanel from './pages/AdminPanel' // Панель керування адміна (публікації)
import './index.css'

/**
 * Головний компонент застосунку — налаштовує маршрутизацію.
 * Кожен маршрут відповідає одній сторінці, яку бачить користувач у браузері.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Головна: всі публікації */}
        <Route path="/order" element={<Order />} /> {/* Форма замовлення */}
        <Route path="/admin/login" element={<AdminLogin />} /> {/* Вхід для адміна */}
        <Route path="/admin" element={<AdminPanel />} /> {/* Панель адміна */}
      </Routes>
    </BrowserRouter>
  )
}