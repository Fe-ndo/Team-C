"use client";
import Link from "next/link";
import { Balance } from "./currency";
import { Auth } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./configs/config";
import { onAuthStateChanged } from "firebase/auth";
import { SignOut } from "../components/signout";
import AuthRoute from "./authRoute2";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="font-bold transition-all flex align-middle py-1 px-2 m-1">
      <button onClick={() => setIsOpen(!isOpen)}>Tools</button>
      <ul
        className={`absolute mt-10 bg-slate-300 shadow-lg rounded-md w-48 bg-opacity-70 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="">
          {Object.entries(dropdownNavItems).map(([path, { name }]) => {
            return (
              <Link
                key={path}
                href={path}
                className="font-bold transition-all flex align-middle py-1 px-2 m-1"
              >
                {name}
              </Link>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

const navItems = {
  "/": {
    name: "Home",
  },
  Tools: {
    name: "Tools",
  },
  Profile: {
    name: "Profile",
  },
};

const dropdownNavItems = {
  WorkoutTrack: {
    name: "WorkoutTrack",
  },
  Search: {
    name: "Search",
  },
  CalorieTrack: {
    name: "CalorieTrack",
  },
};

export function NavBar() {
  //State to track if user is auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const user = auth.currentUser;
  return (
    <div className="w-full relative z-20 py-6 flex items-center justify-between">
      <h1 className="ml-4 font-bold items-start text-4xl">FitTrackr</h1>
      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="pl-4 pr-4 py-1 flex justify-center flex-row rounded-full bg-slate-300 bg-opacity-70">
          <Link
            href="/"
            className="font-bold transition-all flex align-middle py-1 px-2 m-1"
          >
            {" "}
            Home{" "}
          </Link>
          <DropdownMenu />
          <AuthRoute>
            <Link
              href="/Profile"
              className="font-bold transition-all flex align-middle py-1 px-2 m-1"
            >
              {" "}
              Profile{" "}
            </Link>
          </AuthRoute>
        </div>
      </div>
      <div className="flex items-center mr-4 font-bold">
        {isAuthenticated ? (
            <>
          <SignOut />
            <div className="pr-4 ">{user ? <Balance /> : null}</div>
               </>
        ) : (
        
        
          <button className="bg-slate-300 bg-opacity- rounded-md p-2 ">
            <Link href="/Login">Sign in</Link>
          </button>
       
        )}
      </div>
    </div>
  );
}
