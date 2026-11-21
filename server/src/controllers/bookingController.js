import prisma from "../prisma.js";
import { apiSuccess, apiError } from "../utils/response.js";
import { jobQueue } from "../services/jobQueue.js";
import { logger } from "../logger.js";

/**
 * Searches available rooms across properties given dates and filters.
 * Excludes rooms with overlapping confirmed or active stays.
 */
export async function searchAvailableRooms(req, res) {
  try {
    const {
      neighborhood,
      checkInDate,
      checkOutDate,
      guests = 1,
      minPrice,
      maxPrice,
      canonicalType,
      currency = "INR"
    } = req.query;

    let inDate = checkInDate ? new Date(checkInDate) : new Date();
    let outDate = checkOutDate ? new Date(checkOutDate) : new Date(Date.now() + 86400000); // 1 night default

    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
      return apiError(res, "Invalid date format", 400, null, "INVALID_DATES");
    }

    if (outDate.getTime() <= inDate.getTime()) {
      return apiError(res, "Check-out date must be strictly after check-in date", 400, null, "INVALID_DATE_RANGE");
    }

    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Find conflicting booking IDs overlapping with the requested window
    // Overlap condition: booking.checkInDate < outDate AND booking.checkOutDate > inDate
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        bookingStatus: { in: ["CONFIRMED", "CHECKED_IN"] },
        AND: [
          { checkInDate: { lt: outDate } },
          { checkOutDate: { gt: inDate } }
        ]
      },
      select: { roomId: true }
    });

    const bookedRoomIds = conflictingBookings.map((b) => b.roomId);

    // Build room query filter
    const roomWhere = {
      status: "AVAILABLE",
      capacity: { gte: parseInt(guests) },
      id: { notIn: bookedRoomIds }
    };

    if (canonicalType) {
      roomWhere.canonicalType = canonicalType;
    }

    if (currency === "USD") {
      if (minPrice) roomWhere.basePriceUSD = { gte: parseFloat(minPrice) };
      if (maxPrice) roomWhere.basePriceUSD = { ...roomWhere.basePriceUSD, lte: parseFloat(maxPrice) };
    } else {
      if (minPrice) roomWhere.basePriceINR = { gte: parseFloat(minPrice) };
      if (maxPrice) roomWhere.basePriceINR = { ...roomWhere.basePriceINR, lte: parseFloat(maxPrice) };
    }

    // Filter by hotel criteria
    const hotelWhere = { isActive: true };
    if (neighborhood) {
      hotelWhere.neighborhood = { contains: neighborhood };
    }

    roomWhere.hotel = hotelWhere;

    const availableRooms = await prisma.room.findMany({
      where: roomWhere,
      include: {
        hotel: true
      },
      orderBy: currency === "USD" ? { basePriceUSD: "asc" } : { basePriceINR: "asc" }
    });

    const results = availableRooms.map((room) => {
      const pricePerNight = currency === "USD" ? room.basePriceUSD : room.basePriceINR;
      const totalStayCost = pricePerNight * nights;

      return {
        ...room,
        images: JSON.parse(room.images || "[]"),
        amenities: JSON.parse(room.amenities || "[]"),
        hotel: {
          ...room.hotel,
          images: JSON.parse(room.hotel.images || "[]"),
          amenities: JSON.parse(room.hotel.amenities || "[]")
        },
        searchParams: {
          checkInDate: inDate.toISOString().split("T")[0],
          checkOutDate: outDate.toISOString().split("T")[0],
          nights,
          guests: parseInt(guests),
          currency,
          pricePerNight,
          totalStayCost
        }
      };
    });

    return apiSuccess(res, {
      totalFound: results.length,
      nights,
      currency,
      rooms: results
    }, "Available rooms searched successfully");
  } catch (err) {
    logger.error(`[BOOKING_SEARCH_ERROR] ${err.message}`);
    return apiError(res, "Failed to search rooms", 500, err.message);
  }
}

/**
 * Creates a new reservation
 */
export async function createBooking(req, res) {
  try {
    const {
      hotelId,
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      guestCount = 1,
      currency = "INR",
      specialRequests
    } = req.body;

    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);

    if (outDate.getTime() <= inDate.getTime()) {
      return apiError(res, "Check-out date must strictly be after check-in date", 400, null, "INVALID_DATES");
    }

    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Verify room exists and check capacity
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true }
    });

    if (!room) {
      return apiError(res, "Room not found", 404, null, "ROOM_NOT_FOUND");
    }

    if (guestCount > room.capacity) {
      return apiError(
        res,
        `Guest count (${guestCount}) exceeds room capacity of ${room.capacity}`,
        400,
        null,
        "CAPACITY_EXCEEDED"
      );
    }

    // Availability concurrency check: Verify room is not double-booked
    const existingConflict = await prisma.booking.findFirst({
      where: {
        roomId,
        bookingStatus: { in: ["CONFIRMED", "CHECKED_IN"] },
        AND: [
          { checkInDate: { lt: outDate } },
          { checkOutDate: { gt: inDate } }
        ]
      }
    });

    if (existingConflict) {
      return apiError(
        res,
        "This room is no longer available for the selected dates. Please choose another room or date.",
        409,
        null,
        "ROOM_ALREADY_BOOKED"
      );
    }

    const pricePerNight = currency === "USD" ? room.basePriceUSD : room.basePriceINR;
    const totalAmount = pricePerNight * nights;

    // Generate readable reference
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingReference = `AURA-MUM-${randomSuffix}`;

    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        userId: req.user?.id || null,
        guestName,
        guestEmail,
        guestPhone,
        hotelId,
        roomId,
        checkInDate: inDate,
        checkOutDate: outDate,
        nights,
        guestCount,
        currency,
        totalAmount,
        paymentStatus: "PAID",
        bookingStatus: "CONFIRMED",
        specialRequests: specialRequests || null,
        source: req.user?.role === "STAFF" || req.user?.role === "ADMIN" ? "FRONT_DESK" : "DIRECT_WEB"
      },
      include: {
        hotel: true,
        room: true
      }
    });

    // Enqueue background email notification
    await jobQueue.enqueue("SEND_BOOKING_EMAIL", { bookingId: booking.id });

    logger.info(`[BOOKING_SUCCESS] Created booking ${booking.bookingReference} for ${booking.guestName} at ${booking.hotel.name}`);

    return apiSuccess(res, booking, "Booking confirmed successfully", 201);
  } catch (err) {
    logger.error(`[BOOKING_CREATE_ERROR] ${err.message}`);
    return apiError(res, "Failed to create reservation", 500, err.message);
  }
}

/**
 * Gets bookings for the authenticated user
 */
export async function getUserBookings(req, res) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          { guestEmail: req.user.email }
        ]
      },
      include: {
        hotel: {
          select: { id: true, name: true, slug: true, neighborhood: true, images: true, contactPhone: true }
        },
        room: {
          select: { id: true, name: true, roomNumber: true, canonicalType: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formatted = bookings.map((b) => ({
      ...b,
      hotel: {
        ...b.hotel,
        images: JSON.parse(b.hotel.images || "[]")
      }
    }));

    return apiSuccess(res, formatted, "Guest bookings retrieved");
  } catch (err) {
    return apiError(res, "Failed to retrieve bookings", 500, err.message);
  }
}

/**
 * Gets all bookings across properties (Staff & Admin)
 */
export async function getAllBookings(req, res) {
  try {
    const { status, hotelId, search, date } = req.query;

    const where = {};
    if (status) where.bookingStatus = status;
    if (hotelId) where.hotelId = hotelId;

    if (search) {
      where.OR = [
        { bookingReference: { contains: search } },
        { guestName: { contains: search } },
        { guestEmail: { contains: search } },
        { guestPhone: { contains: search } }
      ];
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate.getTime() + 86400000);
      where.checkInDate = { gte: targetDate, lt: nextDay };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        hotel: {
          select: { id: true, name: true, neighborhood: true }
        },
        room: {
          select: { id: true, name: true, roomNumber: true, canonicalType: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return apiSuccess(res, bookings, "All bookings retrieved");
  } catch (err) {
    return apiError(res, "Failed to retrieve bookings", 500, err.message);
  }
}

/**
 * Updates booking status (Check-in, Check-out, Cancel)
 */
export async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;

    const existing = await prisma.booking.findUnique({
      where: { id },
      include: { hotel: true, room: true }
    });

    if (!existing) {
      return apiError(res, "Booking not found", 404, null, "BOOKING_NOT_FOUND");
    }

    // Role check: Guests can only cancel their own bookings
    if (req.user.role === "GUEST") {
      if (existing.userId !== req.user.id && existing.guestEmail !== req.user.email) {
        return apiError(res, "You are not authorized to modify this booking", 403, null, "FORBIDDEN");
      }
      if (bookingStatus !== "CANCELLED") {
        return apiError(res, "Guests can only request cancellation", 400, null, "INVALID_ACTION");
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        bookingStatus,
        paymentStatus: paymentStatus || (bookingStatus === "CANCELLED" ? "REFUNDED" : existing.paymentStatus)
      },
      include: {
        hotel: true,
        room: true
      }
    });

    logger.info(`[BOOKING_STATUS_UPDATE] Booking ${updated.bookingReference} status changed to ${bookingStatus} by ${req.user.email}`);

    return apiSuccess(res, updated, `Booking marked as ${bookingStatus}`);
  } catch (err) {
    return apiError(res, "Failed to update booking status", 500, err.message);
  }
}
