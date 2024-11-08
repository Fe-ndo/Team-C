"use client";
import React, { useState, useEffect, createContext, useContext } from "react";

const CurrencyContext = createContext<{
  currency: balance | number;
  setCurrency: (currency: number) => void;
  updateBalance: (newBalance: { balance: number }) => void;
}>({
  currency: 0,
  setCurrency: () => {},
  updateBalance: () => {},
});

interface balance {
  balance: number;
}

export const Currency = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<{ balance: number }>({ balance: 0 });

  const getCurrBal = async () => {
    try {
      const response = await fetch("/api/balance");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setCurrency(data.currency);
    } catch (error) {}
  };

  const updateBalance = async (newBalance: balance) => {
    try {
      const response = await fetch("/api/balance/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ balance: newBalance }),
      });
      const data = await response.json();
      setCurrency(data.balance);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCurrBal();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, updateBalance }}>
      {children}
    </CurrencyContext.Provider>
  );
};
export const useCurrency = () => {
  return useContext(CurrencyContext);
};

export const Balance = () => {
  const { currency } = useCurrency();
  console.log(currency);
  const displayBalance =
    currency && typeof currency === "object" && "balance" in currency
      ? currency.balance
      : 0;
  return (
    <div className="text-xs bg-slate-300 bg-opacity- rounded-md p-2">
      <h4>
        Balance: {typeof currency === "number" ? currency : displayBalance}
      </h4>
    </div>
  );
};
