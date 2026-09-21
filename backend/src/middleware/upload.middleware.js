import multer from "multer"; // Бібліотека для обробки завантаження файлів (multipart/form-data)
import path from "path";
import { fileURLToPath } from "url";

import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads"); // Папка збереження зображень

// Автоматично створюємо папку uploads, якщо вона відсутня
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Налаштування зберігання файлів на диску
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir), // Куди зберігати файл
  filename: (req, file, cb) => {
    // Унікальна назва файлу: час + випадкове число + розширення (щоб не було колізій імен)
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

// Дозволені типи зображень, взяті з .env (за замовчуванням JPEG, PNG, WebP)
const allowed = (process.env.ALLOWED_MIME_TYPES || "image/jpeg,image/png,image/webp")
  .split(",")
  .map((s) => s.trim());

// Фільтр файлів: відхиляє всі файли, тип яких не в списку дозволених
const fileFilter = (req, file, cb) => {
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported file type"), false);
};

// Максимальний розмір файлу з .env (за замовчуванням 5 МБ)
const maxSize = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;

/**
 * Готовий middleware завантаження одного зображення з поля форми (fieldName).
 * Використовується в роутах створення/редагування публікацій.
 */
export const uploadSingle = (fieldName) =>
  multer({ storage, fileFilter, limits: { fileSize: maxSize } }).single(fieldName);

// Дозволені типи файлів у формі замовлення з лендінгу (зображення + PDF)
const orderAllowed = ["image/jpeg", "image/png", "application/pdf"];

// Файли замовлення тримаємо в пам'яті — вони одразу йдуть у лист, на диск не зберігаються
const orderFileFilter = (req, file, cb) => {
  if (orderAllowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported file type"), false);
};

/**
 * Middleware завантаження файлів форми замовлення (поле "files", до 5 файлів).
 * Дані залишаються в req.files[].buffer і додаються до листа.
 */
export const uploadOrderFiles = multer({
  storage: multer.memoryStorage(),
  fileFilter: orderFileFilter,
  limits: { fileSize: maxSize, files: 5 },
}).array("files", 5);