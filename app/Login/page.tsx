"use client";
import { NavBar } from "../components/nav";
import { SignIn } from "../components/login";

export default function Login() {
  return (
    <div>
      <NavBar />
      <div className="">
        <SignIn />
      </div>
    </div>
  );
}
