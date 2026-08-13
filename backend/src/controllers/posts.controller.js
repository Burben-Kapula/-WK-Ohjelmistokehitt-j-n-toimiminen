import { readPosts, writePosts } from "../utils/posts.storage.js"; // Читання/запис публікацій у файл data/posts.json
import { v4 as uuidv4 } from "uuid"; // Генерація унікального ID для кожної публікації
import fs from "fs"; // Робота з файловою системою (видалення старих зображень)
import path from "path"; // Шляхи до файлів
import { fileURLToPath } from "url"; // Шлях поточного файлу в ES-модулях

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads"); // Папка, де зберігаються завантажені зображення

// Допоміжна функція: формує повну URL-адресу зображення, щоб фронтенд міг його показати
const imageUrl = (req, name) =>
  `${req.protocol}://${req.get("host")}/uploads/${name}`;

/**
 * Отримання списку всіх публікацій (публічний ендпоінт).
 * Додає кожній публікації готову URL-адресу зображення.
 */
export const listPosts = async (req, res) => {
  const posts = await readPosts();
  const enriched = posts.map((p) => ({
    ...p,
    imageUrl: imageUrl(req, p.image),
  }));
  res.json(enriched);
};

/**
 * Створення нової публікації (тільки для адміна).
 * Приймає заголовок, опис і обов'язкове зображення (multipart-форма).
 * Зображення зберігається у папці uploads, а дані публікації — у posts.json.
 */
export const createPost = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file; // Завантажений файл (оброблений multer)
  if (!file) return res.status(400).json({ error: "Image is required" }); // Без картинки публікацію не створюємо

  const newPost = {
    id: uuidv4(),
    title,
    description,
    image: file.filename,
    createdAt: new Date().toISOString(),
  };

  const posts = await readPosts();
  posts.push(newPost); // Додаємо публікацію в кінець списку
  await writePosts(posts); // Зберігаємо список у файл

  res.status(201).json({ ...newPost, imageUrl: imageUrl(req, file.filename) });
};

/**
 * Редагування публікації (тільки для адміна).
 * Можна змінити заголовок, опис і/або зображення.
 * Якщо завантажено нове зображення — старе видаляється з диска.
 */
export const updatePost = async (req, res) => {
  const { id } = req.params; // ID публікації з URL (/:id)
  const { title, description } = req.body;
  const file = req.file; // Нове зображення (необов'язкове)

  const posts = await readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Post not found" }); // Немає такої публікації

  const post = posts[idx];
  // Залишаємо старі значення, якщо нові не передані
  const updated = {
    ...post,
    title: title ?? post.title,
    description: description ?? post.description,
    image: file ? file.filename : post.image,
  };
  posts[idx] = updated;
  await writePosts(posts);

  // Видаляємо старий файл зображення, якщо було завантажено нове
  if (file && post.image !== file.filename) {
    fs.promises.unlink(path.join(uploadDir, post.image)).catch(() => {});
  }

  res.json({ ...updated, imageUrl: imageUrl(req, updated.image) });
};

/**
 * Видалення публікації (тільки для адміна).
 * Прибирає запис з posts.json і видаляє файл зображення з диска.
 */
export const deletePost = async (req, res) => {
  const { id } = req.params;

  const posts = await readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Post not found" });

  const [removed] = posts.splice(idx, 1); // Виймаємо публікацію з масиву
  await writePosts(posts);

  fs.promises.unlink(path.join(uploadDir, removed.image)).catch(() => {}); // Видаляємо зображення (якщо не вийде — ігноруємо)

  res.status(204).end(); // 204 = успішно, без тіла відповіді
};