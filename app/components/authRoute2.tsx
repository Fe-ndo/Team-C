import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../components/config/config";
import { onAuthStateChanged } from "firebase/auth";

// Define the props type for AuthRoute
interface AuthRouteProps {
  children: ReactNode;
}

// AuthRoute component
const AuthRoute = ({ children }: AuthRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to manage async checks
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/Login"); // Redirect to Login if not authenticated
      }
      setLoading(false); // Set loading to false after auth check
    });

    return () => unsubscribe();
  }, [router]);

  // Display loading or children based on authentication status
  if (loading) {
    return <div>Loading...</div>; // Optional loading indicator
  }

  return isAuthenticated ? <>{children}</> : null; // Render children if authenticated
};

export default AuthRoute;
