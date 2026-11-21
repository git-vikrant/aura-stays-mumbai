import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Shield, User, KeyRound, Sparkles } from "lucide-react";

export default function RoleBanner() {
  const { user, role, quickSwitchRole, isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border-b border-amber-500/30 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-amber-300/90 font-medium tracking-wide uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo RBAC Switcher:
          </span>
          <span className="text-slate-300">
            Current:{" "}
            <strong className="text-white px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 uppercase">
              {role}
            </strong>{" "}
            {isAuthenticated ? `(${user?.name})` : "(Unauthenticated)"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 hidden sm:inline">Switch Persona:</span>
          <button
            onClick={() => quickSwitchRole("GUEST")}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
              role === "GUEST" && isAuthenticated
                ? "bg-amber-500 text-slate-950 font-semibold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <User className="w-3 h-3" /> Guest
          </button>
          <button
            onClick={() => quickSwitchRole("STAFF")}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
              role === "STAFF"
                ? "bg-amber-500 text-slate-950 font-semibold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <KeyRound className="w-3 h-3" /> Front-Desk Staff
          </button>
          <button
            onClick={() => quickSwitchRole("ADMIN")}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
              role === "ADMIN"
                ? "bg-amber-500 text-slate-950 font-semibold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Shield className="w-3 h-3" /> Admin / GM
          </button>
        </div>
      </div>
    </div>
  );
}
