import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import '../styles/admin.css'

/**
 * Ylläpidon kirjautumisnäkymä.
 * Saavutettavissa vain salaisen ylläpitos linkin kautta.
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
      setErr(e.response?.data?.error || 'Kirjautuminen epäonnistui. Tarkista tunnukset.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="vista-layout">
      <div className="vista-window vista-window-small">
        <div className="vista-titlebar">
          <div className="vista-title-left">
            <span aria-hidden="true">🛡️</span>
            <span className="vista-title-text">Ylläpito – kirjautuminen</span>
          </div>
          <div className="vista-controls">
            <button className="vista-btn-control" type="button" aria-label="Pienennä">_</button>
            <button className="vista-btn-control" type="button" aria-label="Suurenna">□</button>
            <button className="vista-btn-control vista-btn-close" type="button" onClick={() => navigate('/')} aria-label="Sulje">✕</button>
          </div>
        </div>

        <div className="vista-body">
          <div className="vista-logon-card">
            <div className="vista-user-avatar" aria-hidden="true">👤</div>

            <h1 className="vista-logon-name">Ylläpitäjä</h1>
            <div className="vista-logon-sub">K.BETONIVEISTOKSET · Ohjauskeskus</div>

            {err && (
              <div className="vista-msg error" style={{ textAlign: 'left' }} role="alert">
                <span>⚠️</span>
                <span>{err}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className="vista-form">
              <div style={{ textAlign: 'left' }}>
                <label className="vista-label" htmlFor="vista-email">
                  Ylläpidon sähköposti
                </label>
                <input
                  id="vista-email"
                  name="email"
                  type="email"
                  className="vista-input"
                  placeholder="yllapito@esimerkki.fi"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label className="vista-label" htmlFor="vista-password">
                  Salasana
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
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="submit"
                    className="vista-submit-circle"
                    disabled={loading}
                    title="Kirjaudu"
                    aria-label="Kirjaudu"
                  >
                    {loading ? '…' : '➔'}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <button
                  type="submit"
                  className="vista-btn vista-btn-primary"
                  style={{ width: '100%', height: '44px' }}
                  disabled={loading}
                >
                  {loading ? 'Kirjaudutaan…' : 'Kirjaudu järjestelmään'}
                </button>
              </div>
            </form>

            <div className="vista-logon-footer">
              <span>Ylläpitäjätila</span> · <span>Suojattu yhteys</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
