import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "aura_mumbai_boutique_secret_key_2026_jwt_token_secure!";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "aura_mumbai_boutique_refresh_secret_key_2026_secure!";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
