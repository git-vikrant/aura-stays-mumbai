import React from "react";
import { Link } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { Star, MapPin, Wifi, ShieldCheck, ArrowRight } from "lucide-react";

export default function HotelCard({ hotel }) {
  const { formatPrice } = useCurrency();
  const coverImage = hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group rounded-2xl glass-panel overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col h-full">
      {/* Property Cover Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-900">
        <img
          src={coverImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Neighborhood Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <MapPin className="w-3 h-3 text-amber-400" />
          {hotel.neighborhood}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <Star className="w-3 h-3 fill-slate-950" />
          {hotel.starRating?.toFixed(1) || "4.8"}
        </div>

        {/* Rooms Count Pill */}
        <div className="absolute bottom-3 left-3 text-[11px] text-slate-300 font-medium">
          {hotel.totalRooms || hotel.rooms?.length || 4} Bespoke Rooms
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
            {hotel.name}
          </h3>
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {hotel.description}
          </p>

          {/* Amenities Pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
              From
            </span>
            <div className="text-lg font-bold text-white flex items-baseline gap-1">
              <span className="text-amber-400 font-serif">
                {formatPrice(hotel.startingPriceINR, hotel.startingPriceUSD)}
              </span>
              <span className="text-xs font-normal text-slate-400">/ night</span>
            </div>
          </div>

          <Link
            to={`/hotels/${hotel.slug}`}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/40 hover:border-amber-500 text-xs font-semibold transition flex items-center gap-1"
          >
            <span>View Suites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
