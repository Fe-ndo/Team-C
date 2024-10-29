import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Home/page";
import ProfilePage from "./Profile/page";
import LoginPage from "./Login/page";
import AuthRoute from "./components/AuthRoute";

const Application: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="Home" element={<HomePage />} />
        <Route
          path="Profile"
          element={
            <AuthRoute>
              <ProfilePage />
            </AuthRoute>
          }
        />
        <Route path="Login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Application;
