# ALLFIX — App Flow: User Journeys & Navigation Map

---

## 1. Navigation Map (Sitemap)

```
                                ┌─────────────┐
                                │   Landing    │  (Public)
                                │     /        │
                                └──────┬──────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
        ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
        │   Register    │      │    Login      │      │   Browse     │
        │   /register  │      │   /login     │      │  /services   │
        └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
               │                     │                     │
               │         ┌───────────┘                     │
               │         ▼                                 ▼
               │  ┌──────────────┐                ┌──────────────┐
               │  │  Auth Gate   │                │Service Detail│
               │  │(JWT created) │                │ /services/:id│
               │  └──────┬───────┘                └──────┬───────┘
               │         │                              │
               ▼         ▼                              ▼
        ┌─────────────────────────────────────────────────────┐
        │                    LANDING (/)                       │
        │          (post-auth, user now in context)            │
        └─────────────────────┬───────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
    ┌────────────────┐ ┌────────────┐ ┌──────────────┐
    │    Profile      │ │   Browse   │ │   Navbar      │
    │   /profile     │ │ /services  │ │  (role-based) │
    └────────────────┘ └────────────┘ └──────┬────────┘
                                             │
                              ┌──────────────┼──────────────┐
                              │              │              │
                              ▼              ▼              ▼
                    ┌────────────────┐ ┌────────────┐ ┌──────────────┐
                    │ Provider       │ │ Customer   │ │   Profile    │
                    │ Dashboard      │ │ Bookings   │ │   /profile   │
                    │/provider/      │ │/customer/  │ │              │
                    │dashboard       │ │bookings    │ └──────────────┘
                    └───────┬────────┘ └─────┬──────┘
                            │                │
              ┌─────────────┼─────┐          │
              │             │     │          │
              ▼             ▼     ▼          ▼
       ┌──────────┐ ┌──────────┐ ┌──────────────┐
       │Create    │ │ Edit     │ │ View         │
       │Service   │ │ Service  │ │ Booking      │
       │(modal)   │ │ (modal)  │ │ Details      │
       └──────────┘ └──────────┘ │ (inline)     │
                                 └──────────────┘
```

---

## 2. User Personas & Journeys

### Persona A: Alex — Homeowner (Customer)

**Demographics:** 32, owns a home, works 9–5, needs quick access to reliable tradespeople  
**Goal:** Find and book a electrician to fix a faulty outlet  
**Frustration:** Doesn't want to call around for quotes

---

#### Journey A1 — First-Time Registration & Booking

```
STEP 1: LANDING
  ┌─ User arrives at allfix.com
  │  Sees hero: "Find trusted home service professionals in minutes"
  │  Scans category cards: Electrical, Motorcycle, Automotive, Cleaning, Computer, Phone
  │  Clicks "Get Started" CTA
  ├─▶ /register

STEP 2: REGISTER
  ┌─ Fills form: Name, Email, Password, selects "Customer", Phone, Location
  │  Toggles role selector to "Customer" (highlighted)
  │  Clicks "Create Account"
  ├─▶ API: POST /api/auth/register → { user, token }
  └─▶ Redirects to Landing (now authenticated)

STEP 3: LANDING (post-auth)
  ┌─ Navbar now shows: Browse, My Bookings, [Avatar] John, Logout
  │  Clicks "Browse" or one of the category cards (e.g. Electrical)
  ├─▶ /services?category=electric

STEP 4: BROWSE SERVICES
  ┌─ Sees grid of filtered services with animated entrance
  │  "Electrical Wiring Repair" — $80, 60min, John, ★4.5
  │  "Ceiling Fan Installation" — $120, 90min, John, ★4.5
  │  Reads description, checks pricing, clicks the wiring service
  ├─▶ /services/1

STEP 5: SERVICE DETAIL
  ┌─ Full detail view:
  │  Title, description, price, duration
  │  Provider: John Electrician, Downtown, phone, bio, rating
  │  Right column: Sticky booking card
  │  Selects date/time in scheduler
  │  Adds note: "Outlet in the kitchen isn't working"
  │  Clicks "Book Now"
  ├─▶ API: POST /api/bookings → 201 Created
  └─▶ Success toast / redirect

STEP 6: MY BOOKINGS
  ┌─ /customer/bookings
  │  Sees booking card:
  │  "Electrical Wiring Repair" — PENDING (amber badge, pulsing dot)
  │  Timeline: ● Pending ○ Confirmed ○ Completed
  │  Scheduled: Today at 2:00 PM
  │  Cancel button active (pending status)
  │  Waits for provider to confirm
  └─▶ Exits app

STEP 7: RETURN — CHECK STATUS
  ┌─ Logs in again → /login
  │  Dashboard shows confirmed booking
  │  Timeline: ● Pending ● Confirmed ○ Completed
  │  Cancel button now disabled
  └─▶

STEP 8: POST-SERVICE
  ┌─ Customer shares their unique 4-digit OTP shown on the confirmed booking card with the provider
  │  Booking is marked "Completed" by the provider after entering the correct OTP
  │  Timeline: ● Pending ● Confirmed ● Completed
  │  Clicks "Leave a Review" button on booking card
  │  Submits star rating (1-5) and comments in the review modal
  │  Reviews and ratings are immediately computed for the provider
  └─▶
```

---

#### Journey A2 — Returning Customer (Phone OTP Login)

```
STEP 1: LOGIN PAGE
  ┌─ Clicks "Sign In" in navbar
  │  Toggle switches to "OTP" mode
  │  Enters phone: 555-0103
  │  Clicks "Send OTP"
  ├─▶ API: POST /api/auth/send-otp → OTP logged to console
  │  Checks phone (dev: checks console), enters 6-digit code
  │  Clicks "Verify OTP"
  ├─▶ API: POST /api/auth/verify-otp → { user, token }
  └─▶ Redirects to Landing → navigates to bookings
```

---

#### Journey A3 — Browse Without Booking

```
STEP 1: LANDING → clicks "Browse" in navbar
STEP 2: /services — views all services, no category filter
STEP 3: Clicks category tab "Motorcycle" → URL updates to ?category=motorcycle
STEP 4: Sees "Motorcycle Oil Change" — $50, 45min
STEP 5: Clicks card → /services/:id → reads details
STEP 6: Not ready to book → closes tab
         (No account required to browse)
```

---

### Persona B: Jane — Service Provider (Electrician)

**Demographics:** 45, runs a small electrical business, wants online bookings without website costs  
**Goal:** List services and manage incoming bookings  
**Frustration:** Currently relies on phone calls and word-of-mouth

---

#### Journey B1 — Provider Registration & First Service Listing

```
STEP 1: LANDING
  ┌─ Scrolls to "Become a Provider" CTA section
  │  Clicks "Join as a Provider"
  ├─▶ /register

STEP 2: REGISTER
  ┌─ Selects "Provider" role (highlighted with different style)
  │  Fills: Name, Email, Password (store name as business name), Phone, Location
  │  Clicks "Create Account"
  ├─▶ API: POST /api/auth/register → auto-creates providers row
  └─▶ Redirects to Landing

STEP 3: PROVIDER DASHBOARD
  ┌─ Navbar now shows: Browse, Dashboard, [J] Jane, Logout
  │  Clicks "Dashboard"
  ├─▶ /provider/dashboard
  │  Sees:
  │  ┌─ Stats row: 0 Services · 0 Bookings · ★ 0.0 Rating
  │  └─ "You haven't listed any services yet" empty state
  │  Clicks "Add Your First Service"
  ├─▶ Opens Create Service form/modal

STEP 4: CREATE SERVICE
  ┌─ Fills:
  │  Category: Electrical
  │  Title: "Home Rewiring Service"
  │  Description: "Full home rewiring, code compliant, free estimate"
  │  Price: 250
  │  Duration: 180 minutes
  │  Clicks "Create Service"
  ├─▶ API: POST /api/services → 201 Created
  └─▶ Refreshes dashboard → shows 1 service

STEP 5: MANAGE SERVICES
  ┌─ Dashboard now shows:
  │  Stats: 1 Service · 0 Bookings · ★ 0.0
  │  Service card: "Home Rewiring" — $250, 180min
  │  Action buttons: Edit (pencil icon), Delete (trash icon)
  │  Clicks Edit → pre-filled form → updates title → saves
  ├─▶ API: PUT /api/services/:id
  └─▶

STEP 6: RECEIVE BOOKING
  ┌─ Notification (future) / refreshes dashboard
  │  Stats: 1 Service · 1 Booking · ★ 0.0
  │  Bookings section appears with card:
  │  "Home Rewiring" — Bob Customer
  │  PENDING (amber) — Scheduled: Tomorrow 10:00 AM
  │  Notes: "Need the whole house done"
  │  Action buttons: ✓ Confirm  ✕ Decline
  │  Clicks Confirm
  ├─▶ API: PATCH /api/bookings/:id/status → "confirmed"
  └─▶ Status updates to CONFIRMED (blue badge, pulsing dot)

STEP 7: COMPLETE JOB
  ┌─ After service delivery, returns to dashboard
  │  Finds the booking, clicks "Complete"
  │  Prompts for the Customer's 4-digit verification OTP in the verification modal
  │  Enters correct OTP code
  ├─▶ API: PATCH /api/bookings/:id/status → "completed" (with body status & otp)
  └─▶ Status updates to COMPLETED (green badge)
```

---

#### Journey B2 — Provider Manages Multiple Services

```
STEP 1: Dashboard shows 3 services listed
  ┌─ Stat cards: 3 Services · 5 Bookings · ★ 4.7
  │  Service 1: 2 pending bookings
  │  Service 2: 1 confirmed, 1 completed
  │  Service 3: 0 bookings
  │  Clicks Edit on Service 3 → updates price
  │  Clicks Delete on Service 3 → removes it
  ├─▶ API: DELETE /api/services/:id
  └─▶ Refreshes → 2 services remaining
```

---

## 3. Key Micro-Journeys (Edge Cases)

### 3.1 Unauthenticated User Tries Protected Route

```
User clicks /provider/dashboard directly
  └─▶ ProtectedRoute checks user → null
  └─▶ <Navigate to="/login" replace />
      (No flash of content — loading spinner while AuthContext initializes)
```

### 3.2 Customer Tries Provider Route

```
Customer logs in → manually navigates to /provider/dashboard
  └─▶ ProtectedRoute checks role="provider" → mismatch
  └─▶ <Navigate to="/" replace />
```

### 3.3 Expired Token on App Load

```
User returns after 8+ days → localStorage has old token
  └─▶ AuthProvider mount → GET /api/auth/me
  └─▶ 401 response → .catch → localStorage.removeItem('token')
  └─▶ user = null, loading = false
  └─▶ Protected routes redirect to /login
      (Seamless — user sees login page, no error displayed)
```

### 3.4 Cancel Booking Before Provider Confirms

```
Customer on /customer/bookings
  ┌─ Booking is PENDING
  │  Clicks "Cancel"
  ├─▶ API: PATCH /api/bookings/:id/status → "cancelled"
  └─▶ Badge turns gray "CANCELLED" — no further actions allowed
```

### 3.5 Provider Tries to Delete Service with Active Bookings

```
(on DELETE /api/services/:id)
  └─▶ Database CASCADE: bookings, reviews deleted automatically
  └─▶ No explicit guard in route handler
      (Risk: provider can delete service with active confirmed bookings)
```

---

## 4. Cross-Role Navigation Matrix

| Current Page → | Guest | Customer | Provider |
|---|---|---|---|
| **Landing /** | Hero, categories, stats, how-it-works, provider CTA | Same + auth navbar | Same + auth navbar |
| **Register /register** | Full form | Redirect to / | Redirect to / |
| **Login /login** | Full form (password + OTP) | Redirect to / | Redirect to / |
| **Browse /services** | Full access | Full access + can book | Full access |
| **Service Detail /services/:id** | Full access | Full access + book CTA | Full access |
| **Provider Dashboard /provider/dashboard** | Redirect → /login | Redirect → / | Services CRUD + bookings mgmt |
| **Customer Bookings /customer/bookings** | Redirect → /login | Booking history + cancel | Redirect → / |
| **Profile /profile** | Redirect → /login | View profile | View profile |

---

## 5. State Transition Diagram — Bookings

```
                         ┌──────────┐
                         │  PENDING  │
                         └────┬─────┘
                      ┌───────┼───────┐
                      │       │       │
                      ▼       ▼       ▼
                 ┌────────┐ ┌─────┐ ┌──────────┐
                 │CANCEL  │ │CONF │ │ DECLINE  │
                 │(cust)  │ │(prov)│ │ (prov)   │
                 └────────┘ └──┬───┘ └──────────┘
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

  Allowed transitions:
    pending  → confirmed  (provider)
    pending  → cancelled  (customer)
    pending  → cancelled  (provider, via decline)
    confirmed → completed (provider)
    confirmed → cancelled (provider)

  NOT allowed:
    confirmed → cancelled (customer) — API blocks this
    completed → * (terminal state)
    cancelled → * (terminal state)
```

---

## 6. Navigation UI Components

### 6.1 Navbar (Responsive)

```
DESKTOP (≥768px):
┌──────────────────────────────────────────────────────────────┐
│ [ALLFIX logo]  Browse   [Dashboard|My Bookings] [Avatar] 👤 │
│                                            [Logout]         │
└──────────────────────────────────────────────────────────────┘

MOBILE (<768px):
┌──────────────────────┐
│ [ALLFIX logo]    [≡] │
└──────────────────────┘
         ↓ tap hamburger
┌──────────────────────┐
│ Browse Services      │
│ ───────────────────  │
│ Dashboard (provider) │
│ ───────────────────  │
│ Profile              │
│ Logout               │
└──────────────────────┘
```

### 6.2 Glassmorphism Behavior

```
scrollY > 30px:
  bg-white/80 backdrop-blur-2xl border border-gray-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)]

scrollY ≤ 30px:
  bg-white/50 backdrop-blur-md border border-gray-200/40 shadow-sm
```

---

## 7. Page-by-Page Screen Flow

### Landing Page
```
┌──────────────────────────────────────────────────┐
│ [NAVBAR]                                         │
│                                                   │
│ ┌────────────────────────────────────────────┐    │
│ │  HERO                                       │    │
│ │  "Fix it fast. Fix it right."              │    │
│ │  [Browse Services] [Join as Provider]      │    │
│ └────────────────────────────────────────────┘    │
│                                                   │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│ │⚡   │ │  🏍 │ │  🚗 │ │  🧹 │ │  💻 │ │  📱 │     │
│ │Elec │ │Moto │ │ Auto│ │Clean│ │Comp │ │Phone│     │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘     │
│                                                   │
│ ┌──────┐ ┌──────┐ ┌──────┐                       │
│ │ 50+  │ │ 100+ │ │ 4.8★ │                       │
│ │Pro's │ │ Jobs │ │Rating│                       │
│ └──────┘ └──────┘ └──────┘                       │
│                                                   │
│  HOW IT WORKS (3 steps)                          │
│  ① Browse  ② Book  ③ Get fixed                  │
│                                                   │
│  PROVIDER CTA                                     │
│  "Grow your business with ALLFIX"                │
│  [Join as a Provider]                            │
└──────────────────────────────────────────────────┘
```

### Browse Services
```
┌──────────────────────────────────────────────────┐
│ [NAVBAR]                                         │
│                                                   │
│  Search input (future)                           │
│  [All] [Electrical] [Motorcycle] [Auto] [Cleaning] [Comp] [Phone]│
│                                                   │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│ │⚡ Wiring     │ │  🏍 Oil Change│ │  🚗 Brake    ││
│ │  $80 · 60min │ │  $50 · 45min │ │  $150 · 120m ││
│ │  John ★4.5   │ │  Jane ★4.8   │ │  Jane ★4.8   ││
│ └──────────────┘ └──────────────┘ └──────────────┘│
│ ┌──────────────┐ ┌──────────────┐                 │
│ │🧹 Deep Clean │ │🧹 Kitchen    │                 │
│ │  $130 · 180m │ │  $85 · 120m  │                 │
│ │  Emily ★4.9  │ │  Emily ★4.9  │                 │
│ └──────────────┘ └──────────────┘                 │
└──────────────────────────────────────────────────┘
```

### Service Detail
```
┌──────────────────────────────────────────────────┐
│ [NAVBAR]                                         │
│                                                   │
│ ┌─────────────────────────┐ ┌──────────────────┐ │
│ │  SERVICE INFO (2/3)     │ │  BOOKING CARD    │ │
│ │                         │ │  (1/3, sticky)    │ │
│ │  ⚡ Electrical          │ │                   │ │
│ │  ★ 4.5                  │ │  Price: $80       │ │
│ │                         │ │  Duration: 60min  │ │
│ │  Electrical Wiring      │ │                   │ │
│ │  Repair                 │ │  [Date picker]    │ │
│ │                         │ │  [Time slot]      │ │
│ │  Description...         │ │                   │ │
│ │                         │ │  [Notes field]    │ │
│ │  PROVIDER               │ │                   │ │
│ │  John Electrician       │ │  [Book Now]       │ │
│ │  Downtown · ★4.5       │ │                   │ │
│ │  10 years experience   │ └──────────────────┘ │
│ └─────────────────────────┘                      │
└──────────────────────────────────────────────────┘
```

### Provider Dashboard
```
┌──────────────────────────────────────────────────┐
│ [NAVBAR]                                         │
│                                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐                │
│  │ 3      │ │ 5      │ │ ★ 4.7  │                │
│  │Services│ │Bookings│ │Rating  │                │
│  └────────┘ └────────┘ └────────┘                │
│                                                   │
│  [Add New Service]                               │
│                                                   │
│  YOUR SERVICES                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ Electrical Wiring Repair    $80   [Edit] │    │
│  │  2 pending bookings                      │    │
│  ├──────────────────────────────────────────┤    │
│  │ Ceiling Fan Installation    $120  [Edit] │    │
│  │  0 bookings                              │    │
│  └──────────────────────────────────────────┘    │
│                                                   │
│  BOOKINGS                                         │
│  ┌──────────────────────────────────────────┐    │
│  │ 🔧 Wiring Repair — Bob                   │    │
│  │ PENDING ●  Tomorrow 10:00 AM            │    │
│  │ [Confirm] [Decline]                      │    │
│  ├──────────────────────────────────────────┤    │
│  │ 🔧 Wiring Repair — Alice                 │    │
│  │ CONFIRMED ●  Today 2:00 PM              │    │
│  │ [Complete]                               │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### Customer Bookings
```
┌──────────────────────────────────────────────────┐
│ [NAVBAR]                                         │
│                                                   │
│  MY BOOKINGS                                      │
│                                                   │
│  ┌──────────────────────────────────────────┐    │
│  │ ⚡ Electrical Wiring Repair               │    │
│  │ PENDING ●  Tomorrow 10:00 AM            │    │
│  │ Provider: John Electrician              │    │
│  │ Timeline: ●○○                            │    │
│  │ [Cancel Booking]                         │    │
│  ├──────────────────────────────────────────┤    │
│  │ 🧹 Deep Home Clean                       │    │
│  │ CONFIRMED ●  Fri 2:00 PM                │    │
│  │ Provider: Emily Cleaner                 │    │
│  │ Timeline: ●●○                            │    │
│  ├──────────────────────────────────────────┤    │
│  │ 🏍 Motorcycle Oil Change                 │    │
│  │ COMPLETED ●  Last week                  │    │
│  │ Provider: Jane Mechanic                 │    │
│  │ Timeline: ●●●                            │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

---

## 8. Global Navbar — Role-Based State Table

| State | Visible Links | Hidden |
|---|---|---|
| **Guest** (no user) | ALLFIX logo, Browse, Sign In, Get Started | Dashboard, My Bookings, Profile, Logout |
| **Customer** | ALLFIX logo, Browse, My Bookings, Avatar, Logout | Dashboard, Get Started |
| **Provider** | ALLFIX logo, Browse, Dashboard, Avatar, Logout | My Bookings, Get Started |

---

## 9. Key User Flows (Sequences)

### Flow 1: Customer Books a Service

```
[Landing] → click "Browse"
    → [/services] click category tab "Electrical"
    → [/services?category=electric] click "Electrical Wiring Repair"
    → [/services/1] view details
        → [auth gate: is user logged in?]
            ├── NO  → [/login] → login/register → back to /services/1
            └── YES → select date/time → add notes → click "Book Now"
                → API success → toast "Booking confirmed!"
                → [/customer/bookings] view pending booking
```

### Flow 2: Provider Manages Booking

```
[Landing → Navbar → Dashboard]
    → [/provider/dashboard] view incoming bookings
    → find "PENDING" card
        → click "Confirm"
            → API success → badge turns "CONFIRMED" (blue)
        → OR click "Decline"
            → API success → badge turns "CANCELLED" (gray)
    → find "CONFIRMED" card after job done
        → click "Complete"
            → API success → badge turns "COMPLETED" (green)
```

### Flow 3: Guest → Customer Complete Lifecycle

```
[/] Landing → [/register] Create Account → [/] Landing (auth)
    → [/services] Browse → [/services/1] View detail → [/customer/bookings] Book
    → [offline, job happens] → [/login] Return → [/customer/bookings] Track
    → [job done, completed] → Clicks "Leave a Review" → Submit rating and comments
```

### Flow 4: Guest → Provider Complete Lifecycle

```
[/] Landing → [/register] Create Provider Account → [/] Landing (auth)
    → [/provider/dashboard] → Add Service → Manage Listings
    → Receive booking → Confirm → Complete job
    → Clicks reviews tab or scans rating on profile / dashboard
```

---

## 10. Error/Edge Case Flows

### 10.1 Registration — Duplicate Email

```
[/register] → enter existing email "john@example.com" → submit
    → API: 409 "Email already registered"
    → Error banner shown above form
    → User edits email or navigates to /login
```

### 10.2 Login — Wrong Password

```
[/login] → enter email + wrong password → submit
    → API: 401 "Invalid credentials"
    → Error banner shown (no indication whether email or password is wrong)
    → User retries or uses OTP flow
```

### 10.3 Booking — Service Not Found (Race Condition)

```
User opens /services/1 in tab A
Provider deletes service from dashboard in tab B
User clicks "Book Now" in tab A
    → API: POST /api/bookings → service_id=1 → 404 "Service not found"
    → Error message displayed
    → User redirected back to /services
```

### 10.4 Empty States

```
No services in category:
  [/services?category=car] → "No services found in this category"
  → "Browse all categories" link

No bookings (customer):
  [/customer/bookings] → "No bookings yet"
  → "Browse Services" CTA

No services (provider):
  [/provider/dashboard] → "You haven't listed any services yet"
  → "Add Your First Service" CTA
```
