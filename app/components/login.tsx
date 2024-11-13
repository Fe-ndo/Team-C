import React, { useState, FormEvent } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { auth } from "./configs/config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth, db } from "../components/firebase";
import { initUserProfile } from "./initCollections";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const getErrorMessage = (error: AuthError) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists";
      case "auth/invalid-email":
        return "Please enter a valid email address";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled. Please contact support.";
      case "auth/weak-password":
        return "Password should be at least 6 characters";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/user-not-found":
        return "No account exists with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/too-many-requests":
        return "Too many unsuccessful login attempts. Please try again later.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await initUserProfile(auth, user, db);
        setMessage("Account created successfully!");
        router.push("/Profile");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Retrieve the Firebase ID token and store it in a cookie
        const token = await userCredential.user.getIdToken();
        Cookies.set("authToken", token, { expires: 7 }); // Cookie expires in 7 days
        setMessage("Signed in successfully!");
        router.push("/Profile");
      }
    } catch (err: any) {
      // Format Firebase error messages to be more user-friendly
      const errorMessage = err.message;
      console.error("Auth error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignUp(!isSignUp);
    setMessage("");
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword); // Toggle password visibility
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="max-w-sm w-full p-8 rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-2xl font-medium text-center text-white">
            {isSignUp ? "Create Account" : "Sign in to FitTrackr"}
          </h5>

          {error && (
            <div className="p-4 mb-4 text-red-400 bg-red-900/50 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="p-4 mb-4 text-green-400 bg-green-900/50 rounded-lg">
              {message}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility} // Button to toggle visibility
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </button>

          <button
            onClick={toggleMode}
            className="w-full p-3 text-blue-400 hover:text-blue-300 transition"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
