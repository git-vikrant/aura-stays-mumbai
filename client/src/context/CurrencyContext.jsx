import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("aura_currency") || "INR";
  });

  const exchangeRate = 84; // 1 USD = 84 INR

  useEffect(() => {
    localStorage.setItem("aura_currency", currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "INR" ? "USD" : "INR"));
  };

  const formatPrice = (priceINR, priceUSD) => {
    if (currency === "USD") {
      const val = priceUSD !== undefined ? priceUSD : Math.round((priceINR / exchangeRate) * 100) / 100;
      return `$${Number(val).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    } else {
      const val = priceINR !== undefined ? priceINR : Math.round(priceUSD * exchangeRate);
      return `₹${Number(val).toLocaleString("en-IN")}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, formatPrice, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
