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
  try {
    // Перевіряємо підпис і термін дії токена за допомогою JWT_SECRET
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload; // Зберігаємо дані адміна з токена для наступних middleware
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};