import React, { useState, useEffect } from "react";
import HotelCard from "../components/HotelCard.jsx";
import api from "../utils/api.js";
import { Search, MapPin, SlidersHorizontal, Sparkles } from "lucide-react";
import { MUMBAI_NEIGHBORHOODS } from "../components/HeroSearch.jsx";

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // rating | price_low | price_high

  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      try {
        const res = await api.get("/hotels");
        setHotels(res.data.data);
      } catch (err) {
        console.error("Failed to load hotels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  const filteredHotels = hotels
    .filter((h) => {
      const matchNeigh = neighborhood && neighborhood !== "All Mumbai Neighborhoods"
        ? h.neighborhood.toLowerCase().includes(neighborhood.toLowerCase())
        : true;
      const matchSearch = search
        ? h.name.toLowerCase().includes(search.toLowerCase()) ||
          h.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
          h.description.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchNeigh && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.startingPriceINR - b.startingPriceINR;
      if (sortBy === "price_high") return b.startingPriceINR - a.startingPriceINR;
      return (b.starRating || 0) - (a.starRating || 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Portfolio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          The 14 Boutique Hotels of Mumbai
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Discover our restored Victorian manors, Arabian Sea promenades, art deco residencies, and tropical hillside enclaves across Mumbai.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotel name, neighborhood..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Neighborhood & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {MUMBAI_NEIGHBORHOODS.map((n) => (
                <option key={n} value={n === "All Mumbai Neighborhoods" ? "" : n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="rating">Sort: Guest Rating</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">No properties found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSearch("");
              setNeighborhood("");
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}
