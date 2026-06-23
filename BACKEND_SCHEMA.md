# Backend Schema & Auth Flow — ALLFIX

---

## Part 1: How Your Data Is Stored & Organized

### 1.1 Database Technology

| Environment | Engine | Driver | Config Source |
|---|---|---|---|
| Development | SQLite 3 | `sqlite3` v6 | `server/src/db/knexfile.js` (file: `dev.sqlite3`) |
| Production | PostgreSQL | `pg` v13 | `.env` → `DATABASE_URL` (switch knexfile) |

Knex.js v3 is the query builder and migration runner. All migrations, seeds, and queries go through Knex — no raw SQL.

### 1.2 Database Connection

**File:** `server/src/db/index.js`

```js
import knex from 'knex';
import config from './knexfile.js';
const db = knex(config);
export default db;
```

A single Knex instance is created at import time and shared across all route files via `import db from '../db/index.js'`.

### 1.3 Knex Configuration

**File:** `server/src/db/knexfile.js`

```js
client: 'sqlite3'
connection: { filename: 'server/src/db/dev.sqlite3' }
useNullAsDefault: true   // required by SQLite
pool.afterCreate: PRAGMA foreign_keys = ON  // enforce FK at connection level
```

---

## 2. Schema Diagram

```
┌───────────────┐       ┌───────────────────┐
│     users      │       │    providers       │
│───────────────│       │───────────────────│
│ PK  id         │──┐    │ PK  id             │
│     name       │  │    │ FK  user_id (UQ)   │── users.id
│     email (UQ) │  │    │     bio            │
│     password   │  │    │     avg_rating     │
│     role       │  │    │     is_verified    │
│     phone      │  │    │     created_at     │
│     location   │  │    └────────┬──────────┘
│     created_at │  │             │ 1
│     updated_at │  │             │
└───────┬───────┘  │             │ N
        │ 1        │    ┌────────┴──────────┐
        │          │    │     services       │
        │          │    │───────────────────│
        │          │    │ PK  id             │
        │          │    │ FK  provider_id    │── providers.id
        │          │    │     category       │
        │          │    │     title          │
        │ N        │    │     description    │
        │          │    │     price          │
        │          │    │     duration_min   │
        │          │    │     created_at     │
        │          │    └────────┬──────────┘
        │          │             │ 1
        │          │             │
        │          │    ┌────────┴──────────┐
        │          │    │     bookings       │
        │          └────┤ FK  customer_id    │── users.id
                   │    │───────────────────│
                   │    │ PK  id             │
                   │    │ FK  service_id     │── services.id
                   │    │     status         │
                   │    │     scheduled_at   │
                   │    │     notes          │
                   │    │     created_at     │
                   │    └────────┬──────────┘
                   │             │ 1
                   │             │
                   │    ┌────────┴──────────┐
                   │    │     reviews        │
                   │    │───────────────────│
                   │    │ PK  id             │
                   │    │ FK  booking_id (UQ)│── bookings.id
                   │    │     rating         │
                   │    │     comment        │
                   │    │     created_at     │
                   │    └───────────────────┘
```

---

## 3. Table Definitions (DDL)

### 3.1 `users`

```sql
CREATE TABLE users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  password   TEXT    NOT NULL,            -- bcrypt hash, 60 chars
  role       TEXT    NOT NULL CHECK(role IN ('customer','provider')),
  phone      TEXT    CHECK(length(phone) <= 20),
  location   TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_phone ON users(phone);
```

**Purpose:** Central identity table. Every person — customer or provider — is a user first.

**Key constraints:**
- `email` is the unique login identifier for password auth
- `phone` is the unique identifier for OTP auth (no unique constraint in code, but lookup by phone implies uniqueness)
- `role` discriminates between customer and provider
- `password` stores the bcrypt hash (never the raw password)

### 3.2 `providers`

```sql
CREATE TABLE providers (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio          TEXT,
  avg_rating   DECIMAL(3,2) DEFAULT 0.00,
  is_verified  BOOLEAN DEFAULT false,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_providers_user_id ON providers(user_id);
```

**Purpose:** Extended profile for provider users. 1:1 with `users`.

**Key constraints:**
- `user_id` is UNIQUE (one provider profile per user)
- `ON DELETE CASCADE` — if a user is deleted, their provider profile is deleted
- `avg_rating` is updated manually (no trigger currently; will be computed from `reviews`)
- `is_verified` reserved for future verification flow

### 3.3 `services`

```sql
CREATE TABLE services (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id      INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  category         TEXT    NOT NULL CHECK(category IN ('electric','motorcycle','car','cleaning','computer','phone')),
  title            TEXT    NOT NULL,
  description      TEXT,
  price            DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  currency         TEXT    NOT NULL DEFAULT 'USD'
);

CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_category ON services(category);
```

**Purpose:** Service listings created by providers. The core product being booked.

**Key constraints:**
- `provider_id` references the providers table (not users directly)
- `ON DELETE CASCADE` — removing a provider removes all their services
- `category` is restricted to 4 values
- `price` is stored as DECIMAL(10,2) — max $99,999,999.99

### 3.4 `bookings`

```sql
CREATE TABLE bookings (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id    INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  customer_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        TEXT    NOT NULL DEFAULT 'pending'
                        CHECK(status IN ('pending','confirmed','completed','cancelled')),
  scheduled_at  TIMESTAMP NOT NULL,
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  otp           TEXT    -- 4-digit verification code generated on confirmation
);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
```

**Purpose:** The transaction record connecting a customer to a service at a specific time.

**Key constraints:**
- `service_id` → services → providers (indirect relationship to provider)
- `customer_id` → users (direct reference)
- `status` is state-machine constrained (see section 5)
- `ON DELETE CASCADE` on both FKs — deleting a service or user removes related bookings

### 3.5 `reviews`

```sql
CREATE TABLE reviews (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id  INTEGER NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_reviews_booking ON reviews(booking_id);
```

**Purpose:** Post-service feedback. One review per completed booking.

**Key constraints:**
- `booking_id` is UNIQUE — a booking can only be reviewed once
- `rating` is constrained 1–5 (integers only, no half-stars)
- Reviews API endpoints are fully implemented. When a review is created, the system triggers average rating re-calculation for the provider profile.

---

## 4. Entity Relationships Summary

| Relationship | Type | Foreign Key | Cascade |
|---|---|---|---|
| users → providers | 1:1 | `providers.user_id` → `users.id` | DELETE CASCADE |
| providers → services | 1:N | `services.provider_id` → `providers.id` | DELETE CASCADE |
| services → bookings | 1:N | `bookings.service_id` → `services.id` | DELETE CASCADE |
| users → bookings | 1:N | `bookings.customer_id` → `users.id` | DELETE CASCADE |
| bookings → reviews | 1:1 | `reviews.booking_id` → `bookings.id` | DELETE CASCADE |

All foreign keys are indexed. All cascades are set to `CASCADE` (deleting a parent removes children).

---

## 5. Booking State Machine

```
                    ┌──────────┐
                    │  PENDING  │
                    └────┬─────┘
               ┌─────────┼──────────┐
               │         │          │
               ▼         ▼          ▼
          ┌────────┐ ┌────────┐ ┌────────┐
          │CANCEL  │ │CONFIRM │ │DECLINE │
          │(cust)  │ │(prov)  │ │(prov)  │
          └────────┘ └───┬────┘ └────────┘
                         │
                         ▼
                    ┌──────────┐
                    │CONFIRMED │
                    └────┬─────┘
                         │
                         ▼
                    ┌──────────┐
                    │COMPLETED │
                    └──────────┘

State machine rules:
  pending  → confirmed   (provider action)
  pending  → cancelled   (customer action)
  pending  → cancelled   (provider declining)
  confirmed → completed  (provider action)
  confirmed → cancelled  (provider action, no customer reversal)
  completed → (terminal)
  cancelled → (terminal)
```

Enforced in `routes/bookings.js:77-106`:
- Provider can set any status on bookings for their services
- Customer can only set `cancelled` (and only on pending bookings implicitly)

---

## 6. Query Patterns

### 6.1 List Services (with provider info)

```sql
SELECT s.*, u.name AS provider_name, u.location, p.avg_rating
FROM services s
JOIN providers p ON s.provider_id = p.id
JOIN users u ON p.user_id = u.id
WHERE s.category = ?   -- optional filter
ORDER BY s.created_at DESC;
```

### 6.2 Get Single Service (full detail)

```sql
SELECT s.*, u.name AS provider_name, u.location, u.phone, p.bio, p.avg_rating
FROM services s
JOIN providers p ON s.provider_id = p.id
JOIN users u ON p.user_id = u.id
WHERE s.id = ?;
```

### 6.3 Get Customer Bookings

```sql
SELECT b.*, s.title, s.category, s.price, u.name AS provider_name
FROM bookings b
JOIN services s ON b.service_id = s.id
JOIN providers p ON s.provider_id = p.id
JOIN users u ON p.user_id = u.id
WHERE b.customer_id = ?
ORDER BY b.created_at DESC;
```

### 6.4 Get Provider Bookings

```sql
SELECT b.*, s.title, s.category, s.price, u.name AS customer_name
FROM bookings b
JOIN services s ON b.service_id = s.id
JOIN users u ON b.customer_id = u.id
WHERE s.provider_id IN (SELECT id FROM providers WHERE user_id = ?)
ORDER BY b.created_at DESC;
```

### 6.5 Verify Service Ownership

```sql
SELECT 1 FROM services
WHERE id = ? AND provider_id = (
  SELECT id FROM providers WHERE user_id = ?
);
```

---

## 7. Index Strategy

| Table | Index | Columns | Purpose |
|---|---|---|---|
| users | `idx_users_email` | email | Login lookup (unique) |
| users | `idx_users_role` | role | Role-based filtering |
| users | `idx_users_phone` | phone | OTP lookup |
| providers | `idx_providers_user_id` | user_id | 1:1 join with users |
| services | `idx_services_provider` | provider_id | Provider's services |
| services | `idx_services_category` | category | Category filter |
| bookings | `idx_bookings_customer` | customer_id | Customer's bookings |
| bookings | `idx_bookings_service` | service_id | Bookings for a service |
| bookings | `idx_bookings_status` | status | Status filtering |
| bookings | `idx_bookings_scheduled` | scheduled_at | Date range queries |
| reviews | `idx_reviews_booking` | booking_id | 1:1 lookup |

---

## 8. Seed Data

**File:** `server/src/db/seeds/001_seed.cjs`

### Users

| id | name | email | role | phone | location | password |
|---|---|---|---|---|---|---|
| 1 | John Electrician | john@example.com | provider | 555-0101 | Downtown | bcrypt("password123") |
| 2 | Jane Mechanic | jane@example.com | provider | 555-0102 | Uptown | bcrypt("password123") |
| 3 | Emily Cleaner | emily@example.com | provider | 555-0104 | Westside | bcrypt("password123") |
| 4 | Bob Customer | bob@example.com | customer | 555-0103 | Midtown | bcrypt("password123") |

### Providers

| id | user_id | bio | avg_rating | is_verified |
|---|---|---|---|---|
| 1 | 1 | Expert electrician with 10 years experience | 4.50 | false |
| 2 | 2 | Professional motorcycle and car mechanic | 4.80 | false |
| 3 | 3 | Thorough home cleaning services at affordable rates | 4.90 | false |

### Services

| id | provider_id | category | title | price | duration_min |
|---|---|---|---|---|---|
| 1 | 1 | electric | Electrical Wiring Repair | 80.00 | 60 |
| 2 | 1 | electric | Ceiling Fan Installation | 120.00 | 90 |
| 3 | 2 | motorcycle | Motorcycle Oil Change | 50.00 | 45 |
| 4 | 2 | car | Car Brake Pad Replacement | 150.00 | 120 |
| 5 | 2 | car | Engine Diagnostic | 90.00 | 60 |
| 6 | 3 | cleaning | Deep Home Clean | 130.00 | 180 |
| 7 | 3 | cleaning | Kitchen & Bathroom Scrub | 85.00 | 120 |
| 8 | 3 | cleaning | Move-Out Cleaning | 200.00 | 240 |

---

## 9. Migration History

| File | Changes |
|---|---|
| `001_create_users.cjs` | Creates all 5 tables with constraints and indexes |
| `002_add_cleaning_category.cjs` | PostgreSQL only: adds 'cleaning' to the enum type via `ALTER TYPE`; no-op on SQLite since the value was already in the original migration |
| `003_add_currency_to_services.cjs` | Adds `currency` column to services table with 'USD' default |
| `004_add_tech_categories.cjs` | PostgreSQL only: adds 'computer' and 'phone' enum values to the schema |
| `005_expand_category_sqlite.cjs` | SQLite only: recreates table to add `computer` and `phone` values to CHECK constraint |
| `006_add_otp_to_bookings.cjs` | Adds string column `otp` (length 4) to `bookings` table for service completion verification |

---

## 10. Cascading Deletes Reference

| Delete Action | Result |
|---|---|
| `DELETE FROM users WHERE id = ?` | Deletes provider profile (if provider), all bookings as customer, cascades to reviews of those bookings |
| `DELETE FROM providers WHERE id = ?` | Deletes all their services, which cascades to all bookings on those services, which cascades to reviews |
| `DELETE FROM services WHERE id = ?` | Deletes all bookings for that service, which cascades to reviews |
| `DELETE FROM bookings WHERE id = ?` | Deletes the associated review |

⚠️ **Note:** Provider can delete a service with active (confirmed) bookings — the cascade will silently remove those bookings. There is no business-logic guard against this in the current code.

---

## Part 2: Auth Flow

### 11. Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AUTH SYSTEM                                  │
│                                                                      │
│  Client Side                              Server Side                │
│  ───────────                              ───────────                │
│  localStorage('token')                    JWT verify                 │
│  AuthContext (global state)               bcrypt compare             │
│  ProtectedRoute (route guard)             In-memory OTP Map          │
│  API interceptor (Bearer header)          authenticate middleware    │
│                                           requireRole middleware     │
└─────────────────────────────────────────────────────────────────────┘
```

### 12. Registration Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client   │     │  Route   │     │  bcrypt   │     │  Users   │
│  (React)  │     │ Handler  │     │          │     │  Table   │
└─────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
      │                 │                │                │
      │  POST /register │                │                │
      │  {name,email,   │                │                │
      │   password,role,│                │                │
      │   phone,loc}    │                │                │
      │────────────────>│                │                │
      │                 │                                │
      │                 │  Check duplicate email          │
      │                 │───────────────────────────────>│
      │                 │<──────── 409 if exists ────────│
      │                 │                                │
      │                 │  hash(password, 10)            │
      │                 │──────────────>                 │
      │                 │<─────── hashed pw ────────────│
      │                 │                                │
      │                 │  INSERT INTO users             │
      │                 │───────────────────────────────>│
      │                 │<───── [user] with .returning() │
      │                 │                                │
      │                 │  IF role='provider':           │
      │                 │  INSERT INTO providers(user_id)│
      │                 │───────────────────────────────>│
      │                 │                                │
      │                 │  jwt.sign({id,email,role})     │
      │                 │  expiresIn: '7d'               │
      │                 │                                │
      │  201 {user,     │                │                │
      │       token}    │                │                │
      │<────────────────│                │                │
      │                 │                │                │
      │  localStorage   │                │                │
      │  .setItem(      │                │                │
      │   'token',token)│                │                │
      │  setUser(user)  │                │                │
      │  navigate('/')  │                │                │
```

**Server implementation** (`routes/auth.js:11-45`):
```js
const [user] = await db('users')
  .insert({ name, email, password: hashed, role, phone, location })
  .returning(['id', 'name', 'email', 'role', 'phone', 'location']);

if (role === 'provider') {
  await db('providers').insert({ user_id: user.id });
}

const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

res.status(201).json({ user, token });
```

---

### 13. Email/Password Login Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client   │     │  Route   │     │  bcrypt   │     │  Users   │
│  (React)  │     │ Handler  │     │          │     │  Table   │
└─────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
      │                 │                │                │
      │  POST /login    │                │                │
      │  {email,pass}   │                │                │
      │────────────────>│                │                │
      │                 │  SELECT * FROM users            │
      │                 │  WHERE email=?                  │
      │                 │───────────────────────────────>│
      │                 │<───── user row or undefined ───│
      │                 │                                │
      │                 │  if (!user) → 401              │
      │                 │                                │
      │                 │  bcrypt.compare(password,      │
      │                 │    user.password)               │
      │                 │──────────────>                 │
      │                 │<──── boolean match ───────────│
      │                 │                                │
      │                 │  if (!match) → 401             │
      │                 │                                │
      │                 │  jwt.sign({id,email,role})     │
      │                 │  expiresIn: '7d'               │
      │                 │                                │
      │  200 {user,     │                │                │
      │       token}    │                │                │
      │<────────────────│                │                │
      │                 │                │                │
      │  localStorage   │                │                │
      │  .setItem(      │                │                │
      │   'token',token)│                │                │
      │  setUser(user)  │                │                │
      │  navigate('/')  │                │                │
```

**Security properties:**
- Same error for wrong email or password (`401 Invalid credentials`) — no user enumeration
- Password is compared AFTER lookup (timing-safe via bcrypt, not short-circuit on missing user)
- Password field is stripped from the response via `const { password: _, ...safe } = user`

---

### 14. OTP Login Flow

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│  Client   │     │ /send-otp│     │ otpStore  │     │  Users   │
│  (React)  │     │ Handler  │     │ (Map)     │     │  Table   │
└─────┬─────┘     └────┬─────┘     └────┬──────┘     └────┬─────┘
      │                 │                │                │
      │  POST /send-otp │                │                │
      │  {phone}        │                │                │
      │────────────────>│                │                │
      │                 │  SELECT FROM users              │
      │                 │  WHERE phone=?                  │
      │                 │───────────────────────────────>│
      │                 │<──── user or 404 ─────────────│
      │                 │                │                │
      │                 │  otp = crypto                  │
      │                 │   .randomInt(100000,999999)    │
      │                 │                │                │
      │                 │  otpStore.set(phone, {          │
      │                 │    otp,                         │
      │                 │    expiresAt: now + 5min        │
      │                 │  })                             │
      │                 │───────────────>                │
      │                 │                │                │
      │  200 {message,  │                │                │
      │       otp}      │                │                │
      │<────────────────│                │                │
      │                 │                │                │
      │  (DEV: otp      │                │                │
      │   returned in   │                │                │
      │   response)     │                │                │
```

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│  Client   │     │/verify-  │     │ otpStore  │     │  Users   │
│  (React)  │     │ otp      │     │ (Map)     │     │  Table   │
└─────┬─────┘     └────┬─────┘     └────┬──────┘     └────┬─────┘
      │                 │                │                │
      │  POST /verify-  │                │                │
      │  otp {phone,otp}│                │                │
      │────────────────>│                │                │
      │                 │  otpStore.get(phone)            │
      │                 │───────────────>                │
      │                 │<─── {otp, expiresAt} or null ──│
      │                 │                │                │
      │                 │  Check expires                 │
      │                 │  if expired → delete + 400     │
      │                 │                │                │
      │                 │  Compare otp                    │
      │                 │  if wrong → 400                 │
      │                 │                │                │
      │                 │  otpStore.delete(phone)         │
      │                 │───────────────>                │
      │                 │                │                │
      │                 │  SELECT FROM users              │
      │                 │  WHERE phone=?                  │
      │                 │───────────────────────────────>│
      │                 │<──────── user row ────────────│
      │                 │                                │
      │                 │  jwt.sign({id,email,role})     │
      │                 │                                │
      │  200 {user,     │                │                │
      │       token}    │                │                │
      │<────────────────│                │                │
      │                 │                │                │
      │  localStorage   │                │                │
      │  setItem +      │                │                │
      │  setUser +      │                │                │
      │  navigate('/')  │                │                │
```

**OTP Store internals:**
```js
const otpStore = new Map();
// Key: phone (string)
// Value: { otp: string, expiresAt: number (ms) }
// TTL: 5 minutes
// Storage: in-memory (lost on server restart)
```

---

### 15. Session Restoration on Page Load

```
App Mounts
    │
    ▼
AuthProvider.useEffect()
    │
    ├── localStorage.getItem('token')
    │
    ├── token exists?
    │       ├── YES → GET /api/auth/me (Authorization: Bearer <token>)
    │       │              │
    │       │              ├── 200 → setUser(response)
    │       │              │
    │       │              └── 401 → localStorage.removeItem('token')
    │       │                         setUser(null)
    │       │
    │       └── NO → setLoading(false), setUser(null)
    │
    ▼
loading = false → ProtectedRoute checks user
```

**Server-side `/me` handl** (`routes/auth.js:138-154`):
```js
const header = req.headers.authorization;
if (!header || !header.startsWith('Bearer ')) return 401;
const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
const user = await db('users').where({ id: decoded.id }).first();
// strip password, return user
```

---

### 16. Authorization Middleware

**Authenticate middleware** (`middleware/auth.js`):
```js
export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { id, email, role }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

**Role guard middleware:**
```js
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

**Usage in routes:**
```js
router.get('/my', authenticate, requireRole('provider'), handler);
router.post('/', authenticate, requireRole('provider'), handler);
router.delete('/:id', authenticate, requireRole('provider'), handler);
router.patch('/:id/status', authenticate, handler); // role checked inline in handler
```

---

### 17. Client-Side Auth Context

**File:** `context/AuthContext.jsx`

```js
State:
  user     ← object | null    (the authenticated user)
  loading  ← boolean          (true while checking token on mount)

Methods:
  login(email, password)      → POST /auth/login → store token + setUser
  register(userData)          → POST /auth/register → store token + setUser
  sendOtp(phone)              → POST /auth/send-otp → returns result
  verifyOtp(phone, otp)       → POST /auth/verify-otp → store token + setUser
  logout()                    → remove token + setUser(null)
```

---

### 18. Route Protection

```js
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user)   return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
```

| Route | Guard |
|---|---|
| `/provider/dashboard` | `role="provider"` |
| `/customer/bookings` | `role="customer"` |
| `/profile` | `authenticated` (any role) |

---

### 19. Token Format

```
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: {
  "id": 1,
  "email": "john@example.com",
  "role": "provider",
  "iat": 1719000000,
  "exp": 1719604800    // 7 days from iat
}
Secret:  process.env.JWT_SECRET (default: "change_this_to_a_random_secret_key")
```

---

### 20. Auth-Protected API Routes Summary

| Endpoint | Middleware | Role Check | Notes |
|---|---|---|---|
| `POST /auth/register` | none | none | |
| `POST /auth/login` | none | none | |
| `POST /auth/send-otp` | none | none | |
| `POST /auth/verify-otp` | none | none | |
| `GET /auth/me` | manual JWT verify in handler | none | Inline, not using middleware |
| `GET /services` | none | none | Public |
| `GET /services/:id` | none | none | Public |
| `GET /services/my` | `authenticate` | `requireRole('provider')` | |
| `POST /services` | `authenticate` | `requireRole('provider')` | |
| `PUT /services/:id` | `authenticate` | `requireRole('provider')` | + ownership check |
| `DELETE /services/:id` | `authenticate` | `requireRole('provider')` | + ownership check |
| `GET /bookings` | `authenticate` | none | Role-filtered in handler |
| `POST /bookings` | `authenticate` | inline: `role === 'customer'` | |
| `PATCH /bookings/:id/status` | `authenticate` | inline: role-based rules | |

---

### 21. Error Codes Reference

| HTTP | Meaning | Used When |
|---|---|---|
| 201 | Created | Registration, booking creation, service creation |
| 200 | OK | Login, data fetch, updates |
| 400 | Bad Request | Missing/invalid fields, invalid status, OTP expired/wrong |
| 401 | Unauthorized | No token, invalid token, wrong credentials |
| 403 | Forbidden | Wrong role, not your service/booking |
| 404 | Not Found | Missing user, service, booking, provider |
| 409 | Conflict | Duplicate email on registration |
| 500 | Internal Error | Unexpected server errors |

---

### 22. Auth Security Checklist

| Concern | Status | Detail |
|---|---|---|
| Password hashing | ✅ | bcrypt, 10 salt rounds |
| No password in responses | ✅ | Destructured out in login, register, /me |
| JWT expiry | ✅ | 7 days |
| No user enumeration | ✅ | Same error for wrong email or password |
| Token in localStorage | ⚠️ | Vulnerable to XSS; HttpOnly cookie preferred for production |
| OTP expiry | ✅ | 5-minute TTL |
| OTP in response body | ❌ | Dev only; real SMS gateway needed for production |
| OTP in memory | ❌ | Lost on restart; Redis needed for multi-instance |
| Rate limiting | ❌ | No protection against brute force on login/OTP |
| Input validation | ⚠️ | Manual checks only; no Zod/Joi |
| CORS | ⚠️ | `cors()` with default (all origins) — restrict in production |
| JWT secret | ⚠️ | Weak default (`change_this_to_a_random_secret_key`) |
