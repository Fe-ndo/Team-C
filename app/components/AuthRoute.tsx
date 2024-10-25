import React, { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export interface IAuthRouteProps {
  children: ReactNode; // The child components that need protection
}

const AuthRoute: React.FC<IAuthRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Initially null (loading)
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
        navigate("/login"); // Redirect to login
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [auth, navigate]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // Show loading indicator while checking authentication
  }

  return isAuthenticated ? <>{children}</> : null; // Render children if authenticated
};

export default AuthRoute;
