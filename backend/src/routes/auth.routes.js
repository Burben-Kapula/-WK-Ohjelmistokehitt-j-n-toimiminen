import express from "express";
import { login } from "../controllers/auth.controller.js"; // Контролер входу адміна
import { validate } from "../middleware/validate.middleware.js"; // Валідація вхідних даних
import { loginSchema } from "../validators/auth.validator.js"; // Схема: email + пароль

const router = express.Router();

// POST /api/auth/login — вхід адміна (email і пароль у JSON-тілі)
router.post("/login", validate(loginSchema), login);

export default router;