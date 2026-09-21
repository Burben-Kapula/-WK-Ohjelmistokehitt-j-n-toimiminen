import { Navigate } from 'react-router-dom'
import { hasAdminAccessSession } from '../utils/adminAuth'

/**
 * Route guard that ensures only users accessing via the secret admin key
 * can view admin pages (AdminLogin and AdminPanel).
 *
 * The secret is accepted ONLY through the /admin-access/:secretKey path.
 * The old ?key=... query form was removed because it leaks the secret into
 * browser history, referrers and server logs.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.requireAuth] - If true, also requires a valid JWT token (for AdminPanel)
 */
export default function AdminGuard({ children, requireAuth = false }) {
  // 1. First layer: Secret Link Check
  // If the user doesn't have the secret key session, bounce them to Home page immediately
  if (!hasAdminAccessSession()) {
    return <Navigate to="/" replace />
  }

  // 2. Second layer: JWT Token check for protected admin actions (AdminPanel)
  if (requireAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return <Navigate to="/admin/login" replace />
    }
  }

  return children
}
