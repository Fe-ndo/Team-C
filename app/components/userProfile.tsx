"use client";
import "./profile.css";
import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

const API_BASE_URL = "127.0.0.1:5328"; // Replace with your Flask API base URL

// Capitalized the component name to follow React conventions
export function UserProfile() {
  // State to store user information fetched from the server
  const [user, setUser] = useState<{ name: string; image: string }>({
    name: "",
    image: "",
  });

  // State for editable inputs
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(25);

  // Single color state for all circles
  const [statColor, setStatColor] = useState("#000a");

  // State to store selected activities
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Save button loading and success state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [buttonColor, setButtonColor] = useState("#4CAF50"); // Initial color: Green

  // Possible activities
  const activities = ["Walking", "Running", "Swimming", "Cycling"];

  // Fetch user information from the server
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user_profile`);
        if (response.data.success) {
          const {
            name,
            image,
            weight,
            height,
            age,
            selectedActivities,
            statColor,
          } = response.data.profile;

          // Update state with fetched user profile data
          setUser({ name, image });
          setWeight(weight);
          setHeight(height);
          setAge(age);
          setSelectedActivities(selectedActivities);
          setStatColor(statColor);

          console.log("Fetched user profile data:", response.data.profile);
        } else {
          console.error("Failed to fetch user profile:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching user profile from server:", error);
      }
    };

    fetchUserInfo();
  }, []); // Fetch only once on component mount

  const handleAddActivity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const activity = event.target.value;
    if (activity && !selectedActivities.includes(activity)) {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  // Save data via Flask API
  const handleSave = async () => {
    setIsSaving(true); // Show loading state
    setButtonColor("#4CAF50"); // Green while saving

    try {
      // Prepare user profile data
      const profileData = {
        name: user.name,
        weight,
        height,
        age,
        selectedActivities,
        statColor,
      };

      // Call the Flask API to save the data
      const response = await axios.post(
        `${API_BASE_URL}/user_profile`,
        profileData
      );

      if (response.data.success) {
        setSaveSuccess(true);
        console.log("Saved Data via Flask API:", profileData);
      } else {
        console.error("Error saving data via Flask API:", response.data.error);
      }
    } catch (error) {
      setSaveSuccess(false);
      console.error("Error saving data via Flask API:", error);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setButtonColor("#000000"); // Change to black after 5 seconds
        setSaveSuccess(false);
      }, 5000);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>{user.name || "Loading..."}</h2>
        <img
          src={user.image || "/default-profile.png"}
          alt="Profile"
          className="profile-image"
        />
      </div>

      {/* Profile Stats */}
      <div className="profile-stats">
        <div className="stat-circle" style={{ backgroundColor: statColor }}>
          <span>Weight</span>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
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
            onChange={(e) => setHeight(parseFloat(e.target.value))}
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
            onChange={(e) => setAge(parseInt(e.target.value))}
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
          style={{ backgroundColor: buttonColor }}
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
          <option value="">-- Choose an activity --</option>
          {activities.map((activity) => (
            <option key={activity} value={activity}>
              {activity}
            </option>
          ))}
        </select>
      </div>

      {/* Display Selected Activities */}
      <div className="activity-icons">
        {selectedActivities.map((activity, index) => (
          <div key={index} className="activity-icon">
            <i className={`fas fa-${activity.toLowerCase()}`}></i> {activity}
          </div>
        ))}
      </div>

      {/* Color Picker */}
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

export default UserProfile;
