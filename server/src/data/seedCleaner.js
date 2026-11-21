/**
 * Seed Cleaner & Data Hygiene Pipeline
 * Standardizes messy multi-property hospitality data:
 * 1. Renamed room types -> Canonical taxonomy
 * 2. Multi-currency price strings (INR, USD) -> Normalized dual-currency columns
 * 3. Inverted / Corrupted stay dates (checkOut <= checkIn) -> Detected, audited, and repaired
 */

export const CANONICAL_ROOM_TYPES = {
  DELUXE_ROOM: "DELUXE_ROOM",
  EXECUTIVE_SUITE: "EXECUTIVE_SUITE",
  HERITAGE_SUITE: "HERITAGE_SUITE",
  STUDIO_QUEEN: "STUDIO_QUEEN",
  PRESIDENTIAL_VILLA: "PRESIDENTIAL_VILLA"
};

/**
 * Normalizes disparate room type descriptions across 14 independent boutique properties
 * into a structured, unified taxonomy.
 */
export function normalizeRoomType(rawType) {
  if (!rawType || typeof rawType !== "string") {
    return CANONICAL_ROOM_TYPES.DELUXE_ROOM;
  }

  const clean = rawType.toLowerCase().trim();

  // Presidential / Penthouse / Villa
  if (clean.includes("presidential") || clean.includes("penthouse") || clean.includes("villa") || clean.includes("imperial")) {
    return CANONICAL_ROOM_TYPES.PRESIDENTIAL_VILLA;
  }

  // Heritage / Colonial / Royal / Victorian
  if (clean.includes("heritage") || clean.includes("colonial") || clean.includes("victoria") || clean.includes("artisan") || clean.includes("curator")) {
    return CANONICAL_ROOM_TYPES.HERITAGE_SUITE;
  }

  // Executive / Business Suites
  if (clean.includes("executive") || clean.includes("exec") || clean.includes("ambassador") || clean.includes("governor")) {
    return CANONICAL_ROOM_TYPES.EXECUTIVE_SUITE;
  }

  // Studio / Queen / Cozy / Boudoir
  if (clean.includes("studio") || clean.includes("queen") || clean.includes("cozy") || clean.includes("loft")) {
    return CANONICAL_ROOM_TYPES.STUDIO_QUEEN;
  }

  // Deluxe (Default standard premium)
  if (clean.includes("deluxe") || clean.includes("king") || clean.includes("bayview") || clean.includes("facing")) {
    return CANONICAL_ROOM_TYPES.DELUXE_ROOM;
  }

  return CANONICAL_ROOM_TYPES.DELUXE_ROOM;
}

/**
 * Parses and normalizes multi-currency pricing strings (e.g. "$165", "INR 18,500", "₹12,000", "USD 380", "14000")
 * into both INR and USD base numeric amounts.
 */
export function normalizeCurrencyAndPrice(rawPrice, exchangeRateUSDToINR = 84) {
  if (typeof rawPrice === "number") {
    const baseINR = rawPrice;
    return {
      basePriceINR: baseINR,
      basePriceUSD: Math.round((baseINR / exchangeRateUSDToINR) * 100) / 100,
      detectedCurrency: "INR"
    };
  }

  if (!rawPrice || typeof rawPrice !== "string") {
    return {
      basePriceINR: 10000,
      basePriceUSD: Math.round((10000 / exchangeRateUSDToINR) * 100) / 100,
      detectedCurrency: "INR"
    };
  }

  const str = rawPrice.trim();
  const isUSD = str.includes("$") || str.toUpperCase().includes("USD");
  const numericString = str.replace(/[^0-9.]/g, "");
  const parsedValue = parseFloat(numericString) || 0;

  if (isUSD) {
    const usd = parsedValue;
    const inr = Math.round(usd * exchangeRateUSDToINR);
    return {
      basePriceINR: inr,
      basePriceUSD: usd,
      detectedCurrency: "USD"
    };
  } else {
    const inr = parsedValue;
    const usd = Math.round((inr / exchangeRateUSDToINR) * 100) / 100;
    return {
      basePriceINR: inr,
      basePriceUSD: usd,
      detectedCurrency: "INR"
    };
  }
}

/**
 * Validates check-in and check-out dates, detects corrupted historical records
 * (such as check-out <= check-in), generates an audit trace, and rectifies errors.
 */
export function cleanAndValidateStayDates(rawCheckIn, rawCheckOut, bookingRef = "UNKNOWN") {
  let checkIn = new Date(rawCheckIn);
  let checkOut = new Date(rawCheckOut);

  // If invalid date formats
  if (isNaN(checkIn.getTime())) checkIn = new Date("2026-11-20");
  if (isNaN(checkOut.getTime())) checkOut = new Date("2026-11-22");

  let wasRepaired = false;
  let repairReason = null;

  // Case 1: Inverted Dates (checkOut is earlier than checkIn)
  if (checkOut.getTime() < checkIn.getTime()) {
    wasRepaired = true;
    repairReason = "INVERTED_DATES_DETECTED_SWAPPED";
    console.warn(`[DATA_HYGIENE_ALERT] Booking ${bookingRef}: Check-out (${checkOut.toISOString().split('T')[0]}) was BEFORE check-in (${checkIn.toISOString().split('T')[0]}). Swapping dates to restore temporal consistency.`);
    const temp = checkIn;
    checkIn = checkOut;
    checkOut = temp;
  }

  // Case 2: Zero-night stay (checkOut equals checkIn)
  const diffMs = checkOut.getTime() - checkIn.getTime();
  const oneDayMs = 1000 * 60 * 60 * 24;
  let nights = Math.round(diffMs / oneDayMs);

  if (nights <= 0) {
    wasRepaired = true;
    repairReason = repairReason ? `${repairReason}_AND_ZERO_NIGHTS_FIXED` : "ZERO_NIGHTS_FIXED";
    console.warn(`[DATA_HYGIENE_ALERT] Booking ${bookingRef}: 0-night stay detected. Enforcing minimum 1 night stay.`);
    checkOut = new Date(checkIn.getTime() + oneDayMs);
    nights = 1;
  }

  return {
    checkInDate: checkIn,
    checkOutDate: checkOut,
    nights,
    wasRepaired,
    repairReason
  };
}
