import jwt from "jsonwebtoken";

/**
 * Middleware захисту адмінських ендпоінтів.
 * Перевіряє, що запит містить дійсний JWT-токен у заголовку Authorization.
 * Якщо токена немає або він прострочений — запит відхиляється (401).
 * Якщо токен дійсний — пропускає запит далі до контролера.
 */
export const authRequired = (req, res, next) => {
  const header = req.headers.authorization;
  // Токен має бути у форматі "Bearer <токен>"
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  const token = header.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("❗ JWT_SECRET is not configured in backend/.env");
    return res.status(500).json({ error: "Server auth is not configured" });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.admin = payload; // Зберігаємо дані адміна з токена для наступних middleware
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};