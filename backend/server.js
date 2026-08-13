import "dotenv/config"; // Завантажує змінні середовища з файлу .env (порт, дані адміна, JWT-секрет)
import express from "express"; // Веб-фреймворк для створення HTTP-сервера
import helmet from "helmet"; // Захист HTTP-заголовків (CSP, X-Frame-Options тощо)
import cors from "cors"; // Дозволяє запити з інших доменів (фронтенд)
import rateLimit from "express-rate-limit"; // Обмеження кількості запитів для захисту від атак
import path from "path"; // Робота з шляхами файлів
import { fileURLToPath } from "url"; // Отримання шляху поточного файлу в ES-модулях
import app from "./src/app.js"; // Головний маршрутизатор API (всі ендпоінти)
import { errorHandler } from "./src/middleware/error.middleware.js"; // Глобальний обробник помилок

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000; // Порт, на якому працює сервер (з .env)

const server = express();

// Глобальні middleware безпеки — виконуються для КОЖНОГО запиту
server.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); // cross-origin потрібен, щоб браузер міг завантажувати фото з :3000 на сторінці :5173
server.use(cors({ origin: true, credentials: true })); // Дозволяє CORS-запити з фронтенду
server.use(express.json()); // Парсить JSON-тіло запитів (login тощо)

// Роздача завантажених зображень як статичних файлів: http://localhost:3000/uploads/<файл>
server.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// Rate limiting для всіх публічних маршрутів — не більше 100 запитів за 15 хв з однієї IP-адреси
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 100,                // ліміт запитів на кожну IP-адресу за цей проміжок
  standardHeaders: true,
  legacyHeaders: false,
});
server.use(limiter);

// Підключення головного маршрутизатора: всі API-шляхи починаються з /api
server.use("/api", app);

// Глобальний обробник помилок (останній) — ловить помилки з усіх роутів і повертає JSON-відповідь
server.use(errorHandler);

// Запуск сервера на вказаному порту
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});