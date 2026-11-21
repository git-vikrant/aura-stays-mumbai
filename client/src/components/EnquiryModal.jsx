import React, { useState } from "react";
import api from "../utils/api.js";
import { X, CheckCircle2, Upload, AlertCircle, Sparkles } from "lucide-react";

export default function EnquiryModal({ hotels = [], onClose }) {
  const [hotelId, setHotelId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      if (hotelId) formData.append("hotelId", hotelId);
      formData.append("name", name);
      formData.append("email", email);
      if (phone) formData.append("phone", phone);
      formData.append("category", category);
      formData.append("subject", subject);
      formData.append("message", message);
      if (file) formData.append("attachment", file);

      await api.post("/enquiries", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl gold-border-glow my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">Enquiry Received</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              Thank you, <strong>{name}</strong>. Our Head Concierge and Events team will review your inquiry and connect within 4 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Bespoke Hospitality Concierge
              </span>
              <h3 className="text-2xl font-serif font-bold text-white">Guest & Event Enquiry</h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct channel for intimate weddings, corporate retreats, and bespoke stays.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Property</label>
                  <select
                    value={hotelId}
                    onChange={(e) => setHotelId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">General (All Mumbai Properties)</option>
                    {hotels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.neighborhood})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enquiry Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="GENERAL">General Concierge</option>
                    <option value="BOOKING_INQUIRY">Suite Block Booking</option>
                    <option value="EVENT_WEDDING">Heritage Wedding / Reception</option>
                    <option value="CORPORATE">Corporate Retreat & Boardroom</option>
                    <option value="FEEDBACK">Guest Feedback</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sunita Godrej"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sunita@example.com"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Courtyard Dinner for 60 Guests"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message Details</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Share your planned dates, expected guests, audio/visual requirements, and catering preferences..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* File Attachment Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Optional File / Floor Plan Attachment (PNG, JPG, PDF)
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-amber-500/60 cursor-pointer text-xs text-slate-400 transition">
                  <Upload className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{file ? file.name : "Choose document or image (Max 5MB)"}</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-600/30"
              >
                {loading ? "Submitting Inquiry..." : "Submit to Concierge"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
