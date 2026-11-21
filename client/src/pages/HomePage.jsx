import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import HeroSearch from "../components/HeroSearch.jsx";
import HotelCard from "../components/HotelCard.jsx";
import api from "../utils/api.js";
import { Sparkles, ArrowRight, Shield, Award, Waves, Coffee } from "lucide-react";

export default function HomePage({ onOpenEnquiry }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHotels() {
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

  const handleSearch = (searchParams) => {
    const query = new URLSearchParams();
    if (searchParams.neighborhood) query.set("neighborhood", searchParams.neighborhood);
    if (searchParams.checkInDate) query.set("checkInDate", searchParams.checkInDate);
    if (searchParams.checkOutDate) query.set("checkOutDate", searchParams.checkOutDate);
    if (searchParams.guests) query.set("guests", searchParams.guests);
    if (searchParams.canonicalType) query.set("canonicalType", searchParams.canonicalType);

    navigate(`/search?${query.toString()}`);
  };

  const featuredHotels = hotels.slice(0, 6);

  return (
    <div className="space-y-16">
      {/* Hero Search Section */}
      <HeroSearch onSearch={handleSearch} />

      {/* Featured Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Iconic Residences
            </div>
            <h2 className="text-3xl font-serif font-bold text-white">
              Featured Mumbai Boutique Stays
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Handcrafted properties celebrating colonial architecture, coastal art deco, and private sea-facing retreats.
            </p>
          </div>

          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition group"
          >
            <span>View All 14 Properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      {/* The Aura Stays Difference */}
      <section className="relative py-16 bg-gradient-to-b from-[#080d1a] via-[#0b1329] to-[#080d1a] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Boutique Philosophy
            </span>
            <h2 className="text-3xl font-serif font-bold text-white mt-2">
              Hospitality Rooted in Mumbai's Soul
            </h2>
            <p className="text-xs text-slate-300 mt-2">
              Unlike cookie-cutter corporate chains, each Aura Stays property is individually restored to preserve the neighborhood's living heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/30 transition text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Prime Ocean & Heritage Locations</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Unrivaled positions from Gateway of India in Colaba and Queen's Necklace in Marine Drive to the quiet celebrity bylanes of Pali Hill and beachfront Juhu.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/30 transition text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Multi-Currency & Transparent Rates</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Seamless real-time rate toggle between INR (₹) and USD ($) with zero hidden resort fees, instant booking confirmations, and verified guest privacy.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/30 transition text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">24/7 Front-Desk Duty Manager</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Dedicated concierges ready to coordinate bespoke South Mumbai architecture tours, intimate courtyard weddings, or midnight coastal chauffeur drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Concierge & Events Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-amber-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Intimate Gatherings & Executive Stays
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Planning a Courtyard Wedding or Corporate Retreat?
            </h3>
            <p className="text-xs text-slate-300">
              Our hospitality team accommodates suite buyouts, private dining terraces, and bespoke production shoots across our 14 properties.
            </p>
          </div>

          <button
            onClick={onOpenEnquiry}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shrink-0 shadow-lg shadow-amber-500/20"
          >
            Submit Concierge Inquiry
          </button>
        </div>
      </section>
    </div>
  );
}
