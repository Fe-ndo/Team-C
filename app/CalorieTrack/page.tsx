// page.tsx
"use client";
import React, { useState } from "react";
import CalorieTracker from "../components/CalorieTracker";
import Sidebar2 from "../components/sidebar2";
import { NavBar } from "../components/nav";
//import "./calorietracker.css";

const Page: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="app-container">
      <NavBar />
      <div className="calorie-tracker-container">
        <Sidebar2 onDateChange={setSelectedDate} />
        <CalorieTracker selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default Page;
