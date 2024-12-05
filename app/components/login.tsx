import React, { useState, FormEvent } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { auth, db } from "./configs/config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { initUserProfile } from "./initCollections";
import { redirect } from "next/navigation";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // New states for personal information
  const [firstName, setFirstName] = useState(""); // <-- Added
  const [lastName, setLastName] = useState(""); // <-- Added
  const [weight, setWeight] = useState(""); // <-- Added
  const [height, setHeight] = useState(""); // <-- Added
  const [age, setAge] = useState(""); // <-- Added

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
        await initUserProfile(auth, user, db, {
          firstName, // <-- Added
          lastName, // <-- Added
          weight, // <-- Added
          height, // <-- Added
          age, // <-- Added
        });
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

            {/* New fields for personal information */}
            {isSignUp && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter your weight"
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Enter your height"
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
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
                  onClick={togglePasswordVisibility}
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
              {isLoading
                ? "Loading..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
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
    </div>
  );
}
