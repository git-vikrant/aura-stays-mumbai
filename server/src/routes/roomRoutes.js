import { Router } from "express";
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from "../controllers/roomController.js";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createRoomSchema } from "../validations/schemas.js";

const router = Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);

// Admin-protected CRUD
router.post("/", authenticateJWT, requireRole(["ADMIN"]), validate(createRoomSchema), createRoom);
router.put("/:id", authenticateJWT, requireRole(["ADMIN"]), updateRoom);
router.delete("/:id", authenticateJWT, requireRole(["ADMIN"]), deleteRoom);

export default router;
