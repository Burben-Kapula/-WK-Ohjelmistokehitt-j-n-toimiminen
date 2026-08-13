import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

/**
 * Панель керування адміна.
 * Дозволяє: створювати публікації, редагувати наявні, видаляти їх,
 * а також переглядати список усіх публікацій.
 * Доступ захищено токеном (без нього — редирект на сторінку входу).
 */
export default function AdminPanel() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', image: null }) // Поля форми створення/редагування
  const [editingId, setEditingId] = useState(null) // ID публікації, яку зараз редагуємо (null = створення нової)
  const [posts, setPosts] = useState([]) // Список публікацій для панелі
  const [msg, setMsg] = useState({ text: '', type: '' }) // Повідомлення про результат операції

  // Завантаження списку публікацій з бекенду (GET /api/posts)
  const loadPosts = () => {
    api.get('/posts')
      .then(r => setPosts(r.data))
      .catch(() => setMsg({ text: 'Failed to load posts', type: 'error' }))
  }

  // При відкритті сторінки: якщо немає токена — на вхід, інакше завантажуємо публікації
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/admin/login')
    else loadPosts()
  }, [navigate])

  // Оновлення поля форми: файл зберігаємо окремо, решту — за іменем поля
  const handleChange = e => {
    if (e.target.type === 'file') setForm({ ...form, image: e.target.files[0] })
    else setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Створення нової або збереження редагованої публікації
  const handleSubmit = async e => {
    e.preventDefault()
    setMsg({ text: '', type: '' })
    // Формуємо multipart-дані: поля тексту + необов'язкове зображення
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    if (form.image) fd.append('image', form.image)

    try {
      if (editingId) {
        // Режим редагування: PUT /api/posts/:id
        await api.put(`/posts/${editingId}`, fd)
        setMsg({ text: 'Post updated!', type: 'success' })
      } else {
        // Режим створення: POST /api/posts
        await api.post('/posts', fd)
        setMsg({ text: 'Post created!', type: 'success' })
      }
      setForm({ title: '', description: '', image: null }) // Очищаємо форму
      setEditingId(null)
      loadPosts() // Оновлюємо список
    } catch (err) {
      // Показуємо справжню помилку від бекенду
      setMsg({ text: err.response?.data?.error || 'Failed to save post', type: 'error' })
    }
  }

  // Початок редагування: заповнюємо форму даними публікації
  const startEdit = p => {
    setEditingId(p.id)
    setForm({ title: p.title, description: p.description, image: null })
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Прокрутка до форми
  }

  // Відміна редагування: повертаємося до режиму створення
  const cancelEdit = () => {
    setEditingId(null)
    setForm({ title: '', description: '', image: null })
  }

  // Видалення публікації (з підтвердженням у діалозі)
  const handleDelete = async p => {
    if (!window.confirm(`Delete "${p.title}"?`)) return
    try {
      await api.delete(`/posts/${p.id}`)
      setMsg({ text: 'Post deleted', type: 'success' })
      loadPosts()
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to delete post', type: 'error' })
    }
  }

  // Вихід із панелі: видаляємо токен і повертаємось на сторінку входу
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  return (
    <div className="container">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <h1>Admin Panel</h1>
        <div style={{ display:'flex', gap:'10px' }}>
          <Link to="/" className="btn">Back to Publications</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {msg.text && <div className={`msg ${msg.type}`}>{msg.text}</div>}

      {/* Форма: створення або редагування (заголовок змінюється залежно від режиму) */}
      <h2>{editingId ? 'Edit Post' : 'Create Post'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} required />
        {/* При редагуванні файл необов'язковий — можна залишити старе зображення */}
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <div style={{ display:'flex', gap:'10px' }}>
          <button type="submit">{editingId ? 'Save Changes' : 'Create Post'}</button>
          {editingId && <button type="button" onClick={cancelEdit} style={{ background:'#888' }}>Cancel</button>}
        </div>
      </form>

      {/* Список публікацій з кнопками редагування і видалення */}
      <h2>Posts</h2>
      <ul>
        {posts.map(p => (
          <li key={p.id} className="post">
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ maxHeight:'120px', width:'auto' }} />}
            <div style={{ display:'flex', gap:'10px', marginTop:'10px' }}>
              <button type="button" onClick={() => startEdit(p)}>Edit</button>
              <button type="button" onClick={() => handleDelete(p)} style={{ background:'#cc0000' }}>Delete</button>
            </div>
          </li>
        ))}
        {posts.length === 0 && <li>No posts yet.</li>}
      </ul>
    </div>
  )
}
