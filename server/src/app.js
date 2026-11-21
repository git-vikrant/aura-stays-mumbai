import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { morganMiddleware, logger } from "./logger.js";
import { apiError, apiSuccess } from "./utils/response.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morganMiddleware);

// Serve uploads statically
const uploadsDir = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsDir));

// Healthcheck
app.get("/api/health", (req, res) => {
  return apiSuccess(res, {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "Aura Stays Mumbai Backend API"
  }, "Aura Stays service operational");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/metrics", metricsRoutes);

// 404 Fallback
app.use((req, res) => {
  return apiError(res, `Route ${req.method} ${req.originalUrl} not found`, 404, null, "NOT_FOUND");
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`[UNHANDLED_ERROR] ${err.stack || err.message}`);

  if (err.name === "MulterError") {
    return apiError(res, `Upload error: ${err.message}`, 400, null, "FILE_UPLOAD_ERROR");
  }

  return apiError(
    res,
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    500,
    process.env.NODE_ENV === "production" ? null : err.stack,
    "INTERNAL_SERVER_ERROR"
  );
});

export default app;
