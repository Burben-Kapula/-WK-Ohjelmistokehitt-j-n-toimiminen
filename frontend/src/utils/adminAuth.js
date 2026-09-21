const ADMIN_SECRET_STORAGE_KEY = 'admin_access_session'

/**
 * Returns the expected admin secret key from environment variables.
 * Fail closed: if VITE_ADMIN_SECRET_KEY is missing, access is denied.
 */
export function getExpectedSecretKey() {
  return import.meta.env.VITE_ADMIN_SECRET_KEY || ''
}

/**
 * Validates a given key against the expected secret key.
 */
export function isValidSecretKey(key) {
  if (!key || typeof key !== 'string') return false
  const expected = getExpectedSecretKey().trim()
  if (!expected) {
    console.warn('Admin secret key is not configured. Set VITE_ADMIN_SECRET_KEY in frontend/.env')
    return false
  }
  return key.trim() === expected
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
