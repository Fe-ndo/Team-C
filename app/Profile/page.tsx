"use client"
import { useState } from "react";
import { NavBar } from "../components/nav";

export default function Profile() {
    const user = {
        name: "John Doe",
        image: "path/to/profile-image.jpg",
        weight: 70, // in kg
        height: 175, // in cm
        age: 25
    };

    // State to store colors for each stat circle
    const [weightColor, setWeightColor] = useState("#000a");
    const [heightColor, setHeightColor] = useState("#000a");
    const [ageColor, setAgeColor] = useState("#000a");

    return (
        <div className="profile-page">
            <NavBar />
            <div className="profile-header">
                <h2>{user.name}</h2>
                <img src={user.image} alt="Profile" className="profile-image" />
            </div>
            <div className="profile-stats">
                <div className="stat-circle" style={{ backgroundColor: weightColor }}>
                    <span>Weight</span>
                    <p>{user.weight} kg</p>
                    <input
                        type="color"
                        value={weightColor}
                        onChange={(e) => setWeightColor(e.target.value)}
                        aria-label="Select weight color"
                    />
                </div>
                <div className="stat-circle" style={{ backgroundColor: heightColor }}>
                    <span>Height</span>
                    <p>{user.height} cm</p>
                    <input
                        type="color"
                        value={heightColor}
                        onChange={(e) => setHeightColor(e.target.value)}
                        aria-label="Select height color"
                    />
                </div>
                <div className="stat-circle" style={{ backgroundColor: ageColor }}>
                    <span>Age</span>
                    <p>{user.age} yrs</p>
                    <input
                        type="color"
                        value={ageColor}
                        onChange={(e) => setAgeColor(e.target.value)}
                        aria-label="Select age color"
                    />
                </div>
            </div>
        </div>
    );
}
