import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phone: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

export const createHotelSchema = z.object({
  name: z.string().min(3, "Hotel name must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  neighborhood: z.string().min(2, "Neighborhood is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().default("Mumbai"),
  pincode: z.string().default("400001"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  starRating: z.number().min(1).max(5).default(4.5),
  images: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  contactEmail: z.string().email("Invalid contact email"),
  contactPhone: z.string().min(8, "Contact phone is required"),
  checkInTime: z.string().default("14:00"),
  checkOutTime: z.string().default("11:00")
});

export const createRoomSchema = z.object({
  hotelId: z.string().uuid("Invalid hotel ID"),
  roomNumber: z.string().min(1, "Room number is required"),
  name: z.string().min(2, "Room name is required"),
  canonicalType: z.enum([
    "DELUXE_ROOM",
    "EXECUTIVE_SUITE",
    "HERITAGE_SUITE",
    "STUDIO_QUEEN",
    "PRESIDENTIAL_VILLA"
  ]),
  basePriceINR: z.number().positive("Base price in INR must be positive"),
  basePriceUSD: z.number().positive("Base price in USD must be positive"),
  capacity: z.number().int().min(1).max(10).default(2),
  bedConfiguration: z.string().default("1 King Bed"),
  sizeSqFt: z.number().int().positive().default(450),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([])
});

export const bookingSearchSchema = z.object({
  neighborhood: z.string().optional(),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  guests: z.coerce.number().min(1).default(1),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  canonicalType: z.string().optional(),
  currency: z.enum(["INR", "USD"]).default("INR")
});

export const createBookingSchema = z.object({
  hotelId: z.string().uuid("Invalid hotel ID"),
  roomId: z.string().uuid("Invalid room ID"),
  guestName: z.string().min(2, "Guest name is required"),
  guestEmail: z.string().email("Invalid guest email"),
  guestPhone: z.string().min(8, "Guest phone number is required"),
  checkInDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid check-in date format"
  }),
  checkOutDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid check-out date format"
  }),
  guestCount: z.number().int().min(1).max(10).default(1),
  currency: z.enum(["INR", "USD"]).default("INR"),
  specialRequests: z.string().optional()
}).refine(
  (data) => {
    const inDate = new Date(data.checkInDate);
    const outDate = new Date(data.checkOutDate);
    return outDate.getTime() > inDate.getTime();
  },
  {
    message: "Check-out date must strictly be after check-in date (minimum 1 night stay required)",
    path: ["checkOutDate"]
  }
);

export const updateBookingStatusSchema = z.object({
  bookingStatus: z.enum(["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]),
  paymentStatus: z.enum(["PENDING", "PAID", "REFUNDED"]).optional()
});

export const createEnquirySchema = z.object({
  hotelId: z.string().uuid().optional().nullable(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  category: z.enum(["GENERAL", "BOOKING_INQUIRY", "EVENT_WEDDING", "CORPORATE", "FEEDBACK"]).default("GENERAL"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export const updateEnquirySchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]),
  staffNotes: z.string().optional()
});

export const createReviewSchema = z.object({
  hotelId: z.string().uuid("Invalid hotel ID"),
  guestName: z.string().min(2, "Guest name is required"),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  comment: z.string().min(10, "Review comment must be at least 10 characters")
});
