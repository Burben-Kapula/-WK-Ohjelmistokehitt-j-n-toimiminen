import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

/**
 * Головна сторінка — показує всі публікації.
 * Завантажує список із бекенду (GET /api/posts) при відкритті сторінки.
 */
export default function Home() {
  const [posts, setPosts] = useState([]) // Список публікацій
  const [err, setErr] = useState('') // Повідомлення про помилку завантаження

  // Виконуємо запит лише один раз після монтування компонента
  useEffect(() => {
    api.get('/posts')
      .then(r => setPosts(r.data))
      .catch(() => setErr('Failed to load posts'))
  }, [])

  return (
    <div className="container">
      {/* Навігація по сайту */}
      <nav className="nav">
        <Link to="/order">Make Order</Link>
        <Link to="/admin/login">Admin Login</Link>
      </nav>

      <h1>Publications</h1>

      {err && <div className="msg error">{err}</div>}

      {/* Список публікацій: заголовок, опис, зображення */}
      <ul>
        {posts.map(p => (
          <li key={p.id} className="post">
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.title} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}