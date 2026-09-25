import { sendOrderEmail } from "../utils/mailer.js";

/**
 * Прийом замовлення від відвідувача (публічний ендпоінт, /api/order).
 * Дані формуються у лист і надсилаються адміністратору через Resend.
 * Пароль відвідувача навмисно не логується і не потрапляє в лист.
 */
export const createOrder = async (req, res, next) => {
  const { name, email, phone, orderText } = req.body;

  try {
    await sendOrderEmail({
      subject: `Uusi tilaus: ${name}`,
      replyTo: email,
      fields: {
        Nimi: name,
        Sähköposti: email,
        Puhelin: phone,
        Tilaus: orderText,
      },
    });
  } catch (err) {
    return next(err);
  }

  console.log("📦 New order received:", { name, email, phone, orderTextLength: orderText.length });
  res.status(201).json({ message: "Tilaus vastaanotettu onnistuneesti" });
};

/**
 * Прийом замовлення з головного лендінгу (/api/order/request).
 * Поля: firstName, lastName, email, phone, description + необов'язкові файли.
 * Надсилає лист адміністратору, файли додає як вкладення.
 */
export const createOrderRequest = async (req, res, next) => {
  const { firstName, lastName, email, phone, description } = req.body;

  // Файли з multer (memoryStorage) перетворюємо у вкладення Resend
  const attachments = (req.files || []).map((file) => ({
    filename: file.originalname,
    content: file.buffer.toString("base64"),
  }));

  try {
    await sendOrderEmail({
      subject: `Uusi tilauspyyntö: ${firstName} ${lastName}`.trim(),
      replyTo: email,
      fields: {
        Etunimi: firstName,
        Sukunimi: lastName,
        Sähköposti: email,
        Puhelin: phone,
        "Millaisen veistoksen toivot": description,
        "Liitetiedostoja": attachments.length,
      },
      attachments,
    });
  } catch (err) {
    return next(err);
  }

  console.log("📦 New order request received:", { firstName, lastName, email, phone, files: attachments.length });
  res.status(201).json({ message: "Tilauspyyntö vastaanotettu onnistuneesti" });
};
