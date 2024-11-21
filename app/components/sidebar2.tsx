"use client";
import LINK from "next/link";
import React, { useState } from "react";
import { Calendar } from "react-calendar"; // Example calendar component, install if necessary
import "react-calendar/dist/Calendar.css";
import "./calender.css";

interface SidebarProps {
  onDateChange: (date: Date) => void;
}

const Sidebar2: React.FC<SidebarProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date); // Call the parent component's onDateChange
  };

  return (
    <div>
      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-2">Select a Date</h3>
        <Calendar
          onChange={handleDateChange} // Use handleDateChange instead of setSelectedDate
          value={selectedDate}
          className="border rounded-lg shadow-md"
        />
        <p className="mt-2 text-sm text-white">
          Selected Date: {selectedDate.toDateString()}
        </p>
      </div>
    </div>
  );
};

export default Sidebar2;
