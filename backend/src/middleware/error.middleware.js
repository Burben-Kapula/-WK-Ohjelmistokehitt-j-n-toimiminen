import multer from "multer";

/**
 * Глобальний обробник помилок — останній middleware у ланцюжку.
 * Ловить усі помилки, які виникають у роутах, і перетворює їх
 * на зрозумілі JSON-відповіді (помилки multer → 400, решта → 500).
 */
export const errorHandler = (err, req, res, next) => {
  console.error("❗", err); // Логуємо помилку в консоль для діагностики
  if (err instanceof multer.MulterError) {
    // Помилки multer: завеликий файл тощо
    return res.status(400).json({ error: err.message });
  }
  if (err.message === "Unsupported file type") {
    return res.status(400).json({ error: "Only JPEG, PNG, WebP images are allowed" });
  }
  res.status(500).json({ error: "Internal server error" });
};