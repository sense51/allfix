# Product Requirements Document — ALLFIX

**Product Name:** ALLFIX  
**Tagline:** Find trusted home service professionals in minutes  
**Status:** v1.0 (MVP)  
**Last Updated:** June 23, 2026

---

## 1. Executive Summary

ALLFIX is a two-sided marketplace that connects customers with local home service providers (electricians, mechanics, cleaners, and more). Customers browse services, book appointments, and manage their bookings. Providers list their services, manage incoming bookings, and grow their business — all from a single platform.

---

## 2. Problem Statement

- **For customers:** Finding reliable, vetted home service professionals is fragmented — word-of-mouth, Google searches, and multiple apps. No unified platform to browse, compare, book, and track all home services.
- **For providers:** Acquiring customers requires paid ads, referrals, or listing on generic directories. No dedicated tool to manage bookings, availability, and customer communication in one place.

---

## 3. Target Users

### Customers
- Homeowners and renters needing repair, maintenance, or cleaning services
- Age 25–55, tech-literate, value convenience and transparency
- **Primary need:** Quickly find, compare, and book a trusted professional

### Service Providers
- Independent contractors and small business owners in home services
- Electricians, mechanics, cleaners, and similar trades
- **Primary need:** Get booked by local customers and manage appointments efficiently

---

## 4. User Stories

### Customers
| ID | Story | Priority |
|---|---|---|
| C-1 | As a customer, I want to browse services by category so I can find what I need | P0 |
| C-2 | As a customer, I want to view service details (price, duration, provider info, rating) before booking | P0 |
| C-3 | As a customer, I want to book a service at a scheduled time with optional notes | P0 |
| C-4 | As a customer, I want to see my booking history and status | P0 |
| C-5 | As a customer, I want to cancel a pending booking | P0 |
| C-6 | As a customer, I want to register and log in (email or phone OTP) | P0 |
| C-7 | As a customer, I want to leave a review and rating after a completed service | P0 |
| C-8 | As a customer, I want to search services by name or keyword | P1 |
| C-9 | As a customer, I want to save favorite providers | P2 |

### Providers
| ID | Story | Priority |
|---|---|---|
| P-1 | As a provider, I want to register and set up my provider profile | P0 |
| P-2 | As a provider, I want to create, edit, and delete my service listings | P0 |
| P-3 | As a provider, I want to view incoming bookings and their status | P0 |
| P-4 | As a provider, I want to confirm or decline pending bookings | P0 |
| P-5 | As a provider, I want to mark bookings as completed | P0 |
| P-6 | As a provider, I want to see customer details on bookings | P0 |
| P-7 | As a provider, I want to see my average rating and reviews | P0 |
| P-8 | As a provider, I want to set my availability schedule | P2 |

### Both
| ID | Story | Priority |
|---|---|---|
| B-1 | As any user, I want a profile page with my details | P0 |
| B-2 | As any user, I want to log out securely | P0 |

---

## 5. Functional Requirements

### 5.1 Authentication & Accounts

| FR-ID | Description | Acceptance Criteria |
|---|---|---|
| FR-1 | User can register with name, email, password, role (customer/provider), phone, location | Form validates all fields; duplicate email returns 409; provider accounts auto-create a provider profile |
| FR-2 | User can log in with email + password | JWT returned and stored in localStorage; session persists across page refreshes |
| FR-3 | User can log in via phone OTP | 6-digit OTP sent (logged to console in dev); expires after 5 minutes |
| FR-4 | User can view their profile | Shows name, email, role, phone, location, member-since date |
| FR-5 | User can log out | Token removed from localStorage; user state cleared; redirected to landing |
| FR-6 | JWT token expires after 7 days | Token refresh required after expiry; expired tokens silently removed |

### 5.2 Service Listings

| FR-ID | Description | Acceptance Criteria |
|---|---|---|
| FR-6 | Public can browse all services | Services displayed in a responsive grid with category filter |
| FR-7 | Public can view service detail | Shows title, description, price, duration, provider name/location/rating/phone/bio |
| FR-8 | Provider can create a service | Requires category (electric/motorcycle/car/cleaning/computer/phone), title, description, price, duration, currency |
| FR-9 | Provider can edit their own services | Only the owning provider can edit; validates ownership |
| FR-10 | Provider can delete their own services | Only the owning provider can delete; cascading delete for associated bookings |

### 5.3 Bookings

| FR-ID | Description | Acceptance Criteria |
|---|---|---|
| FR-11 | Customer can book a service | Requires selecting a scheduled time; optional notes; status defaults to "pending" |
| FR-12 | Customer can view their bookings | Shows all bookings with service details and status; ordered by most recent |
| FR-13 | Customer can cancel a pending booking | Only "pending" bookings can be cancelled; status changes to "cancelled" |
| FR-14 | Provider can view bookings for their services | Shows customer name, service details, scheduled time, notes (excludes OTP from response data for security) |
| FR-15 | Provider can confirm a booking | Status changes from "pending" to "confirmed", generating a secure 4-digit customer OTP |
| FR-16 | Provider can complete bookings | Only the service's provider can change status to completed, requiring entering the correct customer OTP code |
| FR-18 | Customer views completion OTP | Customer sees the generated OTP on their confirmed booking details to share with the provider once service is done |

### 5.4 Landing Page

| FR-ID | Description | Acceptance Criteria |
|---|---|---|
| FR-17 | Public landing page promotes the platform | Hero section with tagline and CTA; category cards with icons; animated stats; "How It Works" section; provider signup CTA |

---

## 6. Non-Functional Requirements

| NFR-ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | Pages load in under 2 seconds on standard broadband |
| NFR-2 | Security | Passwords hashed with bcrypt (10 rounds); JWT for session mgmt; no secrets in client code |
| NFR-3 | Availability | Server responds to health check at GET /api/health |
| NFR-4 | Scalability | OTP store is in-memory (single-process); future: switch to Redis |
| NFR-5 | Browser Support | Modern browsers (Chrome, Firefox, Safari, Edge — last 2 major versions) |
| NFR-6 | Mobile | Mobile-responsive layout with hamburger nav and adaptive grids |
| NFR-7 | Database | SQLite for development; PostgreSQL-ready for production |

---

## 7. Architecture Overview

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Tailwind CSS 3, Vite 5 |
| Backend | Express.js 4, Knex 3 (query builder) |
| Database | SQLite 3 (dev) / PostgreSQL (prod) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Runtime | Node.js 18+, ECMAScript Modules |

### System Context

```
[Browser] ──HTTP──> [Express API :3001] ──Knex──> [SQLite/PostgreSQL]
                        │
                   [JWT Auth Middleware]
```

### Data Model (5 tables)

```
users ──1:1──> providers
users ──1:N──> bookings (as customer)
providers ──1:N──> services
services ──1:N──> bookings
bookings ──1:1──> reviews
```

---

## 8. Route Map

### Frontend Routes

| Path | Page | Access |
|---|---|---|
| `/` | Landing | Public |
| `/register` | Register | Public |
| `/login` | Login | Public |
| `/services` | Browse Services | Public |
| `/services/:id` | Service Detail | Public |
| `/provider/dashboard` | Provider Dashboard | Provider only |
| `/customer/bookings` | Customer Bookings | Customer only |
| `/profile` | Profile | Authenticated |

### API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Email/password login |
| POST | /api/auth/send-otp | No | Send OTP to phone |
| POST | /api/auth/verify-otp | No | Verify OTP |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/services | No | List services |
| GET | /api/services/my | Provider | List my services |
| GET | /api/services/:id | No | Get service detail |
| POST | /api/services | Provider | Create service |
| PUT | /api/services/:id | Provider | Update service |
| DELETE | /api/services/:id | Provider | Delete service |
| GET | /api/bookings | Yes | List bookings |
| POST | /api/bookings | Customer | Create booking |
| PATCH | /api/bookings/:id/status | Yes | Update booking status |
| GET | /api/reviews/provider | Provider | Get reviews for provider services |
| GET | /api/reviews/booking/:bookingId | Customer | Fetch review for customer booking |
| POST | /api/reviews | Customer | Submit review for completed booking |
| GET | /api/health | No | Health check |

---

## 9. Design Guidelines

- **Visual identity:** Brand name "ALLFIX" — clean, modern, trustworthy
- **Primary color:** Brand-500 (vivid orange, `#f97316`) with category accent colors (electric=orange, motorcycle=rose, car=sky, cleaning=emerald, computer=violet, phone=teal)
- **Typography:** Plus Jakarta Sans font stack
- **Responsive:** Mobile-friendly with light glass responsive layout and custom breakpoints
- **Animations:** Subtle spring animations, entry stagger, clean radial highlights, scale-in states, skeleton card shimmer loaders

---

## 10. Known Gaps (Post-MVP)

| Gap | Description | Suggested Priority |
|---|---|---|
| Search | No keyword/search endpoint for services | P1 |
| Provider Availability | No scheduling/availability management | P2 |
| Payment | No payment integration | P2 |
| Real Notifications | No email/SMS/push notifications for booking updates | P2 |
| Admin Panel | No admin dashboard for platform management | P2 |
| Image Uploads | No service/avatar image support | P2 |
| Multiple OTP Store | In-memory Map doesn't scale; needs Redis | P1 |
| Input Validation | Manual checks; should use Zod/Joi | P1 |
| Error Handling UX | Some errors logged to console only; needs user-facing toasts | P1 |
| Provider Verification | `is_verified` column exists but no verification flow | P2 |
| Pagination | No pagination for services or bookings lists | P2 |
| Customer Address | No address field on bookings (only location on user) | P2 |

---

## 11. Success Metrics

| Metric | Target |
|---|---|
| Pages load < 2s | ≥ 95% of visits |
| User registration completion rate | ≥ 70% |
| Booking conversion (browse → book) | ≥ 15% |
| Provider booking confirmation rate | ≥ 90% within 24h |
| Mobile traffic support | ≥ 40% of sessions |
