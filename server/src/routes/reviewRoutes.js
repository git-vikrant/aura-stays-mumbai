import { Router } from "express";
import { getReviewsForHotel, createReview } from "../controllers/reviewController.js";
import { optionalAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createReviewSchema } from "../validations/schemas.js";

const router = Router();

router.get("/hotel/:hotelId", getReviewsForHotel);
router.post("/", optionalAuth, validate(createReviewSchema), createReview);

export default router;
