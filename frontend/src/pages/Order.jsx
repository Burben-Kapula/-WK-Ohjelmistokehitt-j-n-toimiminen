import { useState } from 'react'
import api from '../api'
import '../App.css'

/**
 * Vaihtoehtoinen tilauslomake (/order).
 * Lähettää tilauksen JSON-muodossa backendiin (POST /api/order).
 */
export default function Order() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', orderText: ''
  })
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg({ text: '', type: '' })
    setSubmitting(true)
    try {
      await api.post('/order', form)
      setMsg({ text: 'Tilaus lähetetty onnistuneesti!', type: 'success' })
      setForm({ name: '', email: '', phone: '', password: '', orderText: '' })
    } catch (err) {
      const details = err.response?.data?.details
      const firstDetail = details && Object.values(details).flat()[0]
      setMsg({
        text: firstDetail || err.response?.data?.error || 'Tilauksen lähettäminen epäonnistui.',
        type: 'error'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="order-page">
      <div className="order-page__flag" role="img" aria-label="Suomen lippu">🇫🇮</div>
      <section className="order-page__card">
        <header className="order-page__header">
          <span className="order-page__eyebrow">K.BETONIVEISTOKSET</span>
          <h1>Tee tilaus</h1>
          <p>Kerro millaisen veistoksen toivot. Otamme yhteyttä kahden arkipäivän kuluessa.</p>
        </header>

        <form className="order-page__form" onSubmit={handleSubmit}>
          <div className="order-page__field">
            <label htmlFor="order-name">Nimi *</label>
            <input
              id="order-name"
              name="name"
              placeholder="Etu- ja sukunimi"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="order-page__field">
            <label htmlFor="order-email">Sähköposti *</label>
            <input
              id="order-email"
              name="email"
              type="email"
              placeholder="etunimi@esimerkki.fi"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="order-page__field">
            <label htmlFor="order-phone">Puhelinnumero *</label>
            <input
              id="order-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="040 12345678"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
          </div>

          <div className="order-page__field">
            <label htmlFor="order-password">Salasana *</label>
            <input
              id="order-password"
              name="password"
              type="password"
              placeholder="Vähintään 8 merkkiä"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="order-page__field order-page__field--full">
            <label htmlFor="order-details">Tilaus *</label>
            <textarea
              id="order-details"
              name="orderText"
              placeholder="Kerro toiveistasi: koko, eläin, tyyli, väri ja sijainti..."
              value={form.orderText}
              rows={6}
              required
            />
            <small>Vähintään 10 merkkiä.</small>
          </div>

          {msg.text && <div className={`msg ${msg.type}`} role="status">{msg.text}</div>}

          <button className="order-page__submit" type="submit" disabled={submitting}>
            {submitting ? 'Lähetetään…' : 'Lähetä tilaus →'}
          </button>
        </form>
      </section>
    </main>
  )
}
