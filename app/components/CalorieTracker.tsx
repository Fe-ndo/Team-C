"use client";
import React, { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getDoc,
  arrayUnion,
  getFirestore,
} from "firebase/firestore";

import app from "./configs/config";
import "./caloriestracker.css";

export const db = getFirestore(app);

interface FoodEntry {
  food: string;
  amount: number;
  unit: string;
  calories: number;
}

interface CalorieTrackerProps {
  selectedDate: Date;
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ selectedDate }) => {
  const [food, setFood] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<string>("g");
  const [calories, setCalories] = useState<number>(0);
  const [dailyEntries, setDailyEntries] = useState<FoodEntry[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);

  // Format selected date for Firestore document ID
  const formattedDate = selectedDate.toISOString().split("T")[0];

  // Fetch data each time the selected date changes
  useEffect(() => {
    const fetchDailyData = async () => {
      console.log(`Fetching data for date: ${formattedDate}`);
      const docRef = doc(db, "calorie_entries", formattedDate);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Data retrieved:", data);
        setDailyEntries(data.entries || []);
        setTotalCalories(data.totalCalories || 0);
      } else {
        console.log("No data found for this date.");
        setDailyEntries([]); // Ensure it's an empty array if no data
        setTotalCalories(0);
      }
    };

    fetchDailyData();
  }, [formattedDate]);

  // Function to handle form submission and add a new food entry
  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!food || calories <= 0) return;

    const newEntry: FoodEntry = { food, amount, unit, calories };
    const updatedTotalCalories = totalCalories + calories;

    try {
      const docRef = doc(db, "calorie_entries", formattedDate);

      // Add new entry and update total calories in Firestore
      await setDoc(
        docRef,
        {
          date: formattedDate,
          entries: arrayUnion(newEntry),
          totalCalories: updatedTotalCalories,
        },
        { merge: true }
      );

      // Immediately update local state to include the new entry
      setDailyEntries((prevEntries) => [...prevEntries, newEntry]);
      setTotalCalories(updatedTotalCalories);

      // Reset form fields
      setFood("");
      setAmount(0);
      setCalories(0);
      setUnit("g");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div className="calorie-tracker-container">
      <div className="calorie-tracker-content">
        <h1>Calorie Tracking for {selectedDate.toDateString()}</h1>

        {/* Daily Calorie Summary */}
        <div>
          <p>Total Calories: {totalCalories} kcal</p>
        </div>

        {/* Form to add a food entry */}
        <form onSubmit={handleAddEntry}>
          <label>
            Food Name:
            <input
              type="text"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              required
            />
          </label>

          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              required
            />
          </label>

          <label>
            Unit:
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              id="unitSelected"
              required
            >
              <option value="g">g</option>
              <option value="serve">serve</option>
              <option value="cup">cup</option>
              <option value="oz">oz</option>
              <option value="tablespoon">tablespoon</option>
            </select>
          </label>

          <label>
            Calories (kcal):
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(+e.target.value)}
              required
            />
          </label>

          <button type="submit" id="submitbtn">
            Add Entry
          </button>
        </form>

        {/* Table to Display Entries */}
        <div className="entries-table">
          <h2>Food Entries for {selectedDate.toDateString()}</h2>
          <table>
            <thead>
              <tr>
                <th>Food Name</th>
                <th>Amount</th>
                <th>Unit</th>
                <th>Calories (kcal)</th>
              </tr>
            </thead>
            <tbody>
              {dailyEntries.length > 0 ? (
                dailyEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.food}</td>
                    <td>{entry.amount}</td>
                    <td>{entry.unit}</td>
                    <td>{entry.calories} kcal</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    No entries for this date yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
