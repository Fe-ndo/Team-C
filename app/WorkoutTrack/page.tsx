"use client";
import { useState } from "react";
import { NavBar } from "../components/nav";
import "./workoutTrackr.css";

export default function WorkoutTrack() {
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");

  // List of muscle groups for the dropdown
  const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <NavBar />
      <div className="workout-form-container">
        <h1 className="workout-form-heading">Workout Tracker</h1>

        <form className="workout-form-content">
          {/* Exercise Name Input */}
          <div className="mb-4">
            <label className="workout-label" htmlFor="exercise">
              Specific Exercise
            </label>
            <input
              type="text"
              id="exercise"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="workout-input-field"
              placeholder="Enter exercise name"
            />
          </div>

          {/* Reps Input */}
          <div className="mb-4">
            <label className="workout-label" htmlFor="reps">
              Amount of Reps
            </label>
            <input
              type="number"
              id="reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="workout-input-field"
              placeholder="Enter number of reps"
            />
          </div>

          {/* Weight Input */}
          <div className="mb-4">
            <label className="workout-label" htmlFor="weight">
              Weight Lifting (lbs)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="workout-input-field"
              placeholder="Enter weight in pounds"
            />
          </div>

          {/* Muscle Group Dropdown */}
          <div className="mb-6">
            <label className="workout-label" htmlFor="muscleGroup">
              Muscle Group
            </label>
            <select
              id="muscleGroup"
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
              className="workout-select-field"
            >
              <option value="" disabled>
                Select a muscle group
              </option>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="workout-button">
            Save Workout for Today
          </button>
        </form>
      </div>
    </div>
  );
}
