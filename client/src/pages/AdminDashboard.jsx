import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import {
  TrendingUp,
  Percent,
  DollarSign,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  LogOut,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const { role, user } = useAuth();
  const { currency, formatPrice } = useCurrency();

  const [metrics, setMetrics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings"); // bookings | enquiries | properties
  const [bookingFilter, setBookingFilter] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [metricsRes, bookingsRes, enquiriesRes] = await Promise.all([
        api.get(`/metrics/dashboard?currency=${currency}`),
        api.get("/bookings/all"),
        api.get("/enquiries")
      ]);

      setMetrics(metricsRes.data.data);
      setBookings(bookingsRes.data.data);
      setEnquiries(enquiriesRes.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currency]);

  // Front-Desk Action: Update Booking Status
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { bookingStatus: newStatus });
      setActionSuccess(`Booking updated to ${newStatus}`);
      fetchData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to update status");
    }
  };

  // Front-Desk Action: Update Enquiry Status
  const handleUpdateEnquiry = async (enquiryId, newStatus) => {
    try {
      await api.patch(`/enquiries/${enquiryId}`, {
        status: newStatus,
        staffNotes: `Processed by ${user?.name || "Staff"} on ${new Date().toLocaleDateString()}`
      });
      setActionSuccess(`Enquiry marked as ${newStatus}`);
      fetchData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to update enquiry");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter ? b.bookingStatus === bookingFilter : true;
    const matchesSearch = bookingSearch
      ? b.bookingReference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.hotel?.name.toLowerCase().includes(bookingSearch.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Hospitality Operations & Executive Intelligence</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">
            Front-Desk & Revenue Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time portfolio metrics across 14 Mumbai boutique hotels for GM Tanya Singhania & Staff.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards: Occupancy, ADR, RevPAR, Revenue */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Occupancy Rate */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Occupancy Rate</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-serif font-bold text-white">
              {metrics.summary.occupancyRate}%
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{metrics.summary.totalRoomNightsSold} nights sold</span>
              <span className="text-emerald-400 font-medium">Optimal Band</span>
            </div>
            <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full"
                style={{ width: `${Math.min(100, metrics.summary.occupancyRate)}%` }}
              />
            </div>
          </div>

          {/* Card 2: ADR */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">ADR (Avg Daily Rate)</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-serif font-bold text-white">
              {currency === "USD" ? `$${metrics.summary.adr}` : `₹${metrics.summary.adr.toLocaleString("en-IN")}`}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Per room night booked across properties
            </div>
          </div>

          {/* Card 3: RevPAR */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">RevPAR</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-serif font-bold text-amber-400">
              {currency === "USD" ? `$${metrics.summary.revPAR}` : `₹${metrics.summary.revPAR.toLocaleString("en-IN")}`}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Revenue per available room night
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Gross Revenue</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-serif font-bold text-white">
              {currency === "USD" ? `$${metrics.summary.totalRevenue.toLocaleString()}` : `₹${metrics.summary.totalRevenue.toLocaleString("en-IN")}`}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              {metrics.summary.totalBookings} total reservations logged
            </div>
          </div>
        </div>
      )}

      {/* Operational Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === "bookings"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Active Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("enquiries")}
          className={`pb-3 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === "enquiries"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Concierge Enquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-3 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === "properties"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Property Performance Ranking</span>
        </button>
      </div>

      {/* Tab 1: Bookings Management */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search reference, guest, property..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Filter by Status */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CHECKED_IN">CHECKED_IN</option>
                <option value="CHECKED_OUT">CHECKED_OUT</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Property & Room</th>
                  <th className="py-3 px-4">Stay Dates</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Front-Desk Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{b.guestName}</div>
                      <div className="text-[10px] text-slate-400">{b.guestEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{b.hotel?.name}</div>
                      <div className="text-[10px] text-slate-400">
                        Room {b.room?.roomNumber} ({b.room?.name})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{new Date(b.checkInDate).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {b.nights} night(s) to {new Date(b.checkOutDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {b.currency === "USD" ? `$${b.totalAmount}` : `₹${b.totalAmount.toLocaleString("en-IN")}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                          b.bookingStatus === "CHECKED_IN"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : b.bookingStatus === "CONFIRMED"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : b.bookingStatus === "CHECKED_OUT"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {b.bookingStatus === "CONFIRMED" && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, "CHECKED_IN")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 text-[11px] font-semibold transition"
                        >
                          Check In
                        </button>
                      )}
                      {b.bookingStatus === "CHECKED_IN" && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, "CHECKED_OUT")}
                          className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500 hover:text-slate-950 text-blue-400 text-[11px] font-semibold transition"
                        >
                          Check Out
                        </button>
                      )}
                      {b.bookingStatus !== "CANCELLED" && b.bookingStatus !== "CHECKED_OUT" && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                          className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 text-[11px] transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Enquiries Management */}
      {activeTab === "enquiries" && (
        <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Subject & Message</th>
                <th className="py-3 px-4">Target Hotel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Triage Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium text-[10px]">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{e.name}</div>
                    <div className="text-[10px] text-slate-400">{e.email}</div>
                    {e.phone && <div className="text-[10px] text-slate-500">{e.phone}</div>}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-white truncate">{e.subject}</div>
                    <div className="text-slate-400 line-clamp-2 text-[11px]">{e.message}</div>
                    {e.attachmentUrl && (
                      <a
                        href={e.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-amber-400 hover:underline inline-block mt-1"
                      >
                        📎 View Uploaded Attachment
                      </a>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {e.hotel?.name || "General Portfolio"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        e.status === "NEW"
                          ? "bg-amber-500/20 text-amber-300"
                          : e.status === "IN_PROGRESS"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    {e.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleUpdateEnquiry(e.id, "RESOLVED")}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 text-[11px] font-semibold transition"
                      >
                        Resolve
                      </button>
                    )}
                    {e.status === "NEW" && (
                      <button
                        onClick={() => handleUpdateEnquiry(e.id, "IN_PROGRESS")}
                        className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500 hover:text-slate-950 text-blue-400 text-[11px] font-semibold transition"
                      >
                        In Progress
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Property Ranking */}
      {activeTab === "properties" && metrics?.propertyRanking && (
        <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Hotel Property</th>
                <th className="py-3 px-4">Neighborhood</th>
                <th className="py-3 px-4">Occupancy %</th>
                <th className="py-3 px-4">ADR</th>
                <th className="py-3 px-4">RevPAR</th>
                <th className="py-3 px-4 text-right">30-Day Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {metrics.propertyRanking.map((prop, idx) => (
                <tr key={prop.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    #{idx + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">{prop.name}</td>
                  <td className="py-3 px-4 text-slate-400">{prop.neighborhood}</td>
                  <td className="py-3 px-4 font-medium text-emerald-400">
                    {prop.occupancyRate}%
                  </td>
                  <td className="py-3 px-4">
                    {currency === "USD" ? `$${prop.adr}` : `₹${prop.adr.toLocaleString("en-IN")}`}
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-400">
                    {currency === "USD" ? `$${prop.revPAR}` : `₹${prop.revPAR.toLocaleString("en-IN")}`}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white">
                    {currency === "USD" ? `$${prop.totalRevenue.toLocaleString()}` : `₹${prop.totalRevenue.toLocaleString("en-IN")}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
