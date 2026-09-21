import bcrypt from "bcryptjs"; // Бібліотека для порівняння пароля з хешем (не зберігаємо пароль у відкритому вигляді)
import jwt from "jsonwebtoken"; // Бібліотека для створення JWT-токена (підтверджує, що користувач — адмін)

/**
 * Вхід адміна в систему.
 * Приймає email і пароль з тіла запиту, перевіряє їх проти даних у .env
 * і у разі успіху повертає JWT-токен, який фронтенд зберігає і надсилає
 * з кожним наступним запитом до захищених ендпоінтів.
 *
 * Дані беруться ТІЛЬКИ з .env. Якщо вони не задані — вхід заборонено
 * (fail closed), щоб у проєкті не було робочих паролів/секретів за замовчуванням.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminEmail || !adminHash || !jwtSecret) {
    console.error(
      "❗ Admin auth is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and JWT_SECRET in backend/.env"
    );
    return res.status(500).json({ error: "Server auth is not configured" });
  }

  // ADMIN_PASSWORD_HASH має бути bcrypt-хешем, а не паролем у відкритому вигляді
  if (!/^\$2[aby]\$\d{2}\$/.test(adminHash)) {
    console.error(
      "❗ ADMIN_PASSWORD_HASH is not a valid bcrypt hash. Generate one with bcrypt — never put the plaintext password here."
    );
    return res.status(500).json({ error: "Server auth is not configured" });
  }

  // Якщо email не збігається — повертаємо однакову помилку, щоб не підказувати, що саме невірне
  if (email?.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // Порівнюємо введений пароль із збереженим хешем
  const ok = await bcrypt.compare(password, adminHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Створюємо підписаний токен, який діє заданий час (JWT_EXPIRES_IN)
  const token = jwt.sign({ email }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
  // Забороняємо браузеру кешувати відповідь з токеном
  res.set("Cache-Control", "no-store");
  res.json({ token });
};
