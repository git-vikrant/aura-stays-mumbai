import React, { useState } from "react";
import { Search, MapPin, Calendar, Users, SlidersHorizontal, Sparkles } from "lucide-react";

export const MUMBAI_NEIGHBORHOODS = [
  "All Mumbai Neighborhoods",
  "Colaba",
  "Marine Drive",
  "Kala Ghoda",
  "Fort",
  "Bandra West",
  "Pali Hill",
  "Juhu",
  "Worli",
  "Malabar Hill",
  "Lower Parel",
  "BKC",
  "Powai",
  "Versova",
  "Dadar"
];

export default function HeroSearch({ onSearch, initialParams = {} }) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split("T")[0];

  const [neighborhood, setNeighborhood] = useState(initialParams.neighborhood || "");
  const [checkInDate, setCheckInDate] = useState(initialParams.checkInDate || tomorrow);
  const [checkOutDate, setCheckOutDate] = useState(initialParams.checkOutDate || dayAfter);
  const [guests, setGuests] = useState(initialParams.guests || 2);
  const [canonicalType, setCanonicalType] = useState(initialParams.canonicalType || "");
  const [dateError, setDateError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setDateError("Check-out date must strictly be after check-in date (minimum 1 night stay required)");
      return;
    }
    setDateError("");

    onSearch({
      neighborhood: neighborhood === "All Mumbai Neighborhoods" ? "" : neighborhood,
      checkInDate,
      checkOutDate,
      guests,
      canonicalType
    });
  };

  return (
    <div className="relative pt-12 pb-20 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-[#0a1226] to-[#080d1a] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Luxury Tagline */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Mumbai Boutique Collection • 14 Heritage & Coastal Properties</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Intimate Luxury, <span className="gold-gradient-text italic">Arabian Sea Panoramas</span> & Mumbai Heritage
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          From restored 1912 Victorian manors in Colaba to seaside retreats in Bandra & Juhu. Reserved exclusively for discerning travelers.
        </p>

        {/* Search Filter Card */}
        <div className="mt-10 max-w-5xl mx-auto glass-panel p-4 sm:p-6 rounded-2xl shadow-2xl gold-border-glow text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Neighborhood Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> Neighborhood
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                >
                  {MUMBAI_NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Check-In Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Check-In
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setCheckInDate(e.target.value);
                    if (new Date(checkOutDate) <= new Date(e.target.value)) {
                      const next = new Date(new Date(e.target.value).getTime() + 86400000)
                        .toISOString()
                        .split("T")[0];
                      setCheckOutDate(next);
                    }
                  }}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  required
                />
              </div>

              {/* Check-Out Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Check-Out
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  required
                />
              </div>

              {/* Guests Count */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" /> Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                >
                  <option value={1}>1 Guest (Solo)</option>
                  <option value={2}>2 Guests (Couples)</option>
                  <option value={3}>3 Guests (Family)</option>
                  <option value={4}>4 Guests (Executive Suite)</option>
                </select>
              </div>
            </div>

            {/* Error Message for Date Logic */}
            {dateError && (
              <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
                ⚠️ {dateError}
              </div>
            )}

            {/* Secondary Filter & Search Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400">Room Style:</span>
                <select
                  value={canonicalType}
                  onChange={(e) => setCanonicalType(e.target.value)}
                  className="bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">All Categories</option>
                  <option value="DELUXE_ROOM">Deluxe Rooms</option>
                  <option value="EXECUTIVE_SUITE">Executive Suites</option>
                  <option value="HERITAGE_SUITE">Heritage Suites</option>
                  <option value="STUDIO_QUEEN">Studio Queens</option>
                  <option value="PRESIDENTIAL_VILLA">Presidential Villas</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wider uppercase transition shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-slate-950" />
                Search Available Suites
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
