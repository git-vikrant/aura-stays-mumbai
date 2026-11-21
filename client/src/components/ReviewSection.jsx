import React, { useState } from "react";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Star, MessageSquare, CheckCircle, Sparkles } from "lucide-react";

export default function ReviewSection({ hotelId, initialReviews = [], onReviewAdded }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/reviews", {
        hotelId,
        rating: Number(rating),
        title,
        comment,
        guestName: guestName || "Verified Guest"
      });

      setReviews([res.data.data, ...reviews]);
      setTitle("");
      setComment("");
      setSuccess(true);
      if (onReviewAdded) onReviewAdded(res.data.data);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Reviews List */}
      <div>
        <h4 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Verified Guest Experiences
        </h4>

        {reviews.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No reviews yet. Be the first to share your experience!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3 h-3" /> Verified Stay
                  </span>
                </div>
                <h5 className="text-sm font-semibold text-white">{rev.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>
                <div className="text-[11px] text-slate-400 font-medium">— {rev.guestName}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Form */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800">
        <h4 className="text-lg font-serif font-bold text-white mb-2">Leave a Guest Review</h4>
        <p className="text-xs text-slate-400 mb-4">
          Share your reflections on our hospitality, suites, and bespoke concierge services.
        </p>

        {success && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">
            ✨ Thank you! Your review has been added to our guest records.
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Star Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                <option value={3}>⭐⭐⭐ 3 Stars (Satisfactory)</option>
                <option value={2}>⭐⭐ 2 Stars (Needs Improvement)</option>
                <option value={1}>⭐ 1 Star (Disappointing)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Review Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset view from the balcony was sublime"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Thoughts</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Detail your stay, dining experience, bed comfort, and concierge support..."
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
          >
            {loading ? "Posting..." : "Publish Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
