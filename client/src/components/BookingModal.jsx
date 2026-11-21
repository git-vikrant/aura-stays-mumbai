import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import api from "../utils/api.js";
import { X, CheckCircle2, Calendar, User, Mail, Phone, Sparkles, AlertCircle } from "lucide-react";

export default function BookingModal({ room, hotel, searchDates, onClose, onSuccess }) {
  const { user } = useAuth();
  const { currency, formatPrice } = useCurrency();

  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");
  const [guestPhone, setGuestPhone] = useState(user?.phone || "+91 ");
  const [checkInDate, setCheckInDate] = useState(searchDates?.checkInDate || new Date().toISOString().split("T")[0]);
  const [checkOutDate, setCheckOutDate] = useState(
    searchDates?.checkOutDate || new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [guestCount, setGuestCount] = useState(searchDates?.guests || 1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Compute duration
  const inDate = new Date(checkInDate);
  const outDate = new Date(checkOutDate);
  const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
  const pricePerNight = currency === "USD" ? room.basePriceUSD : room.basePriceINR;
  const totalAmount = pricePerNight * nights;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError("Check-out date must strictly be after check-in date");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        hotelId: hotel?.id || room.hotelId,
        roomId: room.id,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate,
        checkOutDate,
        guestCount: Number(guestCount),
        currency,
        specialRequests
      });

      setConfirmedBooking(res.data.data);
      if (onSuccess) onSuccess(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to confirm reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl gold-border-glow my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">Reservation Confirmed</h3>
            <p className="text-sm text-slate-300">
              Your luxury boutique stay at <strong>{hotel?.name}</strong> has been secured.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Booking Reference:</span>
                <span className="text-amber-400 font-mono font-bold text-sm">
                  {confirmedBooking.bookingReference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Suite:</span>
                <span className="text-white font-medium">{room.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stay Duration:</span>
                <span className="text-white">
                  {new Date(checkInDate).toLocaleDateString()} to {new Date(checkOutDate).toLocaleDateString()} ({nights} nights)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Paid:</span>
                <span className="text-emerald-400 font-bold">
                  {currency === "USD" ? `$${confirmedBooking.totalAmount}` : `₹${confirmedBooking.totalAmount.toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              A confirmation email and WhatsApp pass have been dispatched to <strong>{guestEmail}</strong>.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition mt-4"
            >
              Done & Return
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Direct Reservation
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">{room.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {hotel?.name} • {hotel?.neighborhood}, Mumbai
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Check-In Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    min={checkInDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Guest Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98200 12345"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Guests</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {Array.from({ length: room.capacity || 2 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Currency</label>
                  <div className="text-xs font-semibold text-amber-400 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2">
                    {currency === "USD" ? "USD ($)" : "INR (₹)"}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Special Preferences (Optional)</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="High floor, sea facing view, quiet wing, anniversary setup..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Price Calculation Summary */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Nightly Rate:</span>
                  <span>{formatPrice(room.basePriceINR, room.basePriceUSD)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Nights:</span>
                  <span>{nights} night(s)</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-white text-sm">
                  <span>Total Amount (Taxes incl.):</span>
                  <span className="text-amber-400">
                    {currency === "USD" ? `$${totalAmount}` : `₹${totalAmount.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wider uppercase transition shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
              >
                {loading ? "Securing Reservation..." : "Confirm & Pay Reservation"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
