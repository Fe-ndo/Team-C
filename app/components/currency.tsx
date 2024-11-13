"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "./configs/config";
import { Auth, onAuthStateChanged } from "firebase/auth";

interface CurrencyContextType {
  currency: number;
  setCurrency: (currency: number) => void;
  updateBalance: (currency: number) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 0,
  setCurrency: () => {},
  updateBalance: () => {},
});

export const Currency = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<number>(0);
  const [user, setUser] = useState<any>(null);

  const getCurrBal = async () => {
    console.log("trying!");
    try {
      // const route = "/api/balance";
      // const params = new URLSearchParams({ uid: user.uid });
      // const url = `${route}`;
      // const response = await fetch(`/api/balance?uid=${user.uid}`);
      const response = await fetch(
        "/api/balance?uid=9Si3RsFOSCPqIom1Gjv3oykJ5j03"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setCurrency(data.currency);
      console.log(data.currency);
    } catch (error) {
      console.log("what happen");
    }
  };

  const updateBalance = async (newBalance: number) => {
    console.log("trying2!");
    try {
      const response = await fetch(`/api/balance/update?uid=${user.uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currency: newBalance }),
      });
      const data = await response.json();
      setCurrency(data.currency);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        getCurrBal(); // This will now be called when user is set
      } else {
        setUser(null);
      }
    });

    return () => unsub();
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
  const currency = useCurrency();
  const temp = currency.currency;
  return (
    <div className="text-xs bg-slate-300 bg-opacity- rounded-md p-2">
      <h4>Balance: {temp}</h4>
    </div>
  );
};

// export const handleSpend = (amount: number) => {
//   const currency = useCurrency();
//   const newCurrency = currency - amount;
//   setCurrency(newCurrency); // Update local state
//   updateBalance({ balance: newCurrency }); // Sync with backend
// };
