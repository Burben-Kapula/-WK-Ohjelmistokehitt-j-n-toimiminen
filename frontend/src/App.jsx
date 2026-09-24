import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Order from './pages/Order'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import AdminSecretAccess from './pages/AdminSecretAccess'
import AdminGuard from './components/AdminGuard'

/**
 * Main application component configuring all client routes.
 *
 * Public routes:
 * - "/" -> Finnish Betoniveistokset landing page
 * - "/order" -> Order placement form
 *
 * Secret Admin routes (accessible ONLY via special admin link):
 * - "/admin-access/:secretKey" -> Secret entry link
 * - "/admin/login" -> Admin login (guarded by AdminGuard)
 * - "/admin" -> Admin dashboard (guarded by AdminGuard with requireAuth)
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/order" element={<Order />} />

        {/* Special Secret Admin Link Gateway */}
        <Route path="/admin-access/:secretKey" element={<AdminSecretAccess />} />

        {/* Protected Admin Routes — accessible ONLY with secret key authorization */}
        <Route
          path="/admin/login"
          element={
            <AdminGuard>
              <AdminLogin />
            </AdminGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminGuard requireAuth>
              <AdminPanel />
            </AdminGuard>
          }
        />

        {/* Redirect unknown routes back to home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )

  
}

