import fs from "fs"; // Робота з файловою системою
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, "../../data/posts.json"); // Файл, де зберігаються всі публікації

// Якщо файлу ще немає — створюємо його з порожнім масивом
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

/**
 * Читання списку публікацій з файлу.
 * Це просте файлове "сховище" замість бази даних — усе працює без БД.
 */
export const readPosts = async () => {
  const raw = await fs.promises.readFile(dataPath, "utf-8");
  return JSON.parse(raw);
};

/**
 * Запис списку публікацій у файл (у форматі JSON).
 * Викликається після кожної зміни: створення, редагування, видалення.
 */
export const writePosts = async (posts) => {
  await fs.promises.writeFile(dataPath, JSON.stringify(posts, null, 2), "utf-8");
};