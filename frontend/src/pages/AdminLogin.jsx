import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import '../styles/admin.css'

/**
 * Windows Vista Aero styled Admin Logon Screen.
 * Accessible only through the special admin secret link.
 */
export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      navigate('/admin')
    } catch (e) {
      setErr(e.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="vista-layout">
      {/* Aero Glass Window */}
      <div className="vista-window vista-window-small">
        {/* Titlebar */}
        <div className="vista-titlebar">
          <div className="vista-title-left">
            <span style={{ fontSize: '15px' }}>🛡️</span>
            <span className="vista-title-text">Windows Security - Administrator Logon</span>
          </div>
          <div className="vista-controls">
            <button className="vista-btn-control" type="button">_</button>
            <button className="vista-btn-control" type="button">□</button>
            <button className="vista-btn-control vista-btn-close" type="button" onClick={() => navigate('/')}>✕</button>
          </div>
        </div>

        {/* Window Body */}
        <div className="vista-body">
          <div className="vista-logon-card">
            {/* Glossy Circular Avatar */}
            <div className="vista-user-avatar">
              👤
            </div>

            <h1 className="vista-logon-name">Administrator</h1>
            <div className="vista-logon-sub">K.BETONIVEISTOKSET · Control Panel</div>

            {err && (
              <div className="vista-msg error" style={{ textAlign: 'left' }}>
                <span>⚠️</span>
                <span>{err}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className="vista-form">
              <div style={{ textAlign: 'left' }}>
                <label className="vista-label" htmlFor="vista-email">
                  Admin Email
                </label>
                <input
                  id="vista-email"
                  name="email"
                  type="email"
                  className="vista-input"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label className="vista-label" htmlFor="vista-password">
                  Password
                </label>
                <div className="vista-input-row">
                  <input
                    id="vista-password"
                    name="password"
                    type="password"
                    className="vista-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="submit"
                    className="vista-submit-circle"
                    disabled={loading}
                    title="Log In"
                  >
                    {loading ? '…' : '➔'}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <button
                  type="submit"
                  className="vista-btn vista-btn-primary"
                  style={{ width: '100%', height: '32px' }}
                  disabled={loading}
                >
                  {loading ? 'Logging on...' : 'Log On to System'}
                </button>
              </div>
            </form>

            <div className="vista-logon-footer">
              <span>Windows Vista™ Ultimate</span> · <span>Protected Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}