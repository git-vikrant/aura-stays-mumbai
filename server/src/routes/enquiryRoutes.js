import { Router } from "express";
import { createEnquiry, getAllEnquiries, updateEnquiry, deleteEnquiry } from "../controllers/enquiryController.js";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import { updateEnquirySchema } from "../validations/schemas.js";

const router = Router();

// Public enquiry creation with optional file/image upload
router.post("/", upload.single("attachment"), createEnquiry);

// Staff & Admin management
router.get("/", authenticateJWT, requireRole(["STAFF", "ADMIN"]), getAllEnquiries);
router.patch("/:id", authenticateJWT, requireRole(["STAFF", "ADMIN"]), validate(updateEnquirySchema), updateEnquiry);
router.delete("/:id", authenticateJWT, requireRole(["ADMIN"]), deleteEnquiry);

export default router;
