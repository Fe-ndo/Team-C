"use client";
import React, { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getDoc,
  arrayUnion,
  getFirestore,
} from "firebase/firestore";
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

import app from "./configs/config";
import "./caloriestracker.css";

export const db = getFirestore(app);

//Define interface fo a single food entry
interface FoodEntry {
  food: string;
  amount: number;
  unit: string;
  calories: number;
}

//Define interface for chart data point
interface ChartDataPoint{
  date:string;
  totalCalories:number;
}

//Props interface for the component
interface CalorieTrackerProps {
  selectedDate: Date;
}

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);


const CalorieTracker: React.FC<CalorieTrackerProps> = ({ selectedDate }) => {
  const [food, setFood] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<string>("g");
  const [calories, setCalories] = useState<number>(0);
  const [dailyEntries, setDailyEntries] = useState<FoodEntry[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);

   
  const [view,setView] = useState<'weekly' | 'monthly'> ('weekly');//State to manage  the selected view: 'weekly' or 'monthly'
  const [chartData, setChartData]=useState<ChartDataPoint[]>([]);  //State to store chart data points


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


//Fetch chart data for weekly/monthly view
const fetchChartData = async()=>{
  const startDate = new Date(selectedDate);
  const endDate = new Date(selectedDate);

  if(view === 'weekly'){
    startDate.setDate(selectedDate.getDate()-selectedDate.getDay());//Start of the week
    endDate.setDate(startDate.getDate()+6);//End of the week
  }else if (view === 'monthly'){
    startDate.setDate(1);//Start of the month
    endDate.setMonth(selectedDate.getMonth()+1,0); //End of the month
  }

  const dates = [];
  for(let d = new Date(startDate); d <= endDate; d.setDate(d.getDate()+1)){
  dates.push(d.toISOString().split("T")[0]); // Push each date in YYYY-MM-DD format
  }

  const data:ChartDataPoint[] = await Promise.all(
    dates.map(async(date)=>{
      const docRef = doc(db, "calorie_entries", date);
      const docSnap = await getDoc(docRef);
      return{
        date,
        totalCalories: docSnap.exists()? docSnap.data().totalCalories||0:0,
      };
    })
  );
  setChartData(data);
}

useEffect(()=>{fetchChartData();},[view,selectedDate]);

//Generate chart data for Chart.js
const generateChartData = ()=>({
  labels:chartData.map((d)=>d.date),// X-axis labels (dates)
  datasets:[
    {
      label:`Calorie Intake(${view})`,//Dataset label
      data: chartData.map((d)=>d.totalCalories),// Y-axis values (total calories)
      borderColor:"rgba(75,192,192,1)",// Line color
      backgroundColor:"rgba(75,192,192,0.3)", // Background fill under the line
      fill:true, //Enable filling under the line
    }
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
})

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
          {chartData.length > 0 && <Line data={generateChartData()}  options={generateChartData().options} />}
        </div>
      </div>
    </div>

  );
};

export default CalorieTracker;
