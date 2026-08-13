import { z } from "zod"; // Бібліотека опису схем даних та їх валідації

/**
 * Схема валідації входу адміна (POST /api/auth/login).
 * Email має бути коректним, пароль — не порожнім рядком.
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});