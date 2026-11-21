import { Router } from "express";
import { getAllHotels, getHotelBySlug, createHotel, updateHotel, deleteHotel } from "../controllers/hotelController.js";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createHotelSchema } from "../validations/schemas.js";

const router = Router();

router.get("/", getAllHotels);
router.get("/:slug", getHotelBySlug);

// Admin-protected endpoints
router.post("/", authenticateJWT, requireRole(["ADMIN"]), validate(createHotelSchema), createHotel);
router.put("/:id", authenticateJWT, requireRole(["ADMIN"]), updateHotel);
router.delete("/:id", authenticateJWT, requireRole(["ADMIN"]), deleteHotel);

export default router;
