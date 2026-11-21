import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api.js";
import RoomCard from "../components/RoomCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import ReviewSection from "../components/ReviewSection.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { Star, MapPin, Phone, Mail, Clock, ShieldCheck, ChevronLeft, Sparkles } from "lucide-react";

export default function HotelDetailPage({ onOpenEnquiry }) {
  const { slug } = useParams();
  const { formatPrice } = useCurrency();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState("");

  const fetchHotel = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/hotels/${slug}`);
      setHotel(res.data.data);
    } catch (err) {
      setError("Unable to find the requested hotel property");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading hotel sanctuary details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-white">Hotel Not Found</h2>
        <p className="text-slate-400 text-sm">{error || "Property does not exist"}</p>
        <Link to="/hotels" className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase">
          Back to All Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Link */}
      <Link
        to="/hotels"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to 14 Mumbai Hotels
      </Link>

      {/* Property Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {hotel.neighborhood}, Mumbai
            </span>
            <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{hotel.starRating?.toFixed(1) || "4.8"}</span>
              <span className="text-slate-400 font-normal">({hotel.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          <button
            onClick={onOpenEnquiry}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/40 hover:bg-amber-500/10 text-amber-400 text-xs font-semibold transition"
          >
            Inquire for Events / Block Bookings
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">{hotel.name}</h1>
        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-3xl leading-relaxed">
          {hotel.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" /> {hotel.address}, Mumbai {hotel.pincode}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Check-in: {hotel.checkInTime} | Check-out: {hotel.checkOutTime}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-400" /> {hotel.contactPhone}
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden">
        {hotel.images?.map((img, idx) => (
          <div key={idx} className="h-64 md:h-80 overflow-hidden bg-slate-900">
            <img
              src={img}
              alt={`${hotel.name} view ${idx + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />
          </div>
        ))}
      </div>

      {/* Signature Amenities */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800">
        <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Signature Property Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs text-slate-300">
          {hotel.amenities?.map((amenity, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center font-medium">
              {amenity}
            </div>
          ))}
        </div>
      </div>

      {/* Available Suites & Rooms */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white">Available Suites & Accommodations</h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your preferred suite configuration. Instant booking with direct confirmation.
          </p>
        </div>

        <div className="space-y-4">
          {hotel.rooms?.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              hotel={hotel}
              onBook={(r) => setSelectedRoom(r)}
            />
          ))}
        </div>
      </div>

      {/* Reviews & Guest Feedback */}
      <div className="pt-8 border-t border-slate-800">
        <ReviewSection
          hotelId={hotel.id}
          initialReviews={hotel.reviews || []}
          onReviewAdded={fetchHotel}
        />
      </div>

      {/* Booking Dialog */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          hotel={hotel}
          onClose={() => setSelectedRoom(null)}
          onSuccess={() => {
            fetchHotel();
          }}
        />
      )}
    </div>
  );
}
