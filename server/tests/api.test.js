import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/prisma.js";

describe("Aura Stays API Integration Tests", () => {
  let guestToken = "";
  let staffToken = "";
  let adminToken = "";
  let sampleHotelId = "";
  let sampleRoomId = "";

  beforeAll(async () => {
    // Authenticate demo users to acquire valid JWTs
    const guestRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "guest@aurastays.com", password: "Guest@12345" });
    guestToken = guestRes.body.data.accessToken;

    const staffRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "staff@aurastays.com", password: "Staff@12345" });
    staffToken = staffRes.body.data.accessToken;

    const adminRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@aurastays.com", password: "Admin@12345" });
    adminToken = adminRes.body.data.accessToken;

    // Fetch sample hotel and room
    const hotel = await prisma.hotel.findFirst({ include: { rooms: true } });
    if (hotel) {
      sampleHotelId = hotel.id;
      sampleRoomId = hotel.rooms[0]?.id;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("System Health & Discovery", () => {
    it("GET /api/health should return operational status", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("healthy");
    });
  });

  describe("Authentication & RBAC Security", () => {
    it("POST /api/auth/signup should register a new guest with JWT and refresh token", async () => {
      const testEmail = `newguest.${Date.now()}@example.com`;
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Dev Patel",
          email: testEmail,
          password: "SecurePassword123!",
          phone: "+91 98200 88990"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it("POST /api/auth/login should reject invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@aurastays.com", password: "WrongPassword999" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
    });

    it("GET /api/metrics/dashboard should deny access to GUEST role (403 Forbidden)", async () => {
      const res = await request(app)
        .get("/api/metrics/dashboard")
        .set("Authorization", `Bearer ${guestToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("GET /api/metrics/dashboard should allow access to ADMIN role", async () => {
      const res = await request(app)
        .get("/api/metrics/dashboard")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary).toBeDefined();
      expect(res.body.data.summary.occupancyRate).toBeGreaterThanOrEqual(0);
      expect(res.body.data.summary.adr).toBeGreaterThanOrEqual(0);
      expect(res.body.data.summary.revPAR).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Properties & Room Inventory", () => {
    it("GET /api/hotels should return 14 properties with starting rates", async () => {
      const res = await request(app).get("/api/hotels");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(14);
      expect(res.body.data[0].startingPriceINR).toBeGreaterThan(0);
      expect(res.body.data[0].startingPriceUSD).toBeGreaterThan(0);
    });

    it("GET /api/bookings/search should filter available rooms by date and neighborhood", async () => {
      const res = await request(app)
        .get("/api/bookings/search")
        .query({
          neighborhood: "Colaba",
          checkInDate: "2026-12-10",
          checkOutDate: "2026-12-13",
          guests: 2,
          currency: "INR"
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rooms).toBeInstanceOf(Array);
      expect(res.body.data.nights).toBe(3);
    });
  });

  describe("Booking Validation & Concurrency Protection", () => {
    it("POST /api/bookings should strictly reject check-out before check-in (validation error)", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .send({
          hotelId: sampleHotelId,
          roomId: sampleRoomId,
          guestName: "Test Anomaly User",
          guestEmail: "anomaly@example.com",
          guestPhone: "+91 99999 88888",
          checkInDate: "2026-12-15",
          checkOutDate: "2026-12-10", // Check-out before check-in!
          guestCount: 2,
          currency: "INR"
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("POST /api/bookings should successfully confirm valid reservation", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${guestToken}`)
        .send({
          hotelId: sampleHotelId,
          roomId: sampleRoomId,
          guestName: "Vikram Malhotra",
          guestEmail: "guest@aurastays.com",
          guestPhone: "+91 98200 30003",
          checkInDate: "2026-12-24",
          checkOutDate: "2026-12-27",
          guestCount: 2,
          currency: "INR",
          specialRequests: "Anniversary surprise flowers please"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bookingReference).toMatch(/^AURA-MUM-/);
      expect(res.body.data.nights).toBe(3);
    });
  });

  describe("Enquiry & Guest Feedback", () => {
    it("POST /api/enquiries should accept guest enquiry and return 201", async () => {
      const res = await request(app)
        .post("/api/enquiries")
        .send({
          hotelId: sampleHotelId,
          name: "Meenakshi Sundaram",
          email: "meenakshi@chennaitech.in",
          phone: "+91 98400 12345",
          category: "EVENT_WEDDING",
          subject: "Sunset Deck Terrace Celebration",
          message: "Would like to inquire about hosting a sunset dinner for 40 guests."
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("NEW");
    });

    it("GET /api/enquiries should allow Staff to view incoming inquiries", async () => {
      const res = await request(app)
        .get("/api/enquiries")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
