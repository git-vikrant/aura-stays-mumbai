import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { CalendarCheck, MapPin, CheckCircle2, Clock, XCircle, AlertCircle, Sparkles } from "lucide-react";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const { currency, formatPrice } = useCurrency();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/my-bookings");
      setBookings(res.data.data);
    } catch (err) {
      setError("Failed to load your reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await api.patch(`/bookings/${bookingId}/status`, { bookingStatus: "CANCELLED" });
      setMessage("Reservation cancelled successfully. A confirmation has been emailed.");
      fetchBookings();
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to cancel reservation");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Guest Portfolio</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white">My Reservations & Stays</h1>
        <p className="text-xs text-slate-400 mt-1">
          Stay histories and active bookings for {user?.name} ({user?.email})
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No active reservations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no bookings registered under this account. Explore our 14 Mumbai boutique hotels to plan your next stay.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-amber-400 text-xs">
                    {b.bookingReference}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      b.bookingStatus === "CONFIRMED"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : b.bookingStatus === "CHECKED_IN"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : b.bookingStatus === "CHECKED_OUT"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                </div>
                <h4 className="text-base font-serif font-bold text-white">
                  {b.hotel?.name} • Room {b.room?.roomNumber} ({b.room?.name})
                </h4>
                <div className="text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {b.hotel?.neighborhood}, Mumbai
                </div>
                <div className="text-xs text-slate-400 pt-1">
                  Stay: {new Date(b.checkInDate).toLocaleDateString()} to {new Date(b.checkOutDate).toLocaleDateString()} ({b.nights} nights, {b.guestCount} guests)
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Amount</span>
                  <span className="text-base font-bold text-white font-serif">
                    {b.currency === "USD" ? `$${b.totalAmount}` : `₹${b.totalAmount.toLocaleString("en-IN")}`}
                  </span>
                </div>

                {b.bookingStatus === "CONFIRMED" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
