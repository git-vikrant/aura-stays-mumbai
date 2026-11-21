import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/api.js";
import RoomCard from "../components/RoomCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { Search, Filter, Calendar, MapPin, Users, Sparkles, AlertCircle } from "lucide-react";
import { MUMBAI_NEIGHBORHOODS } from "../components/HeroSearch.jsx";

export default function SearchPage() {
  const location = useLocation();
  const { currency } = useCurrency();

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split("T")[0];

  const query = new URLSearchParams(location.search);
  const [neighborhood, setNeighborhood] = useState(query.get("neighborhood") || "");
  const [checkInDate, setCheckInDate] = useState(query.get("checkInDate") || tomorrow);
  const [checkOutDate, setCheckOutDate] = useState(query.get("checkOutDate") || dayAfter);
  const [guests, setGuests] = useState(Number(query.get("guests")) || 2);
  const [canonicalType, setCanonicalType] = useState(query.get("canonicalType") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [rooms, setRooms] = useState([]);
  const [nights, setNights] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState("");

  const executeSearch = async () => {
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError("Check-out date must strictly be after check-in date");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const params = {
        neighborhood: neighborhood === "All Mumbai Neighborhoods" ? "" : neighborhood,
        checkInDate,
        checkOutDate,
        guests,
        canonicalType,
        currency
      };
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get("/bookings/search", { params });
      setRooms(res.data.data.rooms || []);
      setNights(res.data.data.nights || 1);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [currency]);

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Inventory Query</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white">Find Available Suites</h1>
        <p className="text-xs text-slate-400 mt-1">
          Instant availability across 14 Mumbai boutique hotels with conflict-free reservation locking.
        </p>
      </div>

      {/* Search Criteria Bar */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Neighborhood</label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {MUMBAI_NEIGHBORHOODS.map((n) => (
                <option key={n} value={n === "All Mumbai Neighborhoods" ? "" : n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Check-In</label>
            <input
              type="date"
              value={checkInDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Check-Out</label>
            <input
              type="date"
              value={checkOutDate}
              min={checkInDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Room Class</label>
            <select
              value={canonicalType}
              onChange={(e) => setCanonicalType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All Categories</option>
              <option value="DELUXE_ROOM">Deluxe Rooms</option>
              <option value="EXECUTIVE_SUITE">Executive Suites</option>
              <option value="HERITAGE_SUITE">Heritage Suites</option>
              <option value="STUDIO_QUEEN">Studio Queens</option>
              <option value="PRESIDENTIAL_VILLA">Presidential Villas</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Displaying rates in <strong className="text-amber-400">{currency}</strong> for {nights} night(s) stay.
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Update Search
          </button>
        </div>
      </form>

      {/* Results Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-white">
            Available Suites ({rooms.length})
          </h3>
          <span className="text-xs text-slate-400">
            {new Date(checkInDate).toLocaleDateString()} — {new Date(checkOutDate).toLocaleDateString()}
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-300 text-sm font-medium">No suites match the specified date range and filters.</p>
            <p className="text-slate-500 text-xs mt-1">Try selecting different dates or clearing category filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                hotel={room.hotel}
                nights={nights}
                onBook={(r) => setSelectedRoom(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          hotel={selectedRoom.hotel}
          searchDates={{ checkInDate, checkOutDate, guests }}
          onClose={() => setSelectedRoom(null)}
          onSuccess={() => {
            executeSearch();
          }}
        />
      )}
    </div>
  );
}
