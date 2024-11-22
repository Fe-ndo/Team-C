"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { v4 as uuidv4 } from "uuid";
import CalorieReferenceTable from "./CalorieReferenceTable";
import app from "./configs/config";
import "./caloriestracker.css";

const API_BASE_URL = "http://localhost:5000"; // Flask API base URL

//Define interface fo a single food entry
interface FoodEntry {
  id?: string; // Add `id` for uniquely identifying entries
  food: string;
  amount: number;
  unit: string;
  calories: number;
}

//Define interface for chart data point
interface ChartDataPoint {
  date: string;
  totalCalories: number;
}

//Props interface for the component
interface CalorieTrackerProps {
  selectedDate: Date;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ selectedDate }) => {
  const [userId, setUserId] = useState<string | null>(null); // State to store userId
  const [food, setFood] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<string>("g");
  const [calories, setCalories] = useState<number>(0);
  const [dailyEntries, setDailyEntries] = useState<FoodEntry[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [view, setView] = useState<"weekly" | "monthly">("weekly"); //State to manage  the selected view: 'weekly' or 'monthly'
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]); //State to store chart data points

  // Format selected date for Firestore document ID
  const formattedDate = selectedDate.toISOString().split("T")[0];

  // Fetch userId from Firebase Authentication
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Get the user's UID from Firebase
      } else {
        setUserId(null); // No user is logged in
        console.error("No user is logged in.");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Fetch daily data from Flask API
  useEffect(() => {
    if (!userId) return; // Do nothing if userId is not available

    const fetchDailyData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/calorie_entries/${userId}/${formattedDate}`
        );
        const { entries, totalCalories } = response.data;
        setDailyEntries(entries || []);
        setTotalCalories(totalCalories || 0);
      } catch (error) {
        console.error("Error fetching daily data:", error);
      }
    };

    fetchDailyData();
  }, [formattedDate, userId]);

  // Function to delete a calorie entry
  const deleteCalorieEntry = async (entryId: string | undefined) => {
    if (!entryId || !userId) return;

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/calorie_entries/${userId}/${formattedDate}/${entryId}`
      );

      if (response.data.success) {
        // Remove the deleted entry from local state
        const updatedEntries = dailyEntries.filter(
          (entry) => entry.id !== entryId
        );
        setDailyEntries(updatedEntries);

        // Update the total calories
        const deletedEntry = dailyEntries.find((entry) => entry.id === entryId);
        if (deletedEntry) {
          setTotalCalories(totalCalories - deletedEntry.calories);
        }

        console.log("Entry deleted successfully");
      } else {
        console.error("Error deleting entry:", response.data.error);
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  //Fetch chart data for weekly/monthly view
  const fetchChartData = async () => {
    if (!userId) return; // Do nothing if userId is not available

    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);

    if (view === "weekly") {
      startDate.setDate(selectedDate.getDate() - selectedDate.getDay()); //Start of the week
      endDate.setDate(startDate.getDate() + 6); //End of the week
    } else if (view === "monthly") {
      startDate.setDate(1); //Start of the month
      endDate.setMonth(selectedDate.getMonth() + 1, 0); //End of the month
    }

    const dates = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(d.toISOString().split("T")[0]); // Push each date in YYYY-MM-DD format
    }

    const data = await Promise.all(
      dates.map(async (date) => {
        const response = await axios.get(
          `${API_BASE_URL}/calorie_entries/${userId}/${date}`
        );

        const { totalCalories } = response.data;
        return { date, totalCalories: totalCalories || 0 };
      })
    );
    setChartData(data);
  };

  useEffect(() => {
    fetchChartData();
  }, [view, selectedDate]);

  //Generate chart data for Chart.js
  const generateChartData = () => ({
    labels: chartData.map((d) => d.date), // X-axis labels (dates)
    datasets: [
      {
        label: `Calorie Intake(${view})`, //Dataset label
        data: chartData.map((d) => d.totalCalories), // Y-axis values (total calories)
        borderColor: "rgba(75,192,192,1)", // Line color
        backgroundColor: "rgba(75,192,192,0.3)", // Background fill under the line
        fill: true, //Enable filling under the line
      },
    ],
    options: {
      plugins: {
        legend: {
          labels: {
            color: "white", // Legend text color
          },
        },
        tooltip: {
          bodyColor: "white", // Tooltip text color
          titleColor: "white", // Tooltip title color
        },
      },
      scales: {
        x: {
          ticks: {
            color: "white", // X-axis label color
          },
        },
        y: {
          ticks: {
            color: "white", // Y-axis label color
          },
        },
      },
      title: {
        display: true,
        text: "Calorie Intake Over Time",
        color: "white", // Chart title color
      },
    },
  });

  // Function to handle form submission and add a new food entry
  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!food || calories <= 0) return;

    const newEntry: FoodEntry = { id: uuidv4(), food, amount, unit, calories };
    const updatedTotalCalories = totalCalories + calories;

    try {
      await axios.post(`${API_BASE_URL}/calorie_entries/${userId}`, {
        date: formattedDate,
        entry: newEntry,
        totalCalories: updatedTotalCalories,
      });

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
              <option value="cup">cup</option>
              <option value="oz">oz</option>
              <option value="large">large</option>
              <option value="medium">medium</option>
              <option value="small">small</option>
              <option value="serve">serve</option>
              <option value="slice">slice</option>
              <option value="tablespoon">tablespoon</option>
              <option value="ml">ml</option>
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
                    <td>
                      <button
                        onClick={() => deleteCalorieEntry(entry.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
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

        {/* Chart View Selector */}
        <div className="button-container">
          <button
            className="view-button"
            onClick={() => setView("weekly")}
            disabled={view === "weekly"}
          >
            Weekly
          </button>
          <button
            className="view-button"
            onClick={() => setView("monthly")}
            disabled={view === "monthly"}
          >
            Monthly
          </button>
        </div>

        {/* Chart */}
        <div>
          <h2>{view.charAt(0).toUpperCase() + view.slice(1)} Calorie Intake</h2>
          {chartData.length > 0 && (
            <Line
              data={generateChartData()}
              options={generateChartData().options}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
