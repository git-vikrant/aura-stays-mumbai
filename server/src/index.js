import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { logger } from "./logger.js";
import prisma from "./prisma.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info("✅ Database connection established successfully.");

    app.listen(PORT, () => {
      logger.info(`✨ Aura Stays Mumbai Platform listening on port ${PORT}`);
      logger.info(`🌐 Local API Base: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
