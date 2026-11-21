import { describe, it, expect } from "vitest";
import {
  normalizeRoomType,
  normalizeCurrencyAndPrice,
  cleanAndValidateStayDates,
  CANONICAL_ROOM_TYPES
} from "../src/data/seedCleaner.js";

describe("Data Hygiene Pipeline - Unit Tests", () => {
  describe("Room Type Taxonomy Normalization", () => {
    it("should normalize disparate room descriptions to canonical types", () => {
      expect(normalizeRoomType("Deluxe King Room")).toBe(CANONICAL_ROOM_TYPES.DELUXE_ROOM);
      expect(normalizeRoomType("Ocean Deluxe King")).toBe(CANONICAL_ROOM_TYPES.DELUXE_ROOM);
      expect(normalizeRoomType("Executive Suite Oceanfront")).toBe(CANONICAL_ROOM_TYPES.EXECUTIVE_SUITE);
      expect(normalizeRoomType("Business Exec Suite")).toBe(CANONICAL_ROOM_TYPES.EXECUTIVE_SUITE);
      expect(normalizeRoomType("Colonial Heritage Grand Suite")).toBe(CANONICAL_ROOM_TYPES.HERITAGE_SUITE);
      expect(normalizeRoomType("Victoria Royal Suite")).toBe(CANONICAL_ROOM_TYPES.HERITAGE_SUITE);
      expect(normalizeRoomType("Boutique Queen Room")).toBe(CANONICAL_ROOM_TYPES.STUDIO_QUEEN);
      expect(normalizeRoomType("Queen Cozy Studio")).toBe(CANONICAL_ROOM_TYPES.STUDIO_QUEEN);
      expect(normalizeRoomType("Presidential Penthouse Villa")).toBe(CANONICAL_ROOM_TYPES.PRESIDENTIAL_VILLA);
      expect(normalizeRoomType("Imperial Beach Villa")).toBe(CANONICAL_ROOM_TYPES.PRESIDENTIAL_VILLA);
    });

    it("should default unknown or empty strings to DELUXE_ROOM", () => {
      expect(normalizeRoomType("")).toBe(CANONICAL_ROOM_TYPES.DELUXE_ROOM);
      expect(normalizeRoomType(null)).toBe(CANONICAL_ROOM_TYPES.DELUXE_ROOM);
    });
  });

  describe("Multi-Currency Price Normalization", () => {
    it("should correctly normalize INR prices", () => {
      const result = normalizeCurrencyAndPrice("INR 18,500", 84);
      expect(result.detectedCurrency).toBe("INR");
      expect(result.basePriceINR).toBe(18500);
      expect(result.basePriceUSD).toBe(Math.round((18500 / 84) * 100) / 100);
    });

    it("should correctly normalize Rupee symbol pricing", () => {
      const result = normalizeCurrencyAndPrice("₹12,000", 84);
      expect(result.detectedCurrency).toBe("INR");
      expect(result.basePriceINR).toBe(12000);
    });

    it("should correctly normalize USD prices", () => {
      const result = normalizeCurrencyAndPrice("$165", 84);
      expect(result.detectedCurrency).toBe("USD");
      expect(result.basePriceUSD).toBe(165);
      expect(result.basePriceINR).toBe(165 * 84);
    });

    it("should correctly parse raw numbers", () => {
      const result = normalizeCurrencyAndPrice(15000, 84);
      expect(result.detectedCurrency).toBe("INR");
      expect(result.basePriceINR).toBe(15000);
    });
  });

  describe("Inverted & Corrupted Stay Dates Resolution", () => {
    it("should detect and transpose inverted check-in and check-out dates", () => {
      const { checkInDate, checkOutDate, nights, wasRepaired, repairReason } = cleanAndValidateStayDates(
        "2026-11-15",
        "2026-11-12",
        "TEST-ANOMALY-001"
      );

      expect(wasRepaired).toBe(true);
      expect(repairReason).toContain("INVERTED_DATES_DETECTED_SWAPPED");
      expect(checkOutDate.getTime()).toBeGreaterThan(checkInDate.getTime());
      expect(nights).toBe(3);
    });

    it("should fix 0-night stays by setting minimum 1 night duration", () => {
      const { checkInDate, checkOutDate, nights, wasRepaired, repairReason } = cleanAndValidateStayDates(
        "2026-10-20",
        "2026-10-20",
        "TEST-ANOMALY-002"
      );

      expect(wasRepaired).toBe(true);
      expect(repairReason).toContain("ZERO_NIGHTS_FIXED");
      expect(nights).toBe(1);
      expect(checkOutDate.getTime()).toBeGreaterThan(checkInDate.getTime());
    });

    it("should leave valid forward dates unmodified", () => {
      const { checkInDate, checkOutDate, nights, wasRepaired } = cleanAndValidateStayDates(
        "2026-12-01",
        "2026-12-05",
        "TEST-VALID-003"
      );

      expect(wasRepaired).toBe(false);
      expect(nights).toBe(4);
    });
  });
});
