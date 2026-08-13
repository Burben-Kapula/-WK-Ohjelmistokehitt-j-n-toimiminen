import { z } from "zod"; // Бібліотека опису схем даних та їх валідації

/**
 * Схема валідації створення публікації (POST /api/posts).
 * Заголовок: 3–100 символів, опис: 10–2000 символів.
 */
export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(2000),
  }),
});

/**
 * Схема валідації редагування публікації (PUT /api/posts/:id).
 * Поля необов'язкові — можна змінити лише те, що передали.
 */
export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(2000).optional(),
  }),
});