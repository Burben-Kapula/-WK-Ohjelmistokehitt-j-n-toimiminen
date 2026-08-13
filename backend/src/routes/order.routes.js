import express from "express";
import { createOrder } from "../controllers/order.controller.js"; // Контролер прийому замовлення
import { validate } from "../middleware/validate.middleware.js"; // Валідація даних форми
import { orderSchema } from "../validators/order.validator.js"; // Схема замовлення

const router = express.Router();

// POST /api/order — прийом замовлення від відвідувача (публічно, без збереження)
router.post("/", validate(orderSchema), createOrder);

export default router;