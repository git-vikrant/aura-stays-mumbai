import prisma from "../prisma.js";
import { apiSuccess, apiError } from "../utils/response.js";
import { logger } from "../logger.js";

export async function getAllRooms(req, res) {
  try {
    const { hotelId, canonicalType, minCapacity, status } = req.query;

    const where = {};
    if (hotelId) where.hotelId = hotelId;
    if (canonicalType) where.canonicalType = canonicalType;
    if (minCapacity) where.capacity = { gte: parseInt(minCapacity) };
    if (status) where.status = status;

    const rooms = await prisma.room.findMany({
      where,
      include: {
        hotel: {
          select: { id: true, name: true, slug: true, neighborhood: true }
        }
      },
      orderBy: { basePriceINR: "asc" }
    });

    const formatted = rooms.map((r) => ({
      ...r,
      images: JSON.parse(r.images || "[]"),
      amenities: JSON.parse(r.amenities || "[]")
    }));

    return apiSuccess(res, formatted, "Rooms retrieved");
  } catch (err) {
    logger.error(`[ROOM_ERROR] Failed to fetch rooms: ${err.message}`);
    return apiError(res, "Failed to retrieve rooms", 500, err.message);
  }
}

export async function getRoomById(req, res) {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id },
      include: { hotel: true }
    });

    if (!room) {
      return apiError(res, "Room not found", 404, null, "ROOM_NOT_FOUND");
    }

    return apiSuccess(res, {
      ...room,
      images: JSON.parse(room.images || "[]"),
      amenities: JSON.parse(room.amenities || "[]")
    });
  } catch (err) {
    return apiError(res, "Failed to retrieve room", 500, err.message);
  }
}

export async function createRoom(req, res) {
  try {
    const data = req.body;

    const room = await prisma.room.create({
      data: {
        hotelId: data.hotelId,
        roomNumber: data.roomNumber,
        name: data.name,
        canonicalType: data.canonicalType,
        basePriceINR: data.basePriceINR,
        basePriceUSD: data.basePriceUSD,
        capacity: data.capacity || 2,
        bedConfiguration: data.bedConfiguration || "1 King Bed",
        sizeSqFt: data.sizeSqFt || 450,
        amenities: JSON.stringify(data.amenities || []),
        images: JSON.stringify(data.images || []),
        status: "AVAILABLE"
      }
    });

    return apiSuccess(res, room, "Room created successfully", 201);
  } catch (err) {
    return apiError(res, "Failed to create room", 500, err.message);
  }
}

export async function updateRoom(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.room.update({
      where: { id },
      data: {
        ...data,
        amenities: data.amenities ? JSON.stringify(data.amenities) : undefined,
        images: data.images ? JSON.stringify(data.images) : undefined
      }
    });

    return apiSuccess(res, updated, "Room updated successfully");
  } catch (err) {
    return apiError(res, "Failed to update room", 500, err.message);
  }
}

export async function deleteRoom(req, res) {
  try {
    const { id } = req.params;
    await prisma.room.delete({ where: { id } });
    return apiSuccess(res, null, "Room deleted successfully");
  } catch (err) {
    return apiError(res, "Failed to delete room", 500, err.message);
  }
}
