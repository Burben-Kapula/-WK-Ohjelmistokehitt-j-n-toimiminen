import express from "express";
import authRoutes from "./routes/auth.routes.js"; // Роути авторизації адміна (вхід у систему)
import postsRoutes from "./routes/posts.routes.js"; // Роути публікацій (створення, редагування, видалення, перегляд)
import orderRoutes from "./routes/order.routes.js"; // Роути замовлень від відвідувачів

const router = express.Router();

// Головний маршрутизатор: об'єднує всі групи роутів під префіксом /api
router.use("/auth", authRoutes);   // → /api/auth/login
router.use("/posts", postsRoutes); // → /api/posts
router.use("/order", orderRoutes); // → /api/order

export default router;