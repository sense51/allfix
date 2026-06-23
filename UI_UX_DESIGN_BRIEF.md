# UI/UX Design Brief — ALLFIX

**Product:** ALLFIX — Home Services Marketplace  
**Version:** 1.0  
**Last Updated:** June 23, 2026

---

## 1. Brand Identity

### 1.1 Brand Essence

ALLFIX is a trust-first marketplace. The brand should feel **warm, capable, and human** — like a skilled neighbor who shows up on time. It's not cold-industrial (like a tool brand) nor overly playful (like a consumer app). It sits in the middle: **professional but approachable**.

| Attribute | Expression |
|---|---|
| Trustworthy | Warm orange tones, clean cards, clear CTAs |
| Capable | Bold typography, confident spacing, decisive buttons |
| Local | Rounded corners, soft shadows, human avatars |
| Modern | Glassmorphism, subtle motion, generous whitespace |

### 1.2 Logo

- **Logomark:** Fused wrench and lightning bolt icon
  - Rendered inline inside the navbar inside a gradient rounded-xl box from brand-500 to neon-orange
  - Provides dual service/speed brand association
- **Wordmark:** "ALLFIX" in bold, with "FIX" in brand-500
  - Tracking-tight, Plus Jakarta Sans font stack
- **Tagline:** "Find trusted home service professionals in minutes"

### 1.3 Color System

#### Brand (Primary — Orange)

```
brand-50:  #fff4e6    (bg, hover states)
brand-100: #ffe3b3    (light borders)
brand-200: #ffc966
brand-300: #ffae1a
brand-400: #ff9500
brand-500: #f97316    (primary buttons, links, active states) ★
brand-600: #ea6b0a    (hover on primary)
brand-700: #c05208    (active/pressed)
brand-800: #9a3f08
brand-900: #7c300a    (text on brand backgrounds)
```

Orange communicates warmth, energy, and affordance. It's used for primary actions, active states, and key accents.

#### Surface (Neutral Warm)

```
surface-50:  #faf8f5    (page background) ★
surface-100: #f5f0ea    (card alternative bg)
surface-200: #e9dfd3
surface-300: #d9c8b4
surface-400: #c9ab8f
surface-500: #bd9574
surface-600: #b08268
surface-700: #936b58
surface-800: #785849
surface-900: #624a3e
```

Warm neutrals replace cool grays to keep the interface feeling human. The page bg is a subtle warm off-white.

#### Category Accents

| Category | Color | Token Usage |
|---|---|---|
| Electrical | brand-500 (orange) | Badge bg, gradient icons |
| Motorcycle | rose-500 | Badge, gradient |
| Automotive | sky-500 | Badge, gradient |
| Cleaning | emerald-500 | Badge, gradient |
| Computer Repair | violet-500 | Badge, gradient |
| Phone Repair | teal-500 | Badge, gradient |

#### Status Semantics

| Status | Color | Token |
|---|---|---|
| Pending | amber-500 | Badge bg, pulsing dot |
| Confirmed | blue-500 | Badge bg, pulsing dot |
| Completed | green-500 | Badge bg |
| Cancelled | gray-400 | Badge bg, muted text |
| Error | red-500 | Buttons, alert banners |
| Success | green-50 bg / green-700 text | Success banners |

#### Gray Scale (Neutral)

```
gray-50:   #f9fafb
gray-100:  #f3f4f6    (borders, dividers)
gray-200:  #e5e7eb    (input borders, card borders)
gray-300:  #d1d5db
gray-400:  #9ca3af    (placeholder text, secondary icons)
gray-500:  #6b7280    (body secondary text)
gray-600:  #4b5563    (body text)
gray-700:  #374151    (labels, headings)
gray-800:  #1f2937
gray-900:  #111827    (primary headings)
```

---

## 2. Typography

### 2.1 Font Stack

```css
font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
```

**Inter** weights used: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extra bold)

### 2.2 Type Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| Hero | 5xl–7xl (48–72px) | 700 | Landing page headline |
| H1 | 2xl (24px) | 700 | Page titles |
| H2 | text-xl (20px) | 700 | Section headers |
| H3 | text-lg (18px) | 600 | Card titles |
| H4 | text-base (16px) | 600 | Sub-section titles |
| Body | text-sm (14px) | 400 | Paragraphs, descriptions |
| Small | text-xs (12px) | 500/600 | Labels, badges, metadata |
| Caption | text-xs (12px) | 400 | Helper text |

### 2.3 Line Height

- Headings: `leading-[1.08]` (tight, impactful)
- Body: `leading-relaxed` (readable)
- Small text: `leading-normal`

### 2.4 Selection

```css
::selection {
  background: brand-500 at 20% opacity;
  color: brand-900;
}
```

---

## 3. Layout & Grid

### 3.1 Page Structure

```
Max width: max-w-7xl (1280px)
Horizontal padding: px-4 (mobile) → sm:px-6 → lg:px-8
Vertical padding: pt-24 (clear fixed navbar), pb-12
```

### 3.2 Responsive Breakpoints

| Breakpoint | Width | Layout Behavior |
|---|---|---|
| Default | < 640px | Single column, stacked |
| `sm` | ≥ 640px | 2-col grids possible |
| `md` | ≥ 768px | Desktop navbar, 2-col starts |
| `lg` | ≥ 1024px | 3-col service grid, 5-col detail |
| `xl` | ≥ 1280px | Max container width |

### 3.3 Grid Patterns

| Page | Grid |
|---|---|
| Landing categories | `md:grid-cols-2 lg:grid-cols-4` |
| Landing stats | `grid-cols-2 md:grid-cols-4` |
| Landing how-it-works | `md:grid-cols-3` |
| Services list | `md:grid-cols-2 lg:grid-cols-3` |
| Service detail | `lg:grid-cols-5` (3+2 split) |
| Dashboard sections | `lg:grid-cols-2` |
| Dashboard stats | `grid-cols-3` |
| Register form | `sm:grid-cols-2` |

### 3.4 Spacing System

Based on Tailwind defaults, with consistent patterns:

| Context | Space |
|---|---|
| Between sections on page | `mb-20` (80px) |
| Between cards in grid | `gap-5` (20px) |
| Card internal padding | `p-5` or `p-6` |
| Between label and input | `mb-1.5` (6px) |
| Between stacked form fields | `space-y-4` (16px) |
| Between heading and subtitle | `mt-1.5` (6px) |

---

## 4. Component Design Specifications

### 4.1 Cards (`.card` / `.card-hover`)

```css
.card {
  background: white;
  border-radius: 16px;         /* rounded-2xl */
  border: 1px solid #f3f4f6;  /* border-gray-100 */
  box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* shadow-sm */
  transition: all 200ms;
}

.card-hover:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);  /* shadow-md */
  border-color: #e5e7eb;                      /* border-gray-200 */
  transform: translateY(-2px);                 /* -translate-y-0.5 */
}
```

Cards are the primary content container. Used for services, bookings, provider items, stat displays, and form containers.

### 4.2 Buttons

#### Primary
```
bg-brand-500  →  hover:bg-brand-600  →  active:bg-brand-700
text: white
px-5 py-2.5 rounded-xl font-semibold text-sm
shadow-sm → hover:shadow-md (with brand-500/20 glow)
active:scale-[0.97]  (press feedback)
disabled: opacity-50, cursor-not-allowed
```

#### Secondary (Outlined)
```
border-2 border-gray-200 text-gray-700
hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50
active:scale-[0.97]
```

#### Danger
```
bg-red-500 text-white
hover:bg-red-600
active:scale-[0.97] shadow-sm
```

### 4.3 Input Fields (`.input-field`)

```
border: gray-200 → hover:gray-300 → focus:brand-400
focus ring: ring-2 brand-500/15
border-radius: 12px (rounded-xl)
padding: px-4 py-2.5
background: white
placeholder: text-gray-400
transition: all 200ms
```

### 4.4 Badges

```
display: inline-flex
padding: px-2.5 py-1
border-radius: 9999px (rounded-full)
font-size: text-xs
font-weight: semibold
```

Status badges include a pulsing dot (`.animate-pulse-soft`) for non-terminal states.

### 4.5 Navbar

**Static/unscrolled state:** bg-white/50 backdrop-blur-md border border-gray-200/40 shadow-sm
**Scrolled state** (>30px): `bg-white/80 backdrop-blur-2xl border border-gray-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)]`
**Height:** `h-16` (64px)
**Logo:** Fused wrench + lightning bolt in brand-500 to neon-orange gradient box + "ALLFIX" text
**Nav links:** text-gray-600 → hover:text-gray-900; active: bg-brand-50 text-brand-600 border border-brand-100

### 4.6 Skeleton Loaders (`.skeleton`)

```css
background: gradient gray-100 → gray-50 → gray-100
background-size: 200% 100%
animation: shimmer 2s infinite linear
border-radius: rounded-lg
```

Used in Services page during API fetch.

### 4.7 Breadcrumbs (Service Detail)

```
Services / Electrical Wiring Repair
gray-400 text → gray-600 active
hover:text-brand-600 on link
separator: "/" in text-gray-300
```

---

## 5. Motion & Animation

### 5.1 Animation Tokens

| Name | Duration | Easing | Use |
|---|---|---|---|
| `fadeIn` | 0.5s | ease-out | Generic entrance |
| `fadeInUp` | 0.5s | ease-out | Cards, sections entering from below |
| `fadeInDown` | 0.4s | ease-out | Dropdowns, panels |
| `slideUp` | 0.4s | ease-out | Mobile menu |
| `scaleIn` | 0.35s | ease-out | Empty states, toggles |
| `shimmer` | 2s | linear, infinite | Skeleton loaders |
| `pulseSoft` | 2s | ease-in-out, infinite | Status dots |

### 5.2 Staggered Entrance Pattern

Elements in lists receive delayed animations based on their index:

```js
style={{ animationDelay: `${index * 60}ms` }}   // Services cards
style={{ animationDelay: `${index * 100}ms` }}  // Category cards, stats
style={{ animationDelay: `${index * 80}ms` }}   // Dashboard stats
```

### 5.3 Micro-interactions

| Element | Feedback |
|---|---|
| Card hover | Lift 2px, deepen shadow, lighten border |
| Button hover | Background darken, glow shadow |
| Button active | Scale to 0.97 (press) |
| Link hover (nav) | Background tint, text color shift |
| Input hover | Border lighten |
| Input focus | Brand ring, border highlight |
| Category card hover | "Browse services" label slides in from left |
| Logo hover | Scale 1.05, shadow with brand glow |
| Status dot | Pulse-soft infinite (non-terminal) |

### 5.4 Navbar Transition

```
Scroll > 30px:
  bg-white/50 → bg-white/80 backdrop-blur-2xl
  border: border-gray-200/40 → border-gray-200/80
  shadow: shadow-sm → shadow-[0_8px_32px_rgba(0,0,0,0.03)]
  duration: 500ms
```

### 5.5 Page Transitions

Root pages use the class `.page-transition` = `animate-fade-in-up`.

---

## 6. Design Patterns

### 6.1 Empty States

Every list page has a consistent empty state:

```
┌──────────────────────────┐
│                          │
│    [icon in gray-100     │
│     rounded-2xl box]     │
│                          │
│    "No bookings yet"     │
│    Description text      │
│                          │
│    [Action Button]       │
│                          │
└──────────────────────────┘
```

- Icon: 64px container, 32px icon
- Heading: text-lg, semibold
- Description: text-sm, gray-500
- CTA: btn-primary

### 6.2 Status Visualization

**Badge:**
```
[● Pending]       amber-50 bg, amber-700 text, amber-500 dot
[● Confirmed]     blue-50 bg, blue-700 text, blue-500 dot
[● Completed]     green-50 bg, green-700 text, green-500 dot
[● Cancelled]     gray-50 bg, gray-500 text, gray-400 dot
```

**Timeline & OTP (Customer Bookings):**
- Timeline:
  ```
  ● ─── ● ─── ○       (pending)
  ● ─── ● ─── ○       (confirmed)
  ● ─── ● ─── ●       (completed)
  (no timeline for cancelled — text "Booking cancelled" instead)
  ```
- **OTP Badge:** Shown on confirmed bookings:
  - Container: Glassmorphic light brand orange bg (`bg-brand-50/50`), border (`border-brand-100/50`), padded rounded-xl.
  - OTP display: monospace, bold select-all digit box (`tracking-widest bg-white border border-brand-200/50 px-2.5 py-0.5 rounded-lg select-all`).

### 6.3 Role-Based UI

| Element | Guest | Customer | Provider |
|---|---|---|---|
| Navbar links | Browse, Sign In, Get Started | Browse, My Bookings, Avatar, Logout | Browse, Dashboard, Avatar, Logout |
| Service Detail | "Sign in to book" | Booking form | "You're a provider" message |
| Dashboard | N/A | N/A | Full CRUD |
| Bookings page | N/A | History + cancel | N/A |

### 6.4 Auth Mode Toggle (Login)

Segmented control with two modes:

```
┌──────────────────────────┐
│  [ Password ]  [  OTP  ] │  ← pill toggle
└──────────────────────────┘
```

Active mode: white bg, shadow-sm, bold text  
Inactive mode: transparent, gray-500 text

### 6.5 Verification Modal (OTP)

When a provider clicks "Complete" on a confirmed booking, a custom verification modal overlays the page:
- **Backdrop:** Semi-transparent black (`rgba(0,0,0,0.45)`) with backdrop blur (`backdrop-blur-sm`).
- **Container:** Pure white, rounded-2xl (`rounded-2xl`), shadow-2xl (`shadow-2xl`), animated scale-in (`animate-scale-in`).
- **OTP Input:** 4-character input, centered text (`text-center`), extra bold 3xl size (`text-3xl font-extrabold`), wide tracking (`tracking-[0.5em]`), with focus glow and outline.
- **Helper text:** Explains that the provider should request the 4-digit code from the customer.

---

## 7. Color Semantics by Role

### Customer-Facing (Warm & Inviting)

| Element | Value |
|---|---|
| Page bg | surface-50 (#faf8f5) |
| Primary CTA | brand-500 |
| Cards | white, gray borders |
| Success | green tones |
| Error | red tones |

### Provider Dashboard (More Data-Dense)

Same base palette but with:
- Tighter spacing in data lists
- Action buttons (Confirm/Complete/Delete) inline in cards
- Color-coded status badges for quick scanning
- Stats row at top for at-a-glance KPI

---

## 8. Responsive Behavior

### Navigation

| Viewport | Nav |
|---|---|
| Desktop (≥768px) | Horizontal links, avatar, full buttons |
| Mobile (<768px) | Hamburger icon, fullscreen overlay panel |

### Service Grid

| Viewport | Columns |
|---|---|
| < 768px | 1 column |
| ≥ 768px | 2 columns |
| ≥ 1024px | 3 columns |

### Service Detail

| Viewport | Layout |
|---|---|
| < 1024px | Single column: info then booking card |
| ≥ 1024px | 3/5 + 2/5 split with sticky booking card |

### Booking/Cancel Actions

| Viewport | Layout |
|---|---|
| < 640px | Cancel button below card |
| ≥ 640px | Inline with card content |

---

## 9. Screen-by-Screen Design Guidance

### 9.1 Landing Page

```
Layout flow (top → bottom):
  1. Navbar (transparent)
  2. Hero section (full-width max-w-3xl)
     - "Trusted by..." pill badge (brand-50 bg, pulsing dot)
     - H1 headline (5xl-7xl, tight leading)
     - Subtitle (text-lg, gray-500)
     - Dual CTAs: [Get Started Free → arrow] [Browse Services]
  3. Category grid (4 cards, staggered)
     - Gradient icon box + label + desc + hover-reveal link
  4. Stats row (4 cards, animated counter on scroll)
  5. How It Works (3 steps with large number watermark)
  6. Provider CTA (dark gradient card)
  7. Footer
```

### 9.2 Register

```
Centered card (max-w-lg):
  - Logo icon
  - "Create your account"
  - Error alert (conditional)
  - Role toggle: [Customer] [Provider] (styled radio buttons)
  - 2-col fields: Name, Email
  - Password field
  - 2-col fields: Phone, Location
  - "Create Account" (full-width primary)
  - "Already have an account? Sign in"
```

### 9.3 Login

```
Centered card (max-w-md):
  - Logo icon
  - "Welcome back"
  - Mode toggle: [Password] [OTP]
  - Form (changes by mode)
  - "Don't have an account? Create one"
  - Demo quick-access: [Provider] [Customer] presets
```

### 9.4 Browse Services

```
Page layout:
  - Title + subtitle
  - Category filter pills (horizontal scrollable)
  - Results count
  - 3-col service grid (or skeletons, or empty state)
```

### 9.5 Service Detail

```
2-column layout (lg: 3/5 + 2/5):
  Left column:
    - Breadcrumb
    - Service card: category badge + rating badge, title, desc, price/duration
    - Provider card: avatar, name, location, bio
  Right column (sticky):
    - "Book This Service" card
    - Auth gate (guest: sign in/up links)
    - Booking form (customer: datetime picker + notes + submit)
    - Provider message ("You're a provider")
```

### 9.6 Provider Dashboard

```
Layout:
  - Header with "+ Add Service" toggle
  - Stats row (3 cards with animated counts)
  - Service form (expandable, bordered card)
  - 2-col grid:
    Left: "Your Services" list
    Right: "Bookings" list
  Each item has context-appropriate actions
```

### 9.7 Customer Bookings

```
Layout:
  - Title + subtitle
  - Booking cards (stacked):
    - Title + status badge
    - Timeline dots
    - Provider name, date, time (inline chips)
    - Price
    - "Cancel Booking" (only for pending)
  - Or empty state with "Browse Services" CTA
```

### 9.8 Profile

```
Centered card (max-w-2xl):
  - Large avatar initial
  - Name + role
  - Details table: label | value pairs
  - Divided by light borders
```

---

## 10. Accessibility

### 10.1 Color Contrast

All text/background combinations meet WCAG AA standards:

| Combination | Ratio |
|---|---|
| brand-500 text on white | ~4.5:1 (AA for 14px+) |
| gray-900 text on white | ~16:1 (AAA) |
| gray-500 text on white | ~7:1 (AAA) |
| white text on brand-500 | ~4.5:1 (AA) |

### 10.2 Touch Targets

| Element | Min Size |
|---|---|
| Navbar links | 32px height |
| Buttons | 40px height |
| Mobile nav items | 44px height |
| Category filter pills | 36px height |

### 10.3 Focus States

All interactive elements use Tailwind's native `focus:ring-2` or visible focus indicators.

### 10.4 Screen Reader Support

- Form inputs have explicit `<label>` elements
- Buttons have visible text labels
- Links use descriptive text
- Icons in buttons have no label (decorative)

---

## 11. Design Deliverables Checklist

### Tokens & Foundations
- [x] Color palette (brand + surface + category + status)
- [x] Typography scale (Inter, 6 weights)
- [x] Spacing scale (Tailwind defaults)
- [x] Border radii (8px rounded-lg, 12px rounded-xl, 16px rounded-2xl, 9999px rounded-full)
- [x] Shadow system (sm, md, lg, glow variants)
- [x] Animation keyframes (6 presets)

### Component Library (Live in Code)
- [x] Card / Card-hover
- [x] Button (primary, secondary, danger)
- [x] Input field
- [x] Badge (with status dot)
- [x] Navbar (transparent → glassmorphism)
- [x] Skeleton loader
- [x] Avatar initial
- [x] Breadcrumb
- [x] Segmented control (auth mode)
- [x] Timeline indicator
- [x] Stat card (animated counter)
- [x] Empty state
- [x] Error/success banner
- [x] Spinner

### Page Patterns
- [x] Landing page (hero + categories + stats + steps + CTA)
- [x] Auth forms (register + login with dual mode)
- [x] Browse list (filters + grid + skeleton/empty)
- [x] Detail + sticky sidebar (service booking)
- [x] Provider dashboard (stats + CRUD + bookings mgmt)
- [x] Customer bookings (history + timeline + cancel)
- [x] Profile (account details)

---

## 12. Design Principles

1. **Trust first.** Every visual decision should reinforce reliability. Warm colors, clean cards, confident typography.

2. **Progressive disclosure.** Show what's needed, when it's needed. Booking form only appears for customers. Dashboard actions only for the right status.

3. **Motion with purpose.** Animations aren't decorative — they orient the user (fade-in-up for new content, scale-in for state changes, pulse for attention).

4. **Role-aware UI.** The same app feels different depending on who you are. Nav, actions, and content adapt to customer vs. provider.

5. **Mobile-first, but desktop-rich.** The app works on a phone but feels at home on a large screen. Cards, grids, and sidebars scale up gracefully.

6. **Everything has a state.** No blank pages. Loading → skeleton. Empty → illustration + CTA. Error → message + retry.
