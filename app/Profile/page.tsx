"use client";
import "./profile.css";
import { useState } from "react";
import { NavBar } from "../components/nav";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Profile() {
    const user = {
        name: "John Doe",
        image: "/user.png"
    };

    // State for editable inputs
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(175);
    const [age, setAge] = useState(25);

    // Single color state for all circles
    const [statColor, setStatColor] = useState("#000a");

    // State to store selected activities
    const [selectedActivities, setSelectedActivities] = useState([]);

    // Save button loading and success state
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [buttonColor, setButtonColor] = useState("#4CAF50"); // Initial color: Green

    // Possible activities
    const activities = ["Walking", "Running", "Swimming", "Cycling"];

    const handleAddActivity = (event) => {
        const activity = event.target.value;
        if (activity && !selectedActivities.includes(activity)) {
            setSelectedActivities([...selectedActivities, activity]);
        }
    };

    // Simulate saving to a database
    const handleSave = async () => {
        setIsSaving(true); // Show loading state
        setButtonColor("#4CAF50"); // Green while saving
        try {
            // Simulate an API call (replace this with your actual database call)
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock delay
            // On success
            setSaveSuccess(true);
            setIsSaving(false);
            // Optionally reset or log data
            console.log("Saved Data: ", { weight, height, age });

            // Set the button to green and reset it after 5 seconds
            setTimeout(() => {
                setButtonColor("#000000");  // Change to black after 5 seconds
            }, 5000);  // 5000ms (5 seconds)

            // Reset success state after 5 seconds
            setTimeout(() => {
                setSaveSuccess(false);  // Reset the success state
            }, 5000);  // 5000ms (5 seconds)
        } catch (error) {
            setSaveSuccess(false);
            setIsSaving(false);
            setButtonColor("#000000"); // Reset to black on error
            console.error("Error saving data", error);
        }
    };

    return (
        <div className="profile-page">
            <NavBar />
            <div className="profile-header">
                <h2>{user.name}</h2>
                <img src={user.image} alt="Profile" className="profile-image" />
            </div>

            {/* Left-aligned column for stat circles */}
            <div className="profile-stats">
                <div className="stat-circle" style={{ backgroundColor: statColor }}>
                    <span>Weight</span>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="stat-input"
                        aria-label="Enter weight"
                    />
                    <span>kg</span>
                </div>
                <div className="stat-circle" style={{ backgroundColor: statColor }}>
                    <span>Height</span>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="stat-input"
                        aria-label="Enter height"
                    />
                    <span>cm</span>
                </div>
                <div className="stat-circle" style={{ backgroundColor: statColor }}>
                    <span>Age</span>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="stat-input"
                        aria-label="Enter age"
                    />
                    <span>yrs</span>
                </div>
            </div>

            {/* Save Button */}
            <div className="save-button-container">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`save-button ${isSaving ? "loading" : ""}`}
                    style={{ backgroundColor: buttonColor }} // Dynamic background color
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
                {saveSuccess && !isSaving && (
                    <p className="save-success">Data saved successfully!</p>
                )}
            </div>

           {/* Activity Selector Dropdown */}
            <div className="activity-selector">
                <label htmlFor="activity">Select an activity you enjoy:</label>
                <select
                    id="activity"
                    onChange={handleAddActivity}
                    className="activity-dropdown"
                >
                    <option value="" className="bg-gray-300 text-gray-600">-- Choose an activity --</option>
                    {activities.map((activity) => {
                        let icon;
                        switch (activity) {
                            case "Walking":
                                icon = <i className="fas fa-walking"></i>;  // Walking icon
                                break;
                            case "Running":
                                icon = <i className="fas fa-running"></i>;  // Running icon
                                break;
                            case "Swimming":
                                icon = <i className="fas fa-swimmer"></i>;  // Swimming icon
                                break;
                            case "Cycling":
                                icon = <i className="fas fa-bicycle"></i>;  // Cycling icon
                                break;
                            default:
                                icon = null;
                        }
                        return (
                            <option key={activity} value={activity} className="bg-white text-gray-700">
                                {icon} {activity}  {/* Display icon and activity name */}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Display Selected Activities as Icons */}
            <div className="activity-icons">
                {selectedActivities.map((activity, index) => {
                    let icon;
                    switch (activity) {
                        case "Walking":
                            icon = <i className="fas fa-walking"></i>;
                            break;
                        case "Running":
                            icon = <i className="fas fa-running"></i>;
                            break;
                        case "Swimming":
                            icon = <i className="fas fa-swimmer"></i>;
                            break;
                        case "Cycling":
                            icon = <i className="fas fa-bicycle"></i>;
                            break;
                        default:
                            icon = null;
                    }
                    return (
                        <div key={index} className="activity-icon">
                            {icon} {/* Display the icon */}
                        </div>
                    );
                })}
            </div>

            <div className="color-picker">
                <label htmlFor="statColorPicker">Choose color for stats:</label>
                <input
                    type="color"
                    id="statColorPicker"
                    value={statColor}
                    onChange={(e) => setStatColor(e.target.value)}
                    aria-label="Select color for all stats"
                />
            </div>
        </div>
    );
}
