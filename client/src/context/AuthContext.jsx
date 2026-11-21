import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("aura_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("aura_access_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const storedToken = localStorage.getItem("aura_access_token");
      if (storedToken) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data.data.user);
          localStorage.setItem("aura_user", JSON.stringify(res.data.data.user));
        } catch {
          logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { user: userData, accessToken, refreshToken } = res.data.data;

    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("aura_user", JSON.stringify(userData));
    localStorage.setItem("aura_access_token", accessToken);
    localStorage.setItem("aura_refresh_token", refreshToken);

    return userData;
  };

  const signup = async (data) => {
    const res = await api.post("/auth/signup", data);
    const { user: userData, accessToken, refreshToken } = res.data.data;

    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("aura_user", JSON.stringify(userData));
    localStorage.setItem("aura_access_token", accessToken);
    localStorage.setItem("aura_refresh_token", refreshToken);

    return userData;
  };

  const logout = async () => {
    try {
      if (token) await api.post("/auth/logout");
    } catch {
      // Proceed with local cleanup
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("aura_user");
    localStorage.removeItem("aura_access_token");
    localStorage.removeItem("aura_refresh_token");
  };

  // Quick Switcher for Evaluation / Demo
  const quickSwitchRole = async (targetRole) => {
    const credentials = {
      ADMIN: { email: "admin@aurastays.com", pass: "Admin@12345" },
      STAFF: { email: "staff@aurastays.com", pass: "Staff@12345" },
      GUEST: { email: "guest@aurastays.com", pass: "Guest@12345" }
    };

    const cred = credentials[targetRole];
    if (cred) {
      await login(cred.email, cred.pass);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || "GUEST",
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        quickSwitchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
