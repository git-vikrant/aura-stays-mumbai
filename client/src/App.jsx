import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import RoleBanner from "./components/RoleBanner.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AuthModal from "./components/AuthModal.jsx";
import EnquiryModal from "./components/EnquiryModal.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import HotelsPage from "./pages/HotelsPage.jsx";
import HotelDetailPage from "./pages/HotelDetailPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import api from "./utils/api.js";

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [hotelsList, setHotelsList] = useState([]);

  useEffect(() => {
    async function loadHotels() {
      try {
        const res = await api.get("/hotels");
        setHotelsList(res.data.data);
      } catch (err) {
        console.error("Failed to load hotels list", err);
      }
    }
    loadHotels();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Interactive RBAC Switcher Banner */}
      <RoleBanner />

      {/* Global Navbar */}
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenEnquiry={() => setEnquiryModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenEnquiry={() => setEnquiryModalOpen(true)} />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route
            path="/hotels/:slug"
            element={<HotelDetailPage onOpenEnquiry={() => setEnquiryModalOpen(true)} />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer onOpenEnquiry={() => setEnquiryModalOpen(true)} />

      {/* Modals */}
      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
      {enquiryModalOpen && (
        <EnquiryModal
          hotels={hotelsList}
          onClose={() => setEnquiryModalOpen(false)}
        />
      )}
    </div>
  );
}
