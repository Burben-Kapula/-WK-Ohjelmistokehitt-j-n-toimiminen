import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { isValidSecretKey, setAdminAccessSession } from '../utils/adminAuth'

/**
 * Secret entry-point component.
 * Accessed via URL: /admin-access/:secretKey
 *
 * If the secret key is valid:
 * - Unlocks admin access in the session
 * - Clears any old/expired auth tokens
 * - Directs the admin to the login page to authenticate freshly
 *
 * If invalid:
 * - Redirects directly to the homepage ("/") without revealing anything
 */
export default function AdminSecretAccess() {
  const { secretKey } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (secretKey && isValidSecretKey(secretKey)) {
      setAdminAccessSession(secretKey)
      // Always clear previous token so the admin logs in freshly each time they use the secret link
      localStorage.removeItem('token')
      navigate('/admin/login', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [secretKey, navigate])

  return null
}
