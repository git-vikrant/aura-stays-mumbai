import prisma from "../prisma.js";
import { apiSuccess, apiError } from "../utils/response.js";
import { logger } from "../logger.js";

export async function getAllHotels(req, res) {
  try {
    const { neighborhood, minRating, search } = req.query;

    const where = { isActive: true };

    if (neighborhood) {
      where.neighborhood = { contains: neighborhood };
    }

    if (minRating) {
      where.starRating = { gte: parseFloat(minRating) };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { neighborhood: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        rooms: {
          select: {
            id: true,
            basePriceINR: true,
            basePriceUSD: true,
            canonicalType: true,
            capacity: true,
            status: true
          }
        },
        _count: {
          select: { reviews: true, rooms: true }
        }
      },
      orderBy: { starRating: "desc" }
    });

    // Format response with starting rates and parsed JSON fields
    const formattedHotels = hotels.map((h) => {
      const minINR = h.rooms.length > 0 ? Math.min(...h.rooms.map((r) => r.basePriceINR)) : 0;
      const minUSD = h.rooms.length > 0 ? Math.min(...h.rooms.map((r) => r.basePriceUSD)) : 0;

      return {
        ...h,
        images: JSON.parse(h.images || "[]"),
        amenities: JSON.parse(h.amenities || "[]"),
        startingPriceINR: minINR,
        startingPriceUSD: minUSD,
        totalRooms: h._count.rooms,
        reviewCount: h._count.reviews
      };
    });

    return apiSuccess(res, formattedHotels, "Hotels retrieved successfully");
  } catch (err) {
    logger.error(`[HOTEL_ERROR] Failed to fetch hotels: ${err.message}`);
    return apiError(res, "Failed to retrieve hotels", 500, err.message);
  }
}

export async function getHotelBySlug(req, res) {
  try {
    const { slug } = req.params;

    const hotel = await prisma.hotel.findUnique({
      where: { slug },
      include: {
        rooms: {
          where: { status: "AVAILABLE" },
          orderBy: { basePriceINR: "asc" }
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!hotel) {
      return apiError(res, "Hotel property not found", 404, null, "HOTEL_NOT_FOUND");
    }

    const formatted = {
      ...hotel,
      images: JSON.parse(hotel.images || "[]"),
      amenities: JSON.parse(hotel.amenities || "[]"),
      rooms: hotel.rooms.map((r) => ({
        ...r,
        images: JSON.parse(r.images || "[]"),
        amenities: JSON.parse(r.amenities || "[]")
      }))
    };

    return apiSuccess(res, formatted, "Hotel details retrieved");
  } catch (err) {
    logger.error(`[HOTEL_ERROR] Failed to fetch hotel ${req.params.slug}: ${err.message}`);
    return apiError(res, "Failed to retrieve hotel details", 500, err.message);
  }
}

export async function createHotel(req, res) {
  try {
    const data = req.body;

    const existing = await prisma.hotel.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return apiError(res, "A hotel with this slug already exists", 409, null, "SLUG_EXISTS");
    }

    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        slug: data.slug,
        neighborhood: data.neighborhood,
        address: data.address,
        city: data.city || "Mumbai",
        pincode: data.pincode || "400001",
        description: data.description,
        starRating: data.starRating || 4.5,
        images: JSON.stringify(data.images || []),
        amenities: JSON.stringify(data.amenities || []),
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        checkInTime: data.checkInTime || "14:00",
        checkOutTime: data.checkOutTime || "11:00",
        isActive: true
      }
    });

    logger.info(`[ADMIN_ACTION] Hotel created: ${hotel.name} (${hotel.slug}) by ${req.user.email}`);
    return apiSuccess(res, hotel, "Hotel created successfully", 201);
  } catch (err) {
    return apiError(res, "Failed to create hotel", 500, err.message);
  }
}

export async function updateHotel(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.hotel.update({
      where: { id },
      data: {
        ...data,
        images: data.images ? JSON.stringify(data.images) : undefined,
        amenities: data.amenities ? JSON.stringify(data.amenities) : undefined
      }
    });

    return apiSuccess(res, updated, "Hotel updated successfully");
  } catch (err) {
    return apiError(res, "Failed to update hotel", 500, err.message);
  }
}

export async function deleteHotel(req, res) {
  try {
    const { id } = req.params;
    await prisma.hotel.delete({ where: { id } });
    return apiSuccess(res, null, "Hotel deleted successfully");
  } catch (err) {
    return apiError(res, "Failed to delete hotel", 500, err.message);
  }
}
