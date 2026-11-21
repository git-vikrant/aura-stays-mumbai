import React from "react";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { BedDouble, Maximize2, Users, Check, Sparkles } from "lucide-react";

export default function RoomCard({ room, hotel, onBook, nights = 1 }) {
  const { formatPrice, currency } = useCurrency();
  const coverImage = room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

  const getCanonicalLabel = (type) => {
    switch (type) {
      case "PRESIDENTIAL_VILLA": return "Presidential Villa";
      case "HERITAGE_SUITE": return "Heritage Suite";
      case "EXECUTIVE_SUITE": return "Executive Suite";
      case "STUDIO_QUEEN": return "Studio Queen";
      default: return "Deluxe Room";
    }
  };

  const pricePerNight = currency === "USD" ? room.basePriceUSD : room.basePriceINR;
  const totalPrice = pricePerNight * nights;

  return (
    <div className="rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition duration-300 overflow-hidden flex flex-col md:flex-row">
      {/* Room Photo */}
      <div className="md:w-2/5 relative h-52 md:h-auto overflow-hidden bg-slate-900">
        <img
          src={coverImage}
          alt={room.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 left-3 bg-amber-500/90 text-slate-950 font-bold px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider flex items-center gap-1 shadow">
          <Sparkles className="w-3 h-3" />
          {getCanonicalLabel(room.canonicalType)}
        </div>
        <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2 py-0.5 rounded text-[11px] text-slate-300 font-mono">
          Room {room.roomNumber}
        </div>
      </div>

      {/* Room Details & Pricing */}
      <div className="p-6 md:w-3/5 flex-1 flex flex-col justify-between">
        <div>
          {hotel && (
            <div className="text-xs text-amber-400 font-medium mb-1">
              {hotel.name} • {hotel.neighborhood}
            </div>
          )}
          <h4 className="text-xl font-serif font-bold text-white mb-2">{room.name}</h4>

          {/* Specs Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 py-2 border-y border-slate-800 my-3">
            <span className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-amber-400" />
              {room.bedConfiguration || "1 King Bed"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              Up to {room.capacity} Guests
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-amber-400" />
              {room.sizeSqFt || 450} sq ft
            </span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 mt-2">
            {room.amenities?.slice(0, 4).map((a, i) => (
              <span key={i} className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" /> {a}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown & Book CTA */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">
              Rate: <span className="text-white font-semibold">{formatPrice(room.basePriceINR, room.basePriceUSD)}</span> / night
            </div>
            {nights > 1 && (
              <div className="text-sm font-bold text-amber-400 font-serif">
                Total ({nights} nights): {currency === "USD" ? `$${totalPrice}` : `₹${totalPrice.toLocaleString("en-IN")}`}
              </div>
            )}
          </div>

          <button
            onClick={() => onBook(room)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
          >
            Reserve Suite
          </button>
        </div>
      </div>
    </div>
  );
}
