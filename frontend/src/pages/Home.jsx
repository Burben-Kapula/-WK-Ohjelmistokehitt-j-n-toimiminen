import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import '../App.css'

/**
 * Yksinkertainen teoslista. Tätä sivua ei tällä hetkellä käytetä
 * varsinaisessa sovelluksessa, mutta sen teksti on pidetty suomeksi.
 */
export default function Home() {
  const [posts, setPosts] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    api.get('/posts')
      .then(r => setPosts(r.data))
      .catch(() => setErr('Teosten lataaminen epäonnistui.'))
  }, [])

  return (
    <div className="container">
      <nav className="nav">
        <Link to="/order">Tee tilaus</Link>
      </nav>

      <h1>Teokset</h1>

      {err && <div className="msg error">{err}</div>}

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
