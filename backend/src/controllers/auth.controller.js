import bcrypt from "bcryptjs"; // Бібліотека для порівняння пароля з хешем (не зберігаємо пароль у відкритому вигляді)
import jwt from "jsonwebtoken"; // Бібліотека для створення JWT-токена (підтверджує, що користувач — адмін)

/**
 * Вхід адміна в систему.
 * Приймає email і пароль з тіла запиту, перевіряє їх проти даних у .env
 * і у разі успіху повертає JWT-токен, який фронтенд зберігає і надсилає
 * з кожним наступним запитом до захищених ендпоінтів.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  // Дані адміна беруться з .env — саме тут вказується, хто може увійти
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  // Якщо email не збігається — повертаємо однакову помилку, щоб не підказувати, що саме невірне
  if (email !== adminEmail) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // Порівнюємо введений пароль із збереженим хешем
  const ok = await bcrypt.compare(password, adminHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Створюємо підписаний токен, який діє заданий час (JWT_EXPIRES_IN)
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
  // Забороняємо браузеру кешувати відповідь з токеном
  res.set("Cache-Control", "no-store");
  res.json({ token });
};