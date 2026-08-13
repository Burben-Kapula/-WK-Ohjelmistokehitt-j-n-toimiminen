/**
 * Прийом замовлення від відвідувача (публічний ендпоінт).
 * Наразі замовлення ніде не зберігається — тільки логується у консолі
 * (пароль відвідувача навмисно не логується, щоб не світити чутливі дані).
 * Тут можна підключити збереження в БД або відправку на email.
 */
export const createOrder = (req, res) => {
  const { name, email, phone, orderText } = req.body;
  console.log("📦 New order (sanitized):", { name, email, phone, orderTextLength: orderText.length });
  res.status(201).json({ message: "Order received successfully" });
};