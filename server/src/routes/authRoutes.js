import { Router } from "express";
import { signup, login, refreshToken, getMe, logout } from "../controllers/authController.js";
import { authenticateJWT } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { signupSchema, loginSchema, refreshTokenSchema } from "../validations/schemas.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
router.get("/me", authenticateJWT, getMe);
router.post("/logout", authenticateJWT, logout);

export default router;
