import React from "react";
import { Link } from "react-router-dom";
import { Compass, Mail, Phone, MapPin, Sparkles, ShieldCheck } from "lucide-react";

export default function Footer({ onOpenEnquiry }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center">
                <span className="text-slate-950 font-serif font-black text-sm">A</span>
              </div>
              <span className="text-lg font-serif font-bold text-white tracking-widest">
                AURA STAYS
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              A curated collection of 14 bespoke boutique hotels across Mumbai's historic quarters and glittering coastlines. Built with production craftsmanship.
            </p>
            <div className="flex items-center space-x-2 text-amber-400/90 text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Luxury Hospitality • Mumbai Group</span>
            </div>
          </div>

          {/* 14 Iconic Neighborhoods */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> 14 Properties Portfolio
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>Colaba • Marine Drive • Kala Ghoda</li>
              <li>Fort • Bandra West • Pali Hill</li>
              <li>Juhu Beach • Worli Seaface • Malabar Hill</li>
              <li>Lower Parel • BKC Financial Center</li>
              <li>Powai Lake • Versova • Dadar Heritage</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/hotels" className="hover:text-amber-400 transition">
                  Explore 14 Boutique Hotels
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-amber-400 transition">
                  Check Real-Time Availability
                </Link>
              </li>
              <li>
                <button onClick={onOpenEnquiry} className="hover:text-amber-400 transition text-left">
                  Corporate & Wedding Inquiries
                </button>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-400 transition">
                  Staff & RevPAR Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge Desk */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Head Concierge
            </h4>
            <p className="text-[11px] text-slate-400 mb-2">
              Central Reservations & Guest Relations:
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 22 2285 4100</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>concierge@aurastays.com</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-2">
                24/7 Front-Desk Duty Desk Active
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>© 2026 Aura Stays Mumbai Hospitality Pvt. Ltd. All rights reserved.</div>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-300 cursor-pointer">Guest Terms</span>
            <span className="hover:text-slate-300 cursor-pointer">Data Hygiene Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
