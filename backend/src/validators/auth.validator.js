import { z } from "zod";

/**
 * Схема валідації входу адміна (POST /api/auth/login).
 * Повідомлення про помилки повертаються клієнту suomeksi.
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Anna kelvollinen sähköpostiosoite."),
    password: z.string().min(1, "Anna salasana."),
  }),
});
