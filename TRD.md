# Technical Requirements Document — ALLFIX

**Version:** 1.0  
**Last Updated:** June 23, 2026  
**Stack:** React 18 + Express 4 + SQLite3/PostgreSQL

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (User Agent)                   │
│  React 18 SPA · Tailwind CSS · Vite Dev Server :5173    │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (JSON)
                         │ /api/* proxied to :3001
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Express.js API Server :3001                  │
│  CORS · JSON Parser · JWT Auth Middleware · Knex ORM     │
├─────────────────────┬───────────────────────────────────┤
│  /api/auth          │  /api/services   /api/bookings    │
│  register / login   │  CRUD            Create / List    │
│  send-otp / verify  │  (public +       (role-gated)     │
│  /me                │   provider)                       │
└─────────────────────┴───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│             SQLite3 (dev) / PostgreSQL (prod)            │
│  Tables: users, providers, services, bookings, reviews   │
│  Knex Migrations & Seeds                                 │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Module Dependency Graph (Server)

```
src/index.js
  ├── routes/auth.js        → db/index.js, bcryptjs, jsonwebtoken, crypto
  ├── routes/services.js    → db/index.js, middleware/auth.js
  ├── routes/bookings.js    → db/index.js, middleware/auth.js
  └── middleware/auth.js    → jsonwebtoken

src/db/index.js             → knex, knexfile.js
src/db/knexfile.js          → dotenv, path
src/db/migrations/          → Knex migration DSL
src/db/seeds/               → bcryptjs, Knex insert
```

### 1.3 Module Dependency Graph (Client)

```
src/main.jsx
  └── BrowserRouter
       └── AuthProvider (context/AuthContext.jsx)
            └── App.jsx (Routes)
                 ├── pages/Landing.jsx
                 ├── pages/Register.jsx
                 ├── pages/Login.jsx
                 ├── pages/Services.jsx
                 ├── pages/ServiceDetail.jsx
                 ├── pages/ProviderDashboard.jsx
                 ├── pages/CustomerBookings.jsx
                 ├── pages/Profile.jsx
                 └── components/
                      ├── Navbar.jsx
                      ├── Layout.jsx
                      ├── ProtectedRoute.jsx
                      └── ServiceCard.jsx

src/api/index.js            → fetch (no axios)
src/context/AuthContext.jsx  → api/index.js
```

---

## 2. Tech Stack (Exact Versions)

| Layer | Dependency | Version | Purpose |
|---|---|---|---|
| Runtime | Node.js | ≥18 | Server & build |
| Frontend | react | ^18.3.1 | UI library |
| Frontend | react-dom | ^18.3.1 | DOM rendering |
| Frontend | react-router-dom | ^6.26.0 | Client-side routing |
| Frontend | vite | ^5.4.2 | Bundler & dev server |
| Frontend | @vitejs/plugin-react | ^4.3.1 | React Fast Refresh |
| Frontend | tailwindcss | ^3.4.10 | Utility CSS |
| Frontend | postcss | ^8.4.41 | CSS processing |
| Frontend | autoprefixer | ^10.4.20 | Vendor prefixes |
| Backend | express | ^4.21.0 | HTTP server framework |
| Backend | cors | ^2.8.5 | Cross-origin requests |
| Backend | knex | ^3.1.0 | SQL query builder |
| Backend | sqlite3 | ^6.0.1 | Dev database driver |
| Backend | pg | ^8.13.0 | Production database driver |
| Backend | bcryptjs | ^2.4.3 | Password hashing |
| Backend | jsonwebtoken | ^9.0.2 | JWT sign/verify |
| Backend | dotenv | ^16.4.5 | Env variable loading |

---

## 3. Data Model (Detailed)

### 3.1 Entity-Relationship Diagram

```
┌──────────────┐     ┌──────────────────┐
│    users      │     │   providers      │
│──────────────│     │──────────────────│
│ id (PK)      │1──1│ id (PK)          │
│ name         │     │ user_id (FK)     │──→ users.id
│ email (UQ)   │     │ bio              │
│ password     │     │ avg_rating       │
│ role         │     │ is_verified      │
│ phone        │     │ created_at       │
│ location     │     └──────────────────┘
│ created_at   │              │ 1
│ updated_at   │              │
└──────┬───────┘              │
       │ 1                   │
       │                     │ N
       │            ┌────────┴──────────┐
       │            │    services        │
       │            │───────────────────│
       │            │ id (PK)           │
       │            │ provider_id (FK)  │──→ providers.id
       │            │ category          │
       │            │ title             │
       │            │ description       │
       │            │ price             │
       │            │ duration_minutes  │
       │            │ created_at        │
       │            └────────┬──────────┘
       │                     │ 1
       │ N                   │
       │            ┌────────┴──────────┐
       │            │    bookings        │
       │            │───────────────────│
       │            │ id (PK)           │
       └────────────┤ customer_id (FK)  │──→ users.id
                    │ service_id (FK)   │──→ services.id
                    │ status            │
                    │ scheduled_at      │
                    │ notes             │
                    │ created_at        │
                    └────────┬──────────┘
                             │ 1
                             │
                    ┌────────┴──────────┐
                    │    reviews         │
                    │───────────────────│
                    │ id (PK)           │
                    │ booking_id (FK)   │──→ bookings.id
                    │ rating (1-5)      │
                    │ comment           │
                    │ created_at        │
                    └───────────────────┘
```

### 3.2 Column Specifications

**users**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT | |
| name | TEXT | NOT NULL | |
| email | TEXT | NOT NULL, UNIQUE | |
| password | TEXT | NOT NULL | bcrypt hash, 60 chars |
| role | TEXT | NOT NULL, CHECK('customer','provider') | Enum via Knex |
| phone | TEXT | nullable, max 20 | |
| location | TEXT | nullable | Free-text |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**providers**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT | |
| user_id | INTEGER | NOT NULL, UNIQUE, FK → users.id ON DELETE CASCADE | 1:1 with users |
| bio | TEXT | nullable | |
| avg_rating | DECIMAL(3,2) | DEFAULT 0.00 | Computed/updated via reviews |
| is_verified | BOOLEAN | DEFAULT false | Future use |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**services**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT | |
| provider_id | INTEGER | NOT NULL, FK → providers.id ON DELETE CASCADE | |
| category | TEXT | NOT NULL, CHECK('electric','motorcycle','car','cleaning','computer','phone') | |
| title | TEXT | NOT NULL | |
| description | TEXT | nullable | |
| price | DECIMAL(10,2) | NOT NULL | |
| currency | TEXT | NOT NULL, DEFAULT 'USD' | Pricing currency (e.g. USD, EUR, GBP, INR) |
| duration_minutes | INTEGER | DEFAULT 60 | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**bookings**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT | |
| service_id | INTEGER | NOT NULL, FK → services.id ON DELETE CASCADE | |
| customer_id | INTEGER | NOT NULL, FK → users.id ON DELETE CASCADE | |
| status | TEXT | NOT NULL, DEFAULT 'pending', CHECK('pending','confirmed','completed','cancelled') | |
| scheduled_at | TIMESTAMP | NOT NULL | Customer-chosen time |
| notes | TEXT | nullable | Customer's message |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**reviews**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT | |
| booking_id | INTEGER | NOT NULL, FK → bookings.id ON DELETE CASCADE, UNIQUE | 1 review per booking |
| rating | INTEGER | NOT NULL, CHECK(1-5) | |
| comment | TEXT | nullable | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

---

## 4. API Specifications

### 4.1 Auth Endpoints

#### `POST /api/auth/register`
- **Auth:** None
- **Body:**
  ```json
  { "name": "string (required)", "email": "string (required, unique)", "password": "string (required)", "role": "'customer' | 'provider' (required)", "phone": "string (optional)", "location": "string (optional)" }
  ```
- **Success 201:**
  ```json
  { "user": { "id": 1, "name": "...", "email": "...", "role": "provider", "phone": null, "location": null }, "token": "jwt_string" }
  ```
- **Errors:** 400 (invalid role), 409 (duplicate email), 500

#### `POST /api/auth/login`
- **Auth:** None
- **Body:** `{ "email": "string", "password": "string" }`
- **Success 200:** `{ "user": {...}, "token": "jwt_string" }`
- **Errors:** 401 (invalid credentials), 500

#### `POST /api/auth/send-otp`
- **Auth:** None
- **Body:** `{ "phone": "string" }`
- **Success 200:** `{ "message": "OTP sent", "otp": "123456" }`
- **Notes:** OTP returned in body (dev only). Stored in-memory Map with 5-min TTL.

#### `POST /api/auth/verify-otp`
- **Auth:** None
- **Body:** `{ "phone": "string", "otp": "string" }`
- **Success 200:** `{ "user": {...}, "token": "jwt_string" }`
- **Errors:** 400 (no OTP/expired/invalid)

#### `GET /api/auth/me`
- **Auth:** Bearer token (header: `Authorization: Bearer <token>`)
- **Success 200:** `{ "id": 1, "name": "...", "email": "...", "role": "...", "phone": "...", "location": "...", "created_at": "...", "updated_at": "..." }`
- **Errors:** 401 (no token / invalid)

### 4.2 Service Endpoints

#### `GET /api/services`
- **Auth:** None
- **Query:** `?category=electric|motorcycle|car|cleaning`
- **Success 200:**
  ```json
  [{ "id": 1, "provider_id": 1, "category": "electric", "title": "...", "description": "...", "price": 80.00, "duration_minutes": 60, "provider_name": "John", "location": "Downtown", "avg_rating": 4.5, "created_at": "..." }]
  ```
- **Join:** services → providers → users

#### `GET /api/services/my`
- **Auth:** Bearer token + role=provider
- **Success 200:** Array of services owned by the authenticated provider

#### `GET /api/services/:id`
- **Auth:** None
- **Success 200:** Single service object (includes provider_name, location, phone, bio, avg_rating)
- **Errors:** 404

#### `POST /api/services`
- **Auth:** Bearer token + role=provider
- **Body:** `{ "category": "electric", "title": "string", "description": "string", "price": 80, "duration_minutes": 60 }`
- **Success 201:** Created service object
- **Errors:** 400 (invalid category), 404 (provider profile not found)

#### `PUT /api/services/:id`
- **Auth:** Bearer token + role=provider
- **Body:** Same as POST
- **Success 200:** Updated service object
- **Errors:** 400, 404 (not found / not owned)

#### `DELETE /api/services/:id`
- **Auth:** Bearer token + role=provider
- **Success 200:** `{ "message": "Service deleted" }`
- **Errors:** 404 (not found / not owned)

### 4.3 Booking Endpoints

#### `GET /api/bookings`
- **Auth:** Bearer token
- **Role-based filtering:** Customers see their own (includes `otp`); providers see bookings for their services (excludes `otp` for security)
- **Success 200:**
  ```json
  [{ "id": 1, "service_id": 1, "customer_id": 4, "status": "pending", "scheduled_at": "...", "notes": null, "title": "Electrical Wiring", "category": "electric", "price": 80.00, "provider_name": "John", "otp": "6608" }]
  ```

#### `POST /api/bookings`
- **Auth:** Bearer token + role=customer
- **Body:** `{ "service_id": 1, "scheduled_at": "ISO8601 timestamp", "notes": "optional" }`
- **Success 201:** Created booking object (generates and returns secure 4-digit `otp`)
- **Errors:** 403 (not a customer), 404 (service not found)

#### `PATCH /api/bookings/:id/status`
- **Auth:** Bearer token
- **Body:** `{ "status": "confirmed" | "completed" | "cancelled", "otp": "string" }`
- **Role logic:**
  - Provider: can set any status; must own the service; **must supply the correct customer OTP if transitioning to completed**
  - Customer: can only set "cancelled"
- **Success 200:** Updated booking object
- **Errors:** 400 (invalid status, missing/incorrect OTP on complete), 403 (not allowed), 404

### 4.4 Reviews Endpoints

#### `GET /api/reviews/provider`
- **Auth:** Bearer token + role=provider
- **Success 200:** Array of review objects (includes customer_name, service_title, service_category)

#### `GET /api/reviews/booking/:bookingId`
- **Auth:** Bearer token (customer)
- **Success 200:** Review object (if exists) or null
- **Errors:** 404

#### `POST /api/reviews`
- **Auth:** Bearer token + role=customer (completed booking only)
- **Body:** `{ "booking_id": 1, "rating": 5, "comment": "optional" }`
- **Success 201:** Created review object
- **Errors:** 400 (invalid rating, not completed), 409 (already reviewed)

### 4.5 Health

#### `GET /api/health`
- **Auth:** None
- **Success 200:** `{ "status": "ok" }`

---

## 5. Authentication & Authorization

### 5.1 JWT Token Format

```
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "id": 1, "email": "user@example.com", "role": "customer", "iat": ..., "exp": ... +7d }
Secret:  process.env.JWT_SECRET
```

### 5.2 Middleware Chain

```
Request
  │
  ├── cors()                    — Allow all origins
  ├── express.json()            — Parse body
  │
  ├── [Route Handler]
  │     │
  │     ├── authenticate()       — Extract + verify Bearer token
  │     │     └── Sets req.user = { id, email, role }
  │     │
  │     ├── requireRole('provider')  — Check req.user.role
  │     │     └── 403 if mismatch
  │     │
  │     └── Business logic handler
```

### 5.3 Auth Flow Summary

```
Registration:  Client → POST /auth/register → Server hashes pw → Insert user → Sign JWT → { user, token }
Login:         Client → POST /auth/login → Server verify pw → Sign JWT → { user, token }
OTP Login:     Client → POST /auth/send-otp → Server gen OTP → Map<phone, {otp, expires}>
               Client → POST /auth/verify-otp → Server verify → Sign JWT → { user, token }
Session:       Client stores token in localStorage → On mount: GET /auth/me → if 401, clear token
```

---

## 6. Frontend Architecture

### 6.1 Component Tree

```
<BrowserRouter>
  <AuthProvider>                          ← Context: user, loading, login, register, etc.
    <Routes>
      <Route "/" → <Layout><Landing /></Layout>
      <Route "/register" → <Layout><Register /></Layout>
      <Route "/login" → <Layout><Login /></Layout>
      <Route "/services" → <Layout><Services /></Layout>
      <Route "/services/:id" → <Layout><ServiceDetail /></Layout>
      <Route "/provider/dashboard" → <ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>
      <Route "/customer/bookings" → <ProtectedRoute role="customer"><CustomerBookings /></ProtectedRoute>
      <Route "/profile" → <ProtectedRoute><Profile /></ProtectedRoute>
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

### 6.2 Data Flow

```
┌──────────────┐    fetch()     ┌──────────────┐   Knex    ┌────────┐
│  React Page   │ ────────────>  │ Express Route │ ───────>  │  DB    │
│  Component    │ <────────────  │  (handler)    │ <───────  │        │
│              │    JSON resp   │              │           │        │
│  ─ uses ─    │                │  ─ uses ─     │           │        │
│  api/index.js │                │  db/index.js  │           │        │
└──────────────┘                └──────────────┘           └────────┘

State Management:
  AuthContext (global)  → user, loading, login, register, logout, sendOtp, verifyOtp
  Page-level state      → useState + useEffect for API data (services, bookings, etc.)
  URL params            → useSearchParams for category filter
  Routing               → useNavigate for post-login redirects
```

### 6.3 API Client (`src/api/index.js`)

```
request(path, options)
  ├── Reads token from localStorage
  ├── Sets Content-Type + Authorization headers
  ├── fetch(API + path, options)
  ├── Parses JSON
  └── Throws Error on non-ok status

Exports:
  auth     = { register, login, me, sendOtp, verifyOtp }
  services = { list, get, my, create, update, delete }
  bookings = { list, create, updateStatus }
```

---

## 7. Error Handling Strategy

### 7.1 Server-Side

```
Every route handler wrapped in try/catch:
  try {
    // business logic
    res.status(2xx).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Human-readable message' })
  }
```

Error response format: `{ "error": "string" }`

### 7.2 Client-Side

```
API layer:    throw new Error(data.error || 'Request failed')
Components:   try { await api.method() } catch (err) { setError(err.message) }
Auth layer:   Errors surface as alert() calls (login/register pages)
```

---

## 8. Database Configuration

### 8.1 Development (SQLite)

```
client:        sqlite3
connection:    src/db/dev.sqlite3 (local file)
pool:          afterCreate → PRAGMA foreign_keys = ON
useNullAsDefault: true
migrations:    src/db/migrations/*.js
seeds:         src/db/seeds/*.cjs (CommonJS bc Knex requires it)
```

### 8.2 Production (PostgreSQL)

```
client:        pg
connection:    process.env.DATABASE_URL
dependencies:  pg ^8.13.0 (already installed)
```

### 8.3 Migration History

| File | Description |
|---|---|
| `001_create_users.cjs` | Creates all 5 tables: users, providers, services, bookings, reviews |
| `002_add_cleaning_category.cjs` | Adds 'cleaning' to enum (PostgreSQL only; no-op for SQLite) |
| `003_add_currency_to_services.cjs` | Adds `currency` column to services table with 'USD' default |
| `004_add_tech_categories.cjs` | PostgreSQL only: adds 'computer' and 'phone' enum values to the schema |
| `005_expand_category_sqlite.cjs` | SQLite only: recreates table to add `computer` and `phone` values to CHECK constraint |
| `006_add_otp_to_bookings.cjs` | Adds string column `otp` (length 4) to `bookings` table for service completion verification |

### 8.4 Seed Data

| User | Role | Credentials |
|---|---|---|
| John Electrician | provider | john@example.com / password123 |
| Jane Mechanic | provider | jane@example.com / password123 |
| Emily Cleaner | provider | emily@example.com / password123 |
| Bob Customer | customer | bob@example.com / password123 |

3 provider profiles + 8 services seeded. No bookings or reviews.

---

## 9. Environment Configuration

### 9.1 Server `.env`

```
PORT=3001
DATABASE_URL=postgres://postgres:postgres@localhost:5432/home_services
JWT_SECRET=change_this_to_a_random_secret_key
```

### 9.2 Client Vite Config

```
server.port:     5173
server.proxy:    /api → http://localhost:3001
```

All `/api/*` requests from the dev server are proxied to Express at :3001, avoiding CORS issues in development.

---

## 10. Build & Deployment

### 10.1 Development

```bash
# Terminal 1 — Server
cd server && npm run dev       # node --watch src/index.js

# Terminal 2 — Client
cd client && npm run dev       # vite dev server on :5173
```

### 10.2 Database Setup

```bash
cd server
npm run migrate                # knex migrate:latest
npm run seed                   # knex seed:run
```

### 10.3 Production Build

```bash
cd client && npm run build     # Outputs to client/dist/
```

Static files in `client/dist/` should be served via a reverse proxy (nginx, CDN) with the Express API running as a separate process.

---

## 11. Security Considerations

| Concern | Current State | Recommendation |
|---|---|---|
| Password storage | bcrypt, 10 salt rounds | Adequate for MVP |
| JWT secret | Hardcoded in `.env` | Generate strong secret via `openssl rand -hex 64` |
| Token expiry | 7 days | Adequate for MVP |
| SQL injection | Prevented by Knex parameterized queries | Secure |
| CORS | `cors()` with default (all origins) | Restrict to specific origin in production |
| OTP security | Returned in response body; in-memory storage | Replace with SMS gateway + Redis in production |
| Input validation | Manual checks only | Add Zod/Joi for production |
| Rate limiting | None | Add express-rate-limit for auth endpoints |
| XSS | React's auto-escaping | Adequate |
| Secrets in client | No secrets in client code | Adequate |

---

## 12. Performance Budgets

| Metric | Target | Method |
|---|---|---|
| API response time (p95) | < 200ms | Knex query optimization, indexing |
| First Contentful Paint | < 1.5s | Vite code splitting, lazy routes |
| Bundle size (initial) | < 150kB gzip | Tree-shaking via Vite |
| Time to Interactive | < 2s | Minimal JS dependencies |
| Lighthouse score | ≥ 90 | Performance budget enforcement |

---

## 13. Development Scripts

### Server (`cd server`)

| Command | Action |
|---|---|
| `npm run dev` | Start with file watching (`node --watch`) |
| `npm start` | Start in production mode |
| `npm run migrate` | Run pending migrations |
| `npm run seed` | Seed database |
| `npm run migrate:rollback` | Rollback last migration batch |

### Client (`cd client`)

| Command | Action |
|---|---|
| `npm run dev` | Vite dev server on :5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

---

## 14. Known Technical Debt

| Issue | Impact | Effort |
|---|---|---|
| No input validation library | Manual checks are error-prone | Small |
| In-memory OTP store | Lost on restart; no horizontal scaling | Medium |
| No pagination | All lists return unbounded results | Small |
| No search endpoint | Only category filtering | Small |
| Console.error for 500s | No structured logging | Small |
| `is_verified` unused | Column present but no verification flow | Small |
| No request logging | No observability in production | Small |
| Debug logging in DELETE route | `.debug(true)` + console.log left in production code | Trivial |
| `providers` table lacks timestamps | `created_at` exists but no `updated_at` | Trivial |
| Booking status PATCH allows stale transitions | No state machine validation | Medium |
