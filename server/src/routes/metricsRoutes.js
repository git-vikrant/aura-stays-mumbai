import { Router } from "express";
import { getHospitalityMetrics } from "../controllers/metricsController.js";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";

const router = Router();

// Staff and Admin can view occupancy, ADR, RevPAR metrics
router.get("/dashboard", authenticateJWT, requireRole(["STAFF", "ADMIN"]), getHospitalityMetrics);

export default router;
