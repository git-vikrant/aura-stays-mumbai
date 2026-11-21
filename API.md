# Aura Stays Mumbai - REST API Documentation

The Aura Stays API is a RESTful API powering luxury boutique hotel reservations, guest concierge enquiries, and executive hospitality management across 14 Mumbai properties.

- **Development API Base URL**: `http://localhost:5000/api`
- **Production API Base URL**: `https://aura-stays-mumbai-api.onrender.com/api`
- **Default Content-Type**: `application/json`

---

## 1. Authentication & RBAC

All protected endpoints require the HTTP Header:
```http
Authorization: Bearer <access_token>
```

### Roles:
- `GUEST`: Can explore hotels, check real-time availability, book rooms, view own bookings, cancel own bookings, and submit enquiries/reviews.
- `STAFF`: Front-desk operations: view all bookings, process check-ins / check-outs, update booking statuses, view and triage concierge enquiries.
- `ADMIN`: General Manager: full CRUD on properties, rooms, users, and access to executive revenue dashboard (Occupancy, ADR, RevPAR).

---

### POST `/api/auth/signup`
Registers a new guest account and returns access and refresh tokens.

**Request Body:**
```json
{
  "name": "Dev Patel",
  "email": "dev.patel@example.com",
  "password": "SecurePassword123!",
  "phone": "+91 98200 88990"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "e93d7c30-4e3f-4a30-8a1a-a3e9c5c0e123",
      "email": "dev.patel@example.com",
      "name": "Dev Patel",
      "role": "GUEST",
      "phone": "+91 98200 88990"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  },
  "timestamp": "2026-11-21T11:20:00.000Z"
}
```

---

### POST `/api/auth/login`
Authenticates a user and issues new JWT tokens.

**Request Body:**
```json
{
  "email": "admin@aurastays.com",
  "password": "Admin@12345"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "c1f108f2-8178-43d9-95a9-f597926b0a88",
      "email": "admin@aurastays.com",
      "name": "Tanya Singhania (General Manager)",
      "role": "ADMIN"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

---

### POST `/api/auth/refresh-token`
Exchanges a valid refresh token for a rotated access and refresh token pair.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

---

## 2. Hotels & Properties

### GET `/api/hotels`
Retrieves all 14 active Mumbai boutique hotels with starting rates in INR and USD.

**Query Parameters:**
- `neighborhood` (optional, e.g. "Colaba", "Bandra West", "Juhu")
- `minRating` (optional, float)
- `search` (optional, keyword search across title and description)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "f51950c4-9169-42b7-a379-847e62d4e68e",
      "name": "The Colaba Heritage Manor",
      "slug": "the-colaba-heritage-manor",
      "neighborhood": "Colaba",
      "address": "24 Arthur Bunder Road, Near Gateway of India, Colaba",
      "city": "Mumbai",
      "starRating": 4.9,
      "startingPriceINR": 12000,
      "startingPriceUSD": 142.86,
      "totalRooms": 4,
      "reviewCount": 1
    }
  ]
}
```

---

### GET `/api/hotels/:slug`
Retrieves detailed property information including room inventory, amenities, and recent reviews.

---

## 3. Room Inventory & Availability Search

### GET `/api/bookings/search`
Queries available suites across 14 properties without booking overlaps.

**Query Parameters:**
- `checkInDate` (YYYY-MM-DD)
- `checkOutDate` (YYYY-MM-DD, must be strictly after `checkInDate`)
- `neighborhood` (optional)
- `guests` (integer, default 1)
- `canonicalType` (`DELUXE_ROOM`, `EXECUTIVE_SUITE`, `HERITAGE_SUITE`, `STUDIO_QUEEN`, `PRESIDENTIAL_VILLA`)
- `currency` (`INR` or `USD`, default `INR`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalFound": 12,
    "nights": 3,
    "currency": "INR",
    "rooms": [
      {
        "id": "e6a2b842-b0ef-4f11-9a74-4bca413997c4",
        "roomNumber": "101",
        "name": "Colonial Heritage Grand Suite",
        "canonicalType": "HERITAGE_SUITE",
        "basePriceINR": 18500,
        "basePriceUSD": 220.24,
        "capacity": 2,
        "searchParams": {
          "nights": 3,
          "pricePerNight": 18500,
          "totalStayCost": 55500
        }
      }
    ]
  }
}
```

---

## 4. Bookings & Reservations

### POST `/api/bookings`
Creates a verified reservation. Rejects overlapping dates with `409 Conflict`.

**Request Body:**
```json
{
  "hotelId": "f51950c4-9169-42b7-a379-847e62d4e68e",
  "roomId": "e6a2b842-b0ef-4f11-9a74-4bca413997c4",
  "guestName": "Vikram Malhotra",
  "guestEmail": "guest@aurastays.com",
  "guestPhone": "+91 98200 30003",
  "checkInDate": "2026-12-24",
  "checkOutDate": "2026-12-27",
  "guestCount": 2,
  "currency": "INR",
  "specialRequests": "Anniversary flowers on arrival"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "id": "7820bb29-b0c1-4b13-9122-87033a8b417e",
    "bookingReference": "AURA-MUM-83921",
    "nights": 3,
    "totalAmount": 55500,
    "bookingStatus": "CONFIRMED",
    "paymentStatus": "PAID"
  }
}
```

---

### PATCH `/api/bookings/:id/status`
Updates reservation state (`CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`).

**Request Body:**
```json
{
  "bookingStatus": "CHECKED_IN"
}
```

---

## 5. Executive Hospitality Analytics

### GET `/api/metrics/dashboard`
*(Requires `STAFF` or `ADMIN` role)*

Computes Occupancy Rate, ADR (Average Daily Rate), RevPAR (Revenue Per Available Room), status distributions, and 14-property rankings.

**Query Parameters:**
- `currency`: `INR` or `USD`
- `hotelId`: optional property filter

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "currency": "INR",
    "summary": {
      "totalRooms": 45,
      "totalBookings": 11,
      "totalRoomNightsSold": 38,
      "totalRevenue": 782000,
      "occupancyRate": 78.4,
      "adr": 20578.95,
      "revPAR": 16133.33
    },
    "statusDistribution": {
      "CONFIRMED": 5,
      "CHECKED_IN": 3,
      "CHECKED_OUT": 3,
      "CANCELLED": 0
    },
    "propertyRanking": [
      {
        "id": "f51950c4-9169-42b7-a379-847e62d4e68e",
        "name": "The Colaba Heritage Manor",
        "neighborhood": "Colaba",
        "occupancyRate": 85.2,
        "adr": 22400,
        "revPAR": 19084.8,
        "totalRevenue": 185000
      }
    ]
  }
}
```

---

## 6. Concierge Enquiries & File Upload

### POST `/api/enquiries`
Submits an event, wedding, or concierge enquiry with optional file attachment (`multipart/form-data`).

**Fields:**
- `name`: string
- `email`: string
- `phone`: string (optional)
- `category`: `GENERAL` | `BOOKING_INQUIRY` | `EVENT_WEDDING` | `CORPORATE` | `FEEDBACK`
- `subject`: string
- `message`: string
- `attachment`: file upload (JPEG, PNG, WEBP, PDF up to 5MB)
