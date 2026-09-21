# K.BETONIVEISTOKSET

Storefront and Admin Panel for handcrafted concrete sculptures (made in Finland).
Customers place sculpture orders through an online form; orders are delivered to the owner by **email**. An admin panel (hidden behind a secret link + login) manages the gallery of sculptures.

---

## 🧰 Technologies Used

### Frontend — `frontend/`
| Technology | What it's used for |
|---|---|
| **React 18** | UI components and pages |
| **Vite 5** | Dev server, build tooling (port `5173`) |
| **react-router-dom 6** | Page routing incl. the hidden admin routes |
| **axios** | HTTP client to the backend API |

### Backend — `backend/`
| Technology | What it's used for |
|---|---|
| **Node.js + Express 4** | HTTP API server (port `3000`) |
| **helmet** | Security HTTP headers |
| **cors** | Cross-origin access for the frontend |
| **express-rate-limit** | Brute-force protection (100 req / 15 min / IP) |
| **jsonwebtoken** | Admin JWT authentication |
| **bcryptjs** | Password hashing (admin login) |
| **zod** | Request body validation |
| **multer** | File uploads (gallery images + order attachments) |
| **resend** | Sending order emails (SMTP-free email API) |
| **dotenv** | Environment variables from `.env` |

### Storage
- Sculptures are stored in a **JSON file** (`backend/data/posts.json`) — no database is used.
- Order images are kept **in memory** and sent as email attachments (never saved to disk).
- Admin credentials live in `backend/.env` (email + bcrypt hash), not in the code.

---

## 📁 Project Structure

```
├── backend/
│   ├── server.js                 # Express server entry (helmet, CORS, rate limit, /uploads static)
│   ├── .env.example              # Copy to .env and fill in
│   ├── data/posts.json           # Sculpture gallery data (JSON storage)
│   └── src/
│       ├── app.js                # API router (/api)
│       ├── controllers/          # auth, posts, order handlers
│       ├── routes/               # auth, posts, order routes
│       ├── middleware/           # auth (JWT), validate (zod), upload (multer), error handling
│       ├── validators/           # zod schemas
│       └── utils/                # mailer (Resend), posts.storage
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js            # proxies /api and /uploads → localhost:3000
    └── src/
        ├── App.jsx               # Routes (landing, /order, hidden /admin-access, /admin)
        ├── pages/                # LandingPage, Order, AdminLogin, AdminPanel, AdminSecretAccess, Home
        ├── components/           # AdminGuard (secret-link + JWT protection)
        ├── utils/adminAuth.js    # secret-key validation (fail closed)
        └── styles/               # CSS
```

---

## 🚀 Running the Application

Requirements: **Node.js 18+** and **npm**.

### 1. Backend
```bash
cd backend
npm install
# create backend/.env from backend/.env.example and fill in the values
npm run dev     # http://localhost:3000  (node --watch)
```

### 2. Frontend
```bash
cd frontend
npm install
# create frontend/.env from frontend/.env.example and set a secret key
npm run dev     # http://localhost:5173
```

---

## 🔐 Environment Variables

### `backend/.env`
| Variable | Description |
|---|---|
| `PORT` | API port (default `3000`) |
| `NODE_ENV` | `development` / `production` |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | **bcrypt hash** of the admin password (never the plaintext) |
| `JWT_SECRET` | Long random string used to sign admin tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d` |
| `MAX_FILE_SIZE` | Max upload size in bytes |
| `ALLOWED_MIME_TYPES` | Allowed image MIME types for gallery |
| `RESEND_API_KEY` | Resend API key for order emails |
| `ORDER_NOTIFICATION_EMAIL` | Where order emails are delivered |
| `MAIL_FALLBACK_TO` | Fallback recipient while Resend is in test mode |
| `MAIL_FROM` | Sender address |

Generate a password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD', 12))"
```

### `frontend/.env`
| Variable | Description |
|---|---|
| `VITE_ADMIN_SECRET_KEY` | Secret used in the admin special link |

Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
```

> `.env` files are git-ignored — never commit real secrets.

---

## 🔒 Secret Admin Access

The Admin Login and Admin Panel are hidden and protected from direct access. Direct visits to `/admin` or `/admin/login` without authorization are automatically redirected to the home page.

### Admin Special Link
Only the administrator with the secret key can access the admin portal via:

```
http://localhost:5173/admin-access/<VITE_ADMIN_SECRET_KEY>
```

The key is read from `frontend/.env`. It is intentionally **not** written in this README or in the code, so it is not exposed in the repository.

> ⚠️ Note: `VITE_*` values are compiled into the browser bundle, so this secret link is only an extra layer of obscurity. The real protection is the backend admin login (email + bcrypt password hash + JWT).

### Changing the Secret Key
Set a new long random value in `frontend/.env`:
```env
VITE_ADMIN_SECRET_KEY=your-new-random-secret
```
After restarting the dev server, the special link becomes:
```
http://localhost:5173/admin-access/your-new-random-secret
```

> The old `?key=...` query-parameter form is no longer supported, because it leaks the key into browser history, referrers and server logs.

---

## ⚙️ API Endpoints (`/api`)

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | public | Admin login → returns JWT token |
| `GET` | `/api/posts` | public | List all sculptures (gallery) |
| `POST` | `/api/posts` | admin JWT | Create a sculpture (multipart: title, description, image) |
| `PUT` | `/api/posts/:id` | admin JWT | Update a sculpture |
| `DELETE` | `/api/posts/:id` | admin JWT | Delete a sculpture |
| `POST` | `/api/order` | public | Place an order (JSON) — sends an email |
| `POST` | `/api/order/request` | public | Landing-page order (multipart + files) — sends an email with attachments |
| `GET` | `/uploads/*` | public | Static uploaded gallery images |

---

## 📧 Order Forms & Email

There are two order forms in the frontend:

1. **Landing page "TILAUSLOMAKE"** (`LandingPage.jsx`) — the main storefront order form. Submits to `POST /api/order/request` (name/email/phone/description + optional image or PDF attachments).
2. **Order page** (`Order.jsx`, route `/order`) — a JSON order form that posts to `POST /api/order`.

Both send a formatted email to `ORDER_NOTIFICATION_EMAIL` (+ `MAIL_FALLBACK_TO` while the Resend account is in test mode) via **Resend**, and include the customer's email as the reply-to address.

---

## 🧑‍💻 Forms Overview

| Form | Location | Purpose |
|---|---|---|
| TILAUSLOMAKE | `frontend/src/pages/LandingPage.jsx` | Customer sculpture order (with file upload) |
| Make an Order | `frontend/src/pages/Order.jsx` | Alternative order form |
| Admin Logon | `frontend/src/pages/AdminLogin.jsx` | Admin email + password login |
| Add/Edit Sculpture | `frontend/src/pages/AdminPanel.jsx` | Manage gallery posts (title, description, image) |

---

## 🔐 Security Notes

- Admin endpoints require a valid **JWT**; auth **fails closed** if env vars are missing or the password hash is invalid.
- Passwords are stored only as **bcrypt hashes**; the JWT secret and admin credentials are loaded from `.env`, never hardcoded.
- The secret admin link is **obscurity only** — treat the backend login as the real protection.
- Upload rate limiting, `helmet` headers and CORS restrictions are enabled.
- Rotate the Resend API key and JWT secret if they are ever exposed.