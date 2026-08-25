import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { clearAdminSession } from '../utils/adminAuth'
import '../styles/admin.css'

export default function AdminPanel() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({ title: '', description: '', image: null })
  const [editingId, setEditingId] = useState(null)
  const [posts, setPosts] = useState([])
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  const handleUnauthorized = () => {
    localStorage.removeItem('token')
    navigate('/admin/login', { replace: true })
  }

  const loadPosts = () => {
    api.get('/posts')
      .then(r => setPosts(r.data))
      .catch(err => {
        if (err.response?.status === 401) {
          handleUnauthorized()
        } else {
          setMsg({ text: 'Julkaisuja ei voitu ladata. Yritä uudelleen.', type: 'error' })
        }
      })
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      handleUnauthorized()
    } else {
      loadPosts()
    }
  }, [navigate])

  const handleChange = e => {
    if (e.target.type === 'file') setForm({ ...form, image: e.target.files[0] })
    else setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg({ text: '', type: '' })

    if (!editingId && !form.image) {
      setMsg({ text: 'Valitse kuva ennen julkaisemista.', type: 'error' })
      return
    }

    setLoading(true)
    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('description', form.description.trim())
    if (form.image) fd.append('image', form.image)

    try {
      if (editingId) {
        await api.put(`/posts/${editingId}`, fd)
        setMsg({ text: 'Veistos päivitetty onnistuneesti! ✅', type: 'success' })
      } else {
        await api.post('/posts', fd)
        setMsg({ text: 'Uusi veistos julkaistu! ✅', type: 'success' })
      }
      setForm({ title: '', description: '', image: null })
      if (fileInputRef.current) fileInputRef.current.value = ''
      setEditingId(null)
      loadPosts()
    } catch (err) {
      if (err.response?.status === 401) { handleUnauthorized(); return }
      let errorText = err.response?.data?.error || 'Tallennus epäonnistui'
      if (err.response?.data?.details) {
        const fieldMsgs = Object.entries(err.response.data.details)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ')
        if (fieldMsgs) errorText = `${errorText}: ${fieldMsgs}`
      }
      setMsg({ text: errorText, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const startEdit = p => {
    setEditingId(p.id)
    setForm({ title: p.title, description: p.description, image: null })
    if (fileInputRef.current) fileInputRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ title: '', description: '', image: null })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async p => {
    if (!window.confirm(`Poistetaanko veistos "${p.title}"?`)) return
    try {
      await api.delete(`/posts/${p.id}`)
      setMsg({ text: 'Veistos poistettu.', type: 'success' })
      loadPosts()
    } catch (err) {
      if (err.response?.status === 401) { handleUnauthorized(); return }
      setMsg({ text: err.response?.data?.error || 'Poistaminen epäonnistui', type: 'error' })
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  const lockSession = () => {
    clearAdminSession()
    navigate('/', { replace: true })
  }

  return (
    <div className="ap-page">

      {/* ── Top bar ── */}
      <header className="ap-header">
        <div className="ap-header-left">
          <span className="ap-logo">🗿</span>
          <div>
            <div className="ap-header-title">Hallintapaneeli</div>
            <div className="ap-header-sub">K.Betoniveistokset</div>
          </div>
        </div>
        <div className="ap-header-actions">
          <Link to="/" className="ap-header-link">← Etusivu</Link>
          <button className="ap-btn ap-btn-ghost" onClick={logout}>Kirjaudu ulos</button>
        </div>
      </header>

      <main className="ap-main">

        {/* ── Alert message ── */}
        {msg.text && (
          <div className={`ap-alert ap-alert--${msg.type}`}>
            <span>{msg.type === 'error' ? '⚠️' : '✅'}</span>
            <span>{msg.text}</span>
            <button className="ap-alert-close" onClick={() => setMsg({ text: '', type: '' })}>✕</button>
          </div>
        )}

        {/* ── Form card ── */}
        <section className="ap-card">
          <h2 className="ap-card-title">
            {editingId ? '✏️  Muokkaa veistosta' : '➕  Lisää uusi veistos'}
          </h2>

          <form onSubmit={handleSubmit} className="ap-form">
            <div className="ap-field">
              <label className="ap-label" htmlFor="ap-title">Nimi</label>
              <input
                id="ap-title"
                name="title"
                className="ap-input"
                placeholder="esim. Karhuveistos 120 cm"
                value={form.title}
                onChange={handleChange}
                minLength={3}
                maxLength={100}
                required
              />
            </div>

            <div className="ap-field">
              <label className="ap-label" htmlFor="ap-desc">Kuvaus</label>
              <textarea
                id="ap-desc"
                name="description"
                className="ap-textarea"
                placeholder="Kerro veistoksen materiaaleista, koosta, väristä..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                minLength={10}
                maxLength={2000}
                required
              />
            </div>

            <div className="ap-field">
              <label className="ap-label" htmlFor="ap-image">
                {editingId ? 'Vaihda kuva (valinnainen)' : 'Kuva *'}
              </label>
              <input
                id="ap-image"
                ref={fileInputRef}
                type="file"
                name="image"
                className="ap-input ap-file"
                accept="image/*"
                onChange={handleChange}
                required={!editingId}
              />
              <p className="ap-hint">JPG, PNG tai WebP · max. 10 MB</p>
            </div>

            <div className="ap-form-actions">
              <button type="submit" className="ap-btn ap-btn-primary" disabled={loading}>
                {loading ? 'Tallennetaan...' : editingId ? '💾  Tallenna muutokset' : '🚀  Julkaise veistos'}
              </button>
              {editingId && (
                <button type="button" className="ap-btn ap-btn-ghost" onClick={cancelEdit}>
                  Peruuta
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ── Posts list ── */}
        <section className="ap-card">
          <div className="ap-card-head">
            <h2 className="ap-card-title">🖼️  Julkaistut veistokset ({posts.length})</h2>
            <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={loadPosts} type="button">
              🔄 Päivitä
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="ap-empty">
              <span>Ei vielä julkaisuja.</span>
              <span>Lisää ensimmäinen veistos yllä olevalla lomakkeella.</span>
            </div>
          ) : (
            <ul className="ap-grid">
              {posts.map((p, idx) => (
                <li key={p.id || idx} className="ap-post-card">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="ap-post-img" />
                  ) : (
                    <div className="ap-post-img ap-post-img--empty">Ei kuvaa</div>
                  )}
                  <div className="ap-post-body">
                    <h3 className="ap-post-title">{p.title}</h3>
                    <p className="ap-post-desc">{p.description}</p>
                    <div className="ap-post-actions">
                      <button
                        type="button"
                        className="ap-btn ap-btn-secondary"
                        onClick={() => startEdit(p)}
                      >
                        ✏️  Muokkaa
                      </button>
                      <button
                        type="button"
                        className="ap-btn ap-btn-danger"
                        onClick={() => handleDelete(p)}
                      >
                        🗑️  Poista
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>
    </div>
  )
}
