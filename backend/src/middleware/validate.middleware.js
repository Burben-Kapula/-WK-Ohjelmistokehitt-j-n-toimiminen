import fs from "fs";

/**
 * Middleware валідації даних запиту через Zod-схеми.
 * Перевіряє body/query/params за схемою роута; якщо дані невірні —
 * повертає 400 з описом помилок, інакше підставляє валідовані дані в req.
 * Потрібен, щоб контролери не отримували биті/шкідливі дані.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });
  if (!result.success) {
    // Видаляємо завантажений файл, якщо валідація полів форми не пройшла
    if (req.file?.path) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }
    const messages = result.error.flatten().fieldErrors;
    return res.status(400).json({ error: "Validation failed", details: messages });
  }
  // Перезаписуємо лише ті частини, що є в схемі (щоб не загубити req.params, якщо схема його не описує)
  if (result.data.body) req.body = result.data.body;
  if (result.data.query) req.query = result.data.query;
  if (result.data.params) req.params = result.data.params;
  next();
};