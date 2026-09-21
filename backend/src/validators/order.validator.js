import { z } from "zod"; // Бібліотека опису схем даних та їх валідації

// Регулярний вираз для телефона: цифри, пробіли, + і - (від 7 до 20 символів)
const phoneRegex = /^[\d\s+\-]{7,20}$/;

/**
 * Схема валідації замовлення.
 * Описує, яким має бути тіло запиту POST /api/order.
 * Якщо будь-яке поле не відповідає правилам — запит відхиляється з 400.
 */
export const orderSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2).max(50) // ім'я: від 2 до 50 символів
      .regex(/^[A-Za-zА-Яа-яЇїІіЄє\s\-]+$/, "Name may contain only letters, spaces, hyphens"), // тільки літери/пробіли/дефіс
    email: z.string().email(), // має бути коректний email
    phone: z.string().regex(phoneRegex, "Invalid phone format"),
    password: z.string()
      .min(8) // пароль не коротший за 8 символів
      .regex(/(?=.*[A-Za-z])(?=.*\d)/, "Password must contain at least one letter and one number"), // має містити літеру і цифру
    orderText: z.string().min(10).max(1000), // текст замовлення: від 10 до 1000 символів
  }),
});

/**
 * Схема замовлення з головного лендінгу (POST /api/order-request).
 * Поля надходять як multipart/form-data (разом з необов'язковими файлами).
 */
export const orderRequestSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().regex(phoneRegex, "Invalid phone format"),
    description: z.string().min(10).max(2000),
  }),
});