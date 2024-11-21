"use client";
import React, { useState } from "react";
import UserProfile from "../components/userProfile";
import { NavBar } from "../components/nav";



export default function Profile() {
  return (
    <div >
      <NavBar />
      
        
        <UserProfile />
      
    </div>
  );
}