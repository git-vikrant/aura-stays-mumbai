import { Router } from "express";
import {
  searchAvailableRooms,
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { authenticateJWT, optionalAuth, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createBookingSchema, updateBookingStatusSchema } from "../validations/schemas.js";

const router = Router();

// Guest search & availability check
router.get("/search", searchAvailableRooms);

// Create reservation (authenticated or guest with details)
router.post("/", optionalAuth, validate(createBookingSchema), createBooking);

// User's own reservations
router.get("/my-bookings", authenticateJWT, getUserBookings);

// Front-desk & Manager operational overview
router.get("/all", authenticateJWT, requireRole(["STAFF", "ADMIN"]), getAllBookings);

// Update status (Check-in, Check-out, Cancel)
router.patch("/:id/status", authenticateJWT, validate(updateBookingStatusSchema), updateBookingStatus);

export default router;
