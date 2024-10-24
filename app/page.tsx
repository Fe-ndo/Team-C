"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "./components/nav";

export default function Landing() {
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
}

const listFeatures: CardProps[] = [
  {
    featureTitle: "Workout Tracker",
    featureDesc: "A comprehensive workout tracker that allows you to...",
  },
  {
    featureTitle: "Calorie Tracker",
    featureDesc: "A tool to help you keep track of your calorie intake!",
  },
  {
    featureTitle: "Workout Search",
    featureDesc:
      "We host a comprehensive database of workouts with all the info you need",
  },
  {
    featureTitle: "Recommended Workouts",
    featureDesc: "We offer an AI personalized workout service",
  },
];
const FeatureCard: React.FC<CardProps> = ({ featureTitle, featureDesc }) => {
  return (
    <div className="bg-opacity-90 relative z-99 p-8 mx-4 max-w-sm rounded-lg bg-gray-800 border-gray-100 hover:bg-gray-700">
      <h1 className="mb-2 text-2xl font-bold text-white">{featureTitle}</h1>
      <p className="text-sm">{featureDesc}</p>
    </div>
  );
};
