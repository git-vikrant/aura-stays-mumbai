import { verifyAccessToken } from "../utils/token.js";
import { apiError } from "../utils/response.js";
import prisma from "../prisma.js";

export async function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return apiError(res, "Authentication required. Missing Bearer token.", 401, null, "UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, phone: true }
    });

    if (!user) {
      return apiError(res, "User account no longer exists.", 401, null, "USER_NOT_FOUND");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return apiError(res, "Access token has expired. Please refresh your session.", 401, null, "TOKEN_EXPIRED");
    }
    return apiError(res, "Invalid or corrupted access token.", 401, null, "INVALID_TOKEN");
  }
}

/**
 * Optional authentication middleware: if token is present, sets req.user; otherwise proceeds.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true, phone: true }
      });
      if (user) req.user = user;
    }
  } catch {
    // Proceed as unauthenticated
  }
  next();
}

/**
 * Role-Based Access Control Middleware
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return apiError(res, "Authentication required.", 401, null, "UNAUTHORIZED");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return apiError(
        res,
        `Access denied. Requires one of [${allowedRoles.join(", ")}] roles. Current role: ${req.user.role}`,
        403,
        null,
        "FORBIDDEN"
      );
    }

    next();
  };
}
