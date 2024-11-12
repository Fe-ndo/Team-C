import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../components/config/config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Cookies.remove("authToken");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Sign Out
    </button>
  );
}
