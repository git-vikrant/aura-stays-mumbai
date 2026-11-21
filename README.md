# Aura Stays Mumbai - Luxury Boutique Hotel Group Full-Stack Platform

A complete, production-grade hotel booking, enquiry, and revenue intelligence platform built for **Aura Stays Mumbai**, a fictional boutique luxury hotel collection spanning 14 restored heritage and coastal properties across Mumbai (Colaba, Marine Drive, Kala Ghoda, Fort, Bandra West, Pali Hill, Juhu Beach, Worli, Malabar Hill, Lower Parel, BKC, Powai, Versova, and Dadar).

Built with production habits: comprehensive data hygiene pipeline for messy legacy records, dual-currency pricing (INR ₹ and USD $), JWT authentication with refresh token rotation, role-based access control (RBAC), multi-entity CRUD, real-time date availability search with double-booking prevention, file/image uploads, an executive dashboard calculating Occupancy Rate, ADR, and RevPAR, background job queues, and an automated CI/CD test suite.

---

## 🌐 Live URLs & Deployment Architecture

| Service | Target Platform | Live URL / Specification |
|---|---|---|
| **Frontend Web App** | Vercel Edge CDN | `https://aura-stays-mumbai.vercel.app` (Configured in `client/vercel.json`) |
| **Backend REST API** | Render / Container | `https://aura-stays-mumbai-api.onrender.com/api` (Configured in `render.yaml`) |
| **API Healthcheck** | Render | `https://aura-stays-mumbai-api.onrender.com/api/health` |
| **API Documentation** | GitHub Markdown | [API.md](./API.md) |
| **Scaling Blueprint** | System Design | [SYSTEM_DESIGN_AND_SCALING.md](./SYSTEM_DESIGN_AND_SCALING.md) |

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Frontend["Client Layer (React 18 + Vite + Tailwind CSS)"]
        UI["SPA Interface (Vercel Edge)"]
        RBAC["Persona Demo Switcher (Guest / Staff / Admin)"]
        Curr["Multi-Currency Engine (₹ INR / $ USD)"]
    end

    subgraph Backend["Application Layer (Node.js 22 + Express)"]
        API["Express Modular REST API"]
        AuthM["JWT Auth + Refresh Token Rotation"]
        UploadM["Multer Secure File Storage"]
        BookCtrl["Booking Engine & Concurrency Gate"]
        MetricCtrl["RevPAR, ADR & Occupancy Calculator"]
    end

    subgraph Workers["Background Event Processor"]
        JobQ["Async Job Queue Worker"]
        Emailer["Nodemailer & Template Dispatcher"]
    end

    subgraph Persistence["Persistence & Storage"]
        PrismaORM[("Prisma ORM (SQLite / PostgreSQL)")]
        Uploads[("/uploads Static Disk Storage")]
    end

    UI --> API
    API --> AuthM
    API --> UploadM
    API --> BookCtrl
    API --> MetricCtrl
    BookCtrl --> PrismaORM
    AuthM --> PrismaORM
    MetricCtrl --> PrismaORM
    UploadM --> Uploads
    BookCtrl -.->|Async Enqueue| JobQ
    JobQ --> Emailer
```

---

## ✨ Core Features & Technical Highlights

### 1. The 14 Mumbai Boutique Properties & Canonical Room Taxonomy
Derived from real operational records across Mumbai's most celebrated enclaves:
- **Colaba**: *The Colaba Heritage Manor* (Victorian-Edwardian heritage near Gateway of India)
- **Marine Drive**: *Marine Promenade Suites* (Art Deco overlooking the Queen's Necklace)
- **Kala Ghoda**: *The Kala Ghoda Art Deco Residency* (Bohemian arts district retreat)
- **Fort**: *Fort Victoria Chambers* (Dignified financial quarter sanctuary)
- **Bandra West**: *Bandra Seafront Haven* (Coastal surfing and sunset promenades)
- **Pali Hill**: *Pali Hill Palms* (Ultra-private bougainvillea hillside retreat)
- **Juhu**: *Juhu Pearl Beach Villa* (Direct golden beachfront access)
- **Worli**: *Worli Bayview Boutique* (Futuristic Bandra-Worli Sea Link views)
- **Malabar Hill**: *Malabar Hill Serenity* (Hanging gardens and Back Bay marble verandas)
- **Lower Parel**: *Lower Parel Loft & Suites* (Industrial-chic textile mill conversion)
- **BKC**: *BKC Executive Pavilion* (High-tech corporate business hotel)
- **Powai**: *Powai Lake Sanctuary* (European neoclassical lakeside hotel)
- **Versova**: *Versova Coastal Retreat* (Bohemian fishing village artisan haven)
- **Dadar**: *Dadar Heritage Inn* (Classical Maharashtrian cultural heritage hotel)

### 2. Ingestion Pipeline & Messy Cases Sanitization
The system seeds data with explicit resolution of messy operational cases:
- **Renamed Room Types**: Different properties refer to equivalent room classes by different names (e.g. *"Colonial Heritage Grand Suite"*, *"King Deluxe Room"*, *"Presidential Penthouse Villa"*). The cleaner maps these automatically to a unified canonical taxonomy (`DELUXE_ROOM`, `EXECUTIVE_SUITE`, `HERITAGE_SUITE`, `STUDIO_QUEEN`, `PRESIDENTIAL_VILLA`) while preserving property-specific names for display.
- **Multi-Currency Pricing**: Raw datasets contain prices formatted in both INR (e.g., `"INR 18,500"`, `"₹12,000"`) and USD (e.g., `"$165"`, `"USD 380"`). The currency pipeline parses string symbols, normalizes dual amounts into `basePriceINR` and `basePriceUSD` (exchange rate ₹84 = $1 USD), and powers a live client-side currency toggle.
- **Inverted Stay Dates (`checkOut <= checkIn`)**: The cleaner detects legacy corrupted records where check-out precedes check-in or stay duration is 0 nights, emits an audit alert (`[DATA_HYGIENE_ALERT]`), transposes or extends the stay to a 1-night minimum, and tags the booking with `MIGRATED_REPAIRED_RECORD`. At runtime, strict Zod and database validations reject any new invalid date intervals with HTTP 400.

### 3. Role-Based Access Control (RBAC) & Demo Switcher
JWT access tokens (1 hour expiry) paired with rotated, revocable refresh tokens (7 days expiry):
- **GUEST**: Browse 14 hotels, check live room availability, book rooms, view own bookings, cancel own bookings, submit enquiries, and write reviews.
- **STAFF**: Front-desk operations: view all property bookings, execute 1-click Check-In and Check-Out, and triage concierge inquiries.
- **ADMIN**: General Manager: full CRUD on properties and rooms, revenue intelligence, and executive hospitality dashboard.

> **💡 Interactive Demo Persona Switcher**: A sticky banner at the top of the frontend allows evaluators to switch between **Guest**, **Front-Desk Staff**, and **Admin / GM** in a single click with pre-populated credentials!

### 4. Executive Hospitality Analytics Dashboard
Computes industry-standard financial and operational metrics:
- **Occupancy Rate (%)**:
  $$\text{Occupancy Rate} = \left( \frac{\text{Room Nights Sold}}{\text{Total Available Room Nights}} \right) \times 100$$
- **ADR (Average Daily Rate)**:
  $$\text{ADR} = \frac{\text{Total Room Revenue}}{\text{Room Nights Sold}}$$
- **RevPAR (Revenue Per Available Room)**:
  $$\text{RevPAR} = \frac{\text{Total Room Revenue}}{\text{Total Available Room Nights}} = \text{Occupancy Rate} \times \text{ADR}$$
- Includes property performance ranking table and 7-day revenue trend visualization.

### 5. Background Job Queue & Email Notifications
- Non-blocking asynchronous task processor with concurrency controls, retries, and status tracking (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`).
- Asynchronous dispatch of branded HTML booking confirmation emails and concierge enquiry acknowledgments.

---

## 🔑 Demo RBAC Credentials

| Persona | Email | Password | Role Permissions |
|---|---|---|---|
| **Admin (GM)** | `admin@aurastays.com` | `Admin@12345` | Executive Dashboard, RevPAR, ADR, Full CRUD |
| **Front-Desk Staff** | `staff@aurastays.com` | `Staff@12345` | Check-in / Check-out, View all bookings, Enquiry triage |
| **Loyalty Guest** | `guest@aurastays.com` | `Guest@12345` | Room booking, My Bookings, Reviews, Inquiries |

---

## 🚀 Quick Setup & Local Execution

### Prerequisites
- Node.js 20+ (tested on Node.js 22.12.0)
- npm 10+

### Step 1: Clone & Configure Backend
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node src/data/seed.js
```

### Step 2: Run Backend Server
```bash
npm start
# Server listens on http://localhost:5000 (API at http://localhost:5000/api)
```

### Step 3: Run Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
# Vite dev server runs at http://localhost:5173
```

---

## 🧪 Automated Testing & CI/CD Pipeline

The project includes unit and integration API tests using Vitest and Supertest:
- **Unit Tests**: Canonical taxonomy mapping, multi-currency normalization, inverted date anomaly detection & repair.
- **Integration Tests**: Healthcheck, JWT signup/login/refresh, RBAC authorization guards (403 for guests accessing metrics), 14-hotel inventory listing, room availability search with date filtering, double-booking prevention, and background job queue execution.

### Run Tests Locally:
```bash
cd server
npm test
```

### Test Suite Results:
```text
 ✓ tests/seedCleaner.test.js (9 tests)
 ✓ tests/api.test.js (11 tests)
 Test Files  2 passed (2)
      Tests  20 passed (20)
```

### GitHub Actions Workflow
The `.github/workflows/ci.yml` pipeline runs on every push and pull request:
1. Matrix setup on Node.js 22.
2. Server dependency installation & Prisma database generation.
3. Automated database push & messy seed data ingestion.
4. Execution of the 20-test Vitest test suite.
5. Client dependency installation & production Vite build verification (<2s load time guarantee).
6. Automated secret scanning to guarantee zero exposed credentials.

---

## ⚡ Scaling the Weakest Part of the Design

> For the comprehensive engineering analysis and implementation details, see [SYSTEM_DESIGN_AND_SCALING.md](./SYSTEM_DESIGN_AND_SCALING.md).

**Summary of Bottleneck**: Under flash sales or seasonal surges in Mumbai (New Year's Eve, celebrity weddings), concurrent requests attempt to reserve the same room for overlapping dates. A naive database read-then-write creates Time-Of-Check to Time-Of-Use (TOCTOU) race conditions.

**Production Solution**:
1. **Tier 1 (Database)**: PostgreSQL `tstzrange` with `EXCLUDE USING gist` constraints to guarantee temporal mutual exclusivity at the disk layer.
2. **Tier 2 (Distributed Locks)**: Redis Lua scripts creating a 10-minute ephemeral inventory hold during checkout, offloading concurrency from the SQL connection pool and returning instant 409 responses to conflicting requests.
3. **Tier 3 (Cache-Aside Availability)**: Pre-aggregated daily availability bitsets in Redis answering 500,000+ searches/sec with <2ms response time.
4. **Tier 4 (Sharding)**: Sharding by Mumbai geographical clusters (South Mumbai, Western Suburbs, Central Mumbai).

---

## 📄 License & Attribution
Developed for the Aura Stays Mumbai Boutique Hotel Group Full-Stack Platform. Built with React, Node.js, Express, Prisma, Tailwind CSS, and Vitest.
