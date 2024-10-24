// components/SignIn.tsx
import Link from "next/link";

export function SignIn() {
    return (
        // Center the sign-in form within its section, with padding and responsive sizing
        <div className="flex items-center justify-center min-h-[80vh] py-16">
            <div className="max-w-sm w-full p-8 rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
                <form className="space-y-6">
                    {/* Title */}
                    <h5 className="text-2xl font-medium text-center text-white">
                        Sign in to Fittrackr
                    </h5>

                    {/* Email Input */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>

                    {/* Create Account Link */}
                    <div className="text-center">
                        <Link href="/signup" className="text-sm text-blue-400 hover:underline">
                            Create an account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
