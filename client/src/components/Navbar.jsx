import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import {
  Compass,
  CalendarCheck,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  LogIn,
  Menu,
  X,
  Coins
} from "lucide-react";

export default function Navbar({ onOpenAuth, onOpenEnquiry }) {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { currency, toggleCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Portfolio (14 Hotels)", path: "/hotels", icon: Compass },
    { label: "Find Rooms", path: "/search", icon: CalendarCheck }
  ];

  if (isAuthenticated && role === "GUEST") {
    navLinks.push({ label: "My Bookings", path: "/my-bookings", icon: CalendarCheck });
  }

  if (role === "STAFF" || role === "ADMIN") {
    navLinks.push({ label: "Staff & Analytics Portal", path: "/admin", icon: LayoutDashboard });
  }

  return (
    <header className="sticky top-0 z-40 bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <span className="text-slate-950 font-serif font-black text-xl tracking-wider">A</span>
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-widest text-white block group-hover:text-amber-300 transition">
                AURA STAYS
              </span>
              <span className="text-[10px] tracking-[0.25em] text-amber-400/90 font-medium block uppercase">
                Boutique Mumbai Collection
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive
                      ? "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}

            <button
              onClick={onOpenEnquiry}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              Concierge Enquiry
            </button>
          </nav>

          {/* Right Controls: Currency Toggle & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Currency Switcher */}
            <button
              onClick={toggleCurrency}
              title="Click to toggle currency between INR (₹) and USD ($)"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-xs font-semibold text-amber-300 transition"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{currency === "INR" ? "₹ INR" : "$ USD"}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {currency === "INR" ? "Switch to $" : "Switch to ₹"}
              </span>
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">{user?.name}</div>
                  <div className="text-[10px] text-amber-400 uppercase font-mono">{role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs tracking-wider uppercase transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In / Join
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleCurrency}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400"
            >
              {currency}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenEnquiry();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
          >
            Concierge Enquiry
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-slate-800"
            >
              Sign Out ({user?.name})
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-center text-sm"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
}
