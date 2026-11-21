import prisma from "../prisma.js";
import { apiSuccess, apiError } from "../utils/response.js";
import { logger } from "../logger.js";

export async function getReviewsForHotel(req, res) {
  try {
    const { hotelId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { hotelId, isVerified: true },
      orderBy: { createdAt: "desc" }
    });

    const averageRating = reviews.length > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
      : 5.0;

    return apiSuccess(res, { reviews, total: reviews.length, averageRating }, "Reviews retrieved");
  } catch (err) {
    return apiError(res, "Failed to retrieve reviews", 500, err.message);
  }
}

export async function createReview(req, res) {
  try {
    const { hotelId, rating, title, comment, guestName } = req.body;

    const review = await prisma.review.create({
      data: {
        hotelId,
        userId: req.user?.id || null,
        guestName: guestName || req.user?.name || "Guest",
        rating: parseInt(rating),
        title,
        comment,
        isVerified: true
      }
    });

    // Update hotel average rating
    const allReviews = await prisma.review.findMany({ where: { hotelId } });
    const newAverage = Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10;

    await prisma.hotel.update({
      where: { id: hotelId },
      data: { starRating: newAverage }
    });

    logger.info(`[REVIEW_SUBMITTED] New ${rating}-star review for hotel ${hotelId} by ${review.guestName}`);

    return apiSuccess(res, review, "Thank you for your feedback!", 201);
  } catch (err) {
    return apiError(res, "Failed to submit review", 500, err.message);
  }
}
