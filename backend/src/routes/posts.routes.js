import express from "express";
import { listPosts, createPost, updatePost, deletePost } from "../controllers/posts.controller.js";
import { authRequired } from "../middleware/auth.middleware.js"; // Захист: потрібен токен адміна
import { uploadSingle } from "../middleware/upload.middleware.js"; // Обробка завантаження зображення
import { validate } from "../middleware/validate.middleware.js"; // Валідація даних
import { createPostSchema, updatePostSchema } from "../validators/posts.validator.js"; // Схеми для створення/редагування

const router = express.Router();

// Публічний ендпоінт: GET /api/posts — список усіх публікацій (без токена)
router.get("/", listPosts);

// Адмінські ендпоінти (multipart/form-data: title, description, image):
// POST /api/posts — створення нової публікації (зображення обов'язкове)
router.post(
  "/",
  authRequired,          // спочатку перевіряємо токен адміна
  uploadSingle("image"), // потім приймаємо файл зображення
  validate(createPostSchema), // потім валідуємо title/description
  createPost             // і лише тоді зберігаємо публікацію
);

// PUT /api/posts/:id — редагування публікації (зображення необов'язкове)
router.put(
  "/:id",
  authRequired,
  uploadSingle("image"),
  validate(updatePostSchema),
  updatePost
);

// DELETE /api/posts/:id — видалення публікації разом зі зображенням
router.delete("/:id", authRequired, deletePost);

export default router;