const ADMIN_SECRET_STORAGE_KEY = 'admin_access_session'

/**
 * Returns the expected admin secret key from environment variables
 * or defaults to the fallback secret.
 */
export function getExpectedSecretKey() {
  return import.meta.env.VITE_ADMIN_SECRET_KEY || 'betoni-admin-secret-2026'
}

/**
 * Validates a given key against the expected secret key.
 */
export function isValidSecretKey(key) {
  if (!key || typeof key !== 'string') return false
  return key.trim() === getExpectedSecretKey().trim()
}

/**
 * Marks the current browser session as authorized for admin access.
 */
export function setAdminAccessSession(key) {
  if (isValidSecretKey(key)) {
    sessionStorage.setItem(ADMIN_SECRET_STORAGE_KEY, key.trim())
    return true
  }
  return false
}

/**
 * Checks if the current session has valid secret key authorization.
 */
export function hasAdminAccessSession() {
  const storedKey = sessionStorage.getItem(ADMIN_SECRET_STORAGE_KEY)
  return isValidSecretKey(storedKey)
}

/**
 * Clears both the admin session key and auth JWT token.
 */
export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SECRET_STORAGE_KEY)
  localStorage.removeItem('token')
}
