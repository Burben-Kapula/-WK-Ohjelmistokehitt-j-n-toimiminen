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
    return res.status(401).json({ error: "Authorization-otsake puuttuu tai on virheellinen" });
  }
  const token = header.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("❗ JWT_SECRET is not configured in backend/.env");
    return res.status(500).json({ error: "Palvelimen kirjautumisasetukset puuttuvat" });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.admin = payload; // Зберігаємо дані адміна з токена для наступних middleware
    next();
  } catch (err) {
    return res.status(401).json({ error: "Virheellinen tai vanhentunut tunnus" });
  }
};