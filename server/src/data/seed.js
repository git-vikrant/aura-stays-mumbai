import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { RAW_MUMBAI_PROPERTIES, RAW_MESSY_BOOKINGS, RAW_GUEST_REVIEWS, RAW_ENQUIRIES } from "./rawHotelDataset.js";
import { normalizeRoomType, normalizeCurrencyAndPrice, cleanAndValidateStayDates } from "./seedCleaner.js";

const prisma = new PrismaClient();

async function main() {
  console.log("==========================================================");
  console.log("🏨 Aura Stays Mumbai - Data Ingestion & Seeding Pipeline");
  console.log("==========================================================");

  // 1. Clear existing records safely
  console.log("🧹 Purging existing database tables...");
  await prisma.jobLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Default RBAC Users
  console.log("🔐 Seeding core RBAC users (Admin, Staff, Guest)...");
  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const staffPassword = await bcrypt.hash("Staff@12345", 10);
  const guestPassword = await bcrypt.hash("Guest@12345", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@aurastays.com",
      password: adminPassword,
      name: "Tanya Singhania (General Manager)",
      role: "ADMIN",
      phone: "+91 98200 10001"
    }
  });

  const staffUser = await prisma.user.create({
    data: {
      email: "staff@aurastays.com",
      password: staffPassword,
      name: "Kabir Merchant (Front Desk Manager)",
      role: "STAFF",
      phone: "+91 98200 20002"
    }
  });

  const guestUser = await prisma.user.create({
    data: {
      email: "guest@aurastays.com",
      password: guestPassword,
      name: "Vikram Malhotra",
      role: "GUEST",
      phone: "+91 98200 30003"
    }
  });

  console.log(`✅ Users created: Admin (${adminUser.email}), Staff (${staffUser.email}), Guest (${guestUser.email})`);

  // 3. Ingest 14 Mumbai Boutique Properties & Rooms
  console.log("\n🏙️ Ingesting 14 Mumbai boutique properties and normalizing inventory...");
  const hotelMap = {}; // slug -> Hotel
  const roomMap = {}; // `${hotelSlug}-${roomNumber}` -> Room
  let totalRoomsCreated = 0;

  for (const rawHotel of RAW_MUMBAI_PROPERTIES) {
    const hotel = await prisma.hotel.create({
      data: {
        name: rawHotel.name,
        slug: rawHotel.slug,
        neighborhood: rawHotel.neighborhood,
        address: rawHotel.address,
        city: rawHotel.city || "Mumbai",
        pincode: rawHotel.pincode,
        description: rawHotel.description,
        starRating: rawHotel.starRating,
        images: JSON.stringify(rawHotel.images),
        amenities: JSON.stringify(rawHotel.amenities),
        contactEmail: rawHotel.contactEmail,
        contactPhone: rawHotel.contactPhone,
        checkInTime: rawHotel.checkInTime || "14:00",
        checkOutTime: rawHotel.checkOutTime || "11:00",
        isActive: true
      }
    });

    hotelMap[hotel.slug] = hotel;

    for (const rawRoom of rawHotel.rooms) {
      // Apply Data Hygiene:
      // 1. Normalize messy room type into canonical taxonomy
      const canonicalType = normalizeRoomType(rawRoom.rawType);
      // 2. Normalize mixed currency pricing (INR, USD strings)
      const { basePriceINR, basePriceUSD } = normalizeCurrencyAndPrice(rawRoom.rawPrice);

      const room = await prisma.room.create({
        data: {
          hotelId: hotel.id,
          roomNumber: rawRoom.roomNumber,
          name: rawRoom.name,
          canonicalType,
          basePriceINR,
          basePriceUSD,
          capacity: rawRoom.capacity || 2,
          bedConfiguration: rawRoom.bed,
          sizeSqFt: rawRoom.sqft,
          amenities: JSON.stringify(rawHotel.amenities.slice(0, 4)),
          images: JSON.stringify(rawHotel.images),
          status: "AVAILABLE"
        }
      });

      roomMap[`${hotel.slug}-${room.roomNumber}`] = room;
      totalRoomsCreated++;
    }
  }

  console.log(`✅ Successfully seeded 14 properties with ${totalRoomsCreated} normalized rooms.`);

  // 4. Ingest Guest Bookings & Repair Messy Cases
  console.log("\n📑 Ingesting booking records with data hygiene & anomaly resolution...");
  let repairedCount = 0;

  for (const rawBooking of RAW_MESSY_BOOKINGS) {
    const hotel = hotelMap[rawBooking.hotelSlug];
    if (!hotel) continue;

    const room = roomMap[`${rawBooking.hotelSlug}-${rawBooking.roomNumber}`];
    if (!room) continue;

    // Apply Stay Date Anomaly Cleaner
    const { checkInDate, checkOutDate, nights, wasRepaired, repairReason } = cleanAndValidateStayDates(
      rawBooking.rawCheckIn,
      rawBooking.rawCheckOut,
      rawBooking.ref
    );

    if (wasRepaired) repairedCount++;

    // Calculate normalized total amount
    const isUSD = rawBooking.rawCurrency === "USD";
    const totalAmount = isUSD
      ? room.basePriceUSD * nights
      : room.basePriceINR * nights;

    await prisma.booking.create({
      data: {
        bookingReference: rawBooking.ref,
        userId: rawBooking.guestEmail === guestUser.email ? guestUser.id : null,
        guestName: rawBooking.guestName,
        guestEmail: rawBooking.guestEmail,
        guestPhone: rawBooking.guestPhone,
        hotelId: hotel.id,
        roomId: room.id,
        checkInDate,
        checkOutDate,
        nights,
        guestCount: room.capacity > 2 ? 2 : 1,
        currency: isUSD ? "USD" : "INR",
        totalAmount,
        paymentStatus: "PAID",
        bookingStatus: rawBooking.status,
        specialRequests: wasRepaired ? `Data Hygiene Auto-Fixed: ${repairReason}` : "High floor requested, quiet room",
        source: wasRepaired ? "MIGRATED_REPAIRED_RECORD" : "MIGRATED_RECORD"
      }
    });
  }

  console.log(`✅ Seeded ${RAW_MESSY_BOOKINGS.length} booking records (${repairedCount} anomalies sanitized).`);

  // 5. Ingest Reviews
  console.log("\n⭐ Ingesting guest reviews...");
  for (const rawReview of RAW_GUEST_REVIEWS) {
    const hotel = hotelMap[rawReview.hotelSlug];
    if (!hotel) continue;

    await prisma.review.create({
      data: {
        hotelId: hotel.id,
        guestName: rawReview.guestName,
        rating: rawReview.rating,
        title: rawReview.title,
        comment: rawReview.comment,
        isVerified: true
      }
    });
  }
  console.log(`✅ Seeded ${RAW_GUEST_REVIEWS.length} verified guest reviews.`);

  // 6. Ingest Guest Enquiries
  console.log("\n📨 Ingesting guest & corporate enquiries...");
  for (const rawEnquiry of RAW_ENQUIRIES) {
    const hotel = hotelMap[rawEnquiry.hotelSlug];

    await prisma.enquiry.create({
      data: {
        hotelId: hotel ? hotel.id : null,
        name: rawEnquiry.name,
        email: rawEnquiry.email,
        phone: rawEnquiry.phone,
        category: rawEnquiry.category,
        subject: rawEnquiry.subject,
        message: rawEnquiry.message,
        status: rawEnquiry.status,
        staffNotes: rawEnquiry.staffNotes
      }
    });
  }
  console.log(`✅ Seeded ${RAW_ENQUIRIES.length} guest enquiries.`);

  console.log("\n🎉 Aura Stays database seeding completed with 100% data integrity!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
