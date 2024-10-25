"use client"; // Ensure this is at the top for Client Component

import Link from "next/link";
import { useState } from "react"; // Import useState for managing calendar state
import Calendar from "react-calendar"; // Import the Calendar component
import "react-calendar/dist/Calendar.css"; // Import Calendar CSS
import "./calender.css";

export function Sidebar() {
  // State for managing selected date
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Workout Tracker</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/workouts" className="hover:text-gray-300">
              Workouts
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/progress" className="hover:text-gray-300">
              Progress
            </Link>
          </li>
          <li>
            <Link href="/settings" className="hover:text-gray-300">
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {/* Calendar Component */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-2">Select a Date</h3>
        <Calendar
          onChange={setDate}
          value={date}
          className="border rounded-lg shadow-md" // Optional: style the calendar
        />
        <p className="mt-2 text-sm text-black">
          Selected Date: {date.toDateString()}
        </p>
      </div>
    </div>
  );
}
