import { Resend } from "resend";

/**
 * Відправка листів через Resend.
 *
 * Ключ і адреса отримувача беруться з .env, але мають робочі значення
 * за замовчуванням, щоб форма замовлення надсилала листи одразу.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Куди надходить повідомлення про нове замовлення
const NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || "maksym.kapula@gmail.com";

// Резервна адреса: у тестовому режимі Resend дозволяє слати лише власнику акаунта.
// Якщо основна адреса недоступна — лист іде сюди, щоб замовлення не загубилось.
const FALLBACK_EMAIL = process.env.MAIL_FALLBACK_TO || "burbenburbenov@gmail.com";

// Відправник. onboarding@resend.dev — тестовий домен Resend
const MAIL_FROM = process.env.MAIL_FROM || "K.Betoniveistokset <onboarding@resend.dev>";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Екранує небезпечні символи, щоб дані форми не ламали HTML-лист
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));

/**
 * Надсилає лист-повідомлення про замовлення.
 *
 * @param {object}   options
 * @param {string}   options.subject      Тема листа
 * @param {object}   options.fields       Пари "підпис: значення" для таблиці в листі
 * @param {string}   [options.replyTo]    Email клієнта (щоб відповісти одним кліком)
 * @param {Array}    [options.attachments] Вкладення у форматі Resend: { filename, content }
 * @returns {Promise<object|null>}        Результат від Resend
 */
export async function sendOrderEmail({ subject, fields, replyTo, attachments } = {}) {
  if (!resend) {
    console.warn("⚠️  RESEND_API_KEY не задано — лист не надіслано.");
    return null;
  }

  const rows = Object.entries(fields || {})
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e5e5e5;background:#fafafa;font-weight:600;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border:1px solid #e5e5e5;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#222;max-width:640px;">
      <h2 style="margin:0 0 4px;">Uusi tilaus</h2>
      <p style="color:#666;margin:0 0 16px;">K.Betoniveistokset – verkkotilauslomake</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">${rows}</table>
      <p style="color:#999;font-size:12px;margin-top:16px;">Lähetetty automaattisesti tilauslomakkeesta.</p>
    </div>`;

  const payload = {
    from: MAIL_FROM,
    to: [NOTIFICATION_EMAIL],
    subject,
    html,
  };

  if (replyTo) payload.replyTo = replyTo;
  if (Array.isArray(attachments) && attachments.length > 0) payload.attachments = attachments;

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    // Найчастіша причина: тестовий режим Resend не дає слати не власнику акаунта.
    // Пробуємо резервну (дозволену) адресу, щоб замовлення все одно дійшло.
    const isTestRestriction = error.statusCode === 403 || /testing emails/i.test(error.message || "");
    if (isTestRestriction && FALLBACK_EMAIL && FALLBACK_EMAIL !== NOTIFICATION_EMAIL) {
      console.warn(
        `⚠️  Resend не дозволяє слати на ${NOTIFICATION_EMAIL} (тестовий режим). Надсилаю на ${FALLBACK_EMAIL}. ` +
          "Верифікуйте домен на resend.com/domains, щоб слати на основну адресу."
      );
      const retry = await resend.emails.send({ ...payload, to: [FALLBACK_EMAIL] });
      if (retry.error) throw new Error(retry.error.message || "Resend failed to send email");
      console.log("📧 Order email sent (fallback):", retry.data?.id);
      return retry.data;
    }
    throw new Error(error.message || "Resend failed to send email");
  }

  console.log("📧 Order email sent:", data?.id);
  return data;
}
