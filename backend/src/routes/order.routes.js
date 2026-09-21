import express from "express";
import { createOrder, createOrderRequest } from "../controllers/order.controller.js"; // Контролери прийому замовлень
import { uploadOrderFiles } from "../middleware/upload.middleware.js"; // Файли форми замовлення (в пам'ять)
import { validate } from "../middleware/validate.middleware.js"; // Валідація даних форми
import { orderSchema, orderRequestSchema } from "../validators/order.validator.js"; // Схеми замовлень

const router = express.Router();

// POST /api/order — прийом замовлення відвідувача (JSON, надсилається листом)
router.post("/", validate(orderSchema), createOrder);

// POST /api/order/request — замовлення з головного лендінгу (multipart/form-data + файли)
router.post(
  "/request",
  uploadOrderFiles,             // спочатку приймаємо файли й поля форми
  validate(orderRequestSchema), // потім валідуємо текстові поля
  createOrderRequest            // і надсилаємо лист
);

export default router;
