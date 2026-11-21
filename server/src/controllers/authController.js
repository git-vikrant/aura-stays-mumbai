import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.js";
import { apiSuccess, apiError } from "../utils/response.js";
import { logger } from "../logger.js";

export async function signup(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return apiError(res, "An account with this email already exists", 409, null, "EMAIL_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "GUEST"
      }
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    logger.info(`[AUTH] New guest registered: ${user.email}`);

    return apiSuccess(
      res,
      {
        user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
        accessToken,
        refreshToken
      },
      "Account created successfully",
      201
    );
  } catch (err) {
    logger.error(`[AUTH_ERROR] Signup failed: ${err.message}`);
    return apiError(res, "Failed to create account", 500, err.message);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return apiError(res, "Invalid email or password", 401, null, "INVALID_CREDENTIALS");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiError(res, "Invalid email or password", 401, null, "INVALID_CREDENTIALS");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    logger.info(`[AUTH] User signed in: ${user.email} (Role: ${user.role})`);

    return apiSuccess(
      res,
      {
        user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
        accessToken,
        refreshToken
      },
      "Login successful"
    );
  } catch (err) {
    logger.error(`[AUTH_ERROR] Login failed: ${err.message}`);
    return apiError(res, "Failed to sign in", 500, err.message);
  }
}

export async function refreshToken(req, res) {
  try {
    const { refreshToken: token } = req.body;

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return apiError(res, "Invalid or expired refresh token", 401, null, "INVALID_REFRESH_TOKEN");
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== token) {
      return apiError(res, "Refresh token revoked or mismatched", 401, null, "TOKEN_REVOKED");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    return apiSuccess(
      res,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      },
      "Token refreshed successfully"
    );
  } catch (err) {
    logger.error(`[AUTH_ERROR] Refresh token failed: ${err.message}`);
    return apiError(res, "Failed to refresh token", 500, err.message);
  }
}

export async function getMe(req, res) {
  return apiSuccess(res, { user: req.user });
}

export async function logout(req, res) {
  try {
    if (req.user?.id) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null }
      });
    }
    return apiSuccess(res, null, "Logged out successfully");
  } catch (err) {
    return apiError(res, "Failed to log out", 500, err.message);
  }
}
