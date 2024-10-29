// AuthRoute.tsx
import React, { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authConfig } from "../components/config/config"; // Import authConfig

type AuthRouteProps = {
  children: ReactNode;
};

const AuthRoute = ({ children }: AuthRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { auth, loginPath } = authConfig; // Use auth and loginPath from authConfig

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("User state changed:", user);
      if (user) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
        navigate(loginPath); // Redirect to loginPath from config
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [auth, navigate, loginPath]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // Show loading indicator while checking authentication
  }

  return isAuthenticated ? <>{children}</> : null; // Render children if authenticated
};

export default AuthRoute;
