"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "./components/nav";
import React, { useState } from "react";
import { useCurrency } from "./components/currency";

export default function Landing() {
  const { currency, updateBalance } = useCurrency();
  const [unlocked, setUnlocked] = useState<{ [key: string]: boolean }>({
    feature1: false,
    feature2: false,
    feature3: false,
    feature4: false,
  });

  const handleUnlock = (featureName: string, cost: number) => {
    const currentBalance =
      typeof currency === "number" ? currency : currency?.balance ?? 0;
    console.log("Current balance:", currentBalance);
    if (currentBalance >= cost) {
      const newBalance = currentBalance - cost;
      updateBalance({ balance: newBalance });
      setUnlocked((prevUnlocked) => ({
        ...prevUnlocked,
        [featureName]: true,
      }));
    } else {
      alert("Insufficient balance to unlock this feature!");
    }
    console.log("Current balance:", currentBalance);
  };

  return (
    <div className="">
      <NavBar></NavBar>
      <section id="heroImage" className="">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 mx-auto px-6 py-32 text-center">
          <h1 className="text-5xl font-extrabold mb-6">
            Start tracking your Workouts!
          </h1>
          <p></p>
          <Link href={"/Login"}>
            <button className="p-4 font-bold bg-indigo-500 rounded-lg bg-opacity-90">
              Sign up!
            </button>
          </Link>
        </div>
      </section>
      <section>
        <div className="flex pt-16 justify-between">
          {listFeatures.map((feature, index) => {
            return (
              <FeatureCard
                key={index}
                featureTitle={feature.featureTitle}
                featureDesc={feature.featureDesc}
                cost={feature.cost}
                onUnlock={() =>
                  handleUnlock(`feature${index + 1}`, feature.cost)
                }
                unlocked={unlocked[`feature${index + 1}`]}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

interface CardProps {
  featureTitle: string;
  featureDesc: string;
  cost: number;
  onUnlock: () => void;
  unlocked: boolean;
}

const listFeatures = [
  {
    featureTitle: "Workout Tracker",
    featureDesc: "A comprehensive workout tracker that allows you to...",
    cost: 300,
  },
  {
    featureTitle: "Calorie Tracker",
    featureDesc: "A tool to help you keep track of your calorie intake!",
    cost: 300,
  },
  {
    featureTitle: "Workout Search",
    featureDesc:
      "We host a comprehensive database of workouts with all the info you need",
    cost: 300,
  },
  {
    featureTitle: "Recommended Workouts",
    featureDesc: "We offer an AI personalized workout service",
    cost: 300,
  },
];
const FeatureCard: React.FC<CardProps> = ({
  featureTitle,
  featureDesc,
  cost,
  onUnlock,
  unlocked,
}) => {
  return (
    <div className="bg-opacity-90 relative z-99 p-8 mx-4 max-w-sm rounded-lg bg-gray-800 border-gray-100 hover:bg-gray-700">
      <h1 className="mb-2 text-2xl font-bold text-white">{featureTitle}</h1>
      <p className="text-sm">{featureDesc}</p>
      <p>Cost: {cost} coins</p>
      {unlocked ? (
        <p className="text-green-500">Unlocked!</p>
      ) : (
        <button
          onClick={onUnlock}
          className="mt-4 bg-indigo-500 text-white p-2 rounded-lg"
        >
          Unlock Feature
        </button>
      )}
    </div>
  );
};
