"use client";

import { useSearchParams } from "next/navigation";
import ReactPlayer from "react-player";

interface WorkoutParams {
  params: {
    name: string;
  };
}

interface Workout {
  category: string;
  equipment: string;
  force: string;
  id: string;
  images: string[];
  instructions: string[];
  level: string;
  mechanic: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  video?: string;
}

export default function WorkoutPage({ params }: WorkoutParams) {
  const searchParams = useSearchParams();
  const workoutData = JSON.parse(searchParams.get("data") || "{}");

  if (!workoutData.name) {
    return (
      <p className="text-center text-slate-300">Workout data not found!</p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-slate-950 bg-opacity-90 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-slate-300">
          {workoutData.name}
        </h1>
        {/* Future: add proper typing for instruction and index*/}
        <div className="grid md:grid-cols-3 gap-6 text-slate-300">
          <div className="md:col-span-2">
            <div className="mb-4">
              <h2 className="font-semibold">Description</h2>
              <ul className="list-disc ml-6">
                {workoutData.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center items-center">
            {workoutData.video ? (
              <ReactPlayer url={workoutData.video} width="100%" controls />
            ) : (
              <p className="text-center">No video available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
