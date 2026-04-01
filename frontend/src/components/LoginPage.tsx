import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import "./logoacm.png";


interface LoginPageProps {
  onLogin: (email: string, name: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !name) {
      setError("Please enter both email and name");
      return;
    }

    // Call onLogin immediately as a mock authentication
    onLogin(email, name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-300 to-purple-400 flex items-center justify-center px-4">
      <div className="max-w-md w-full">

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src='src\components\logoacm.png' alt="ACM Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            ACM Event Manager
          </h1>
          <p className="text-gray-600">
            St. Vincent College Technical Club
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Sign in to manage your club events
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Standard Sign-In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="john@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition font-medium shadow-sm"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Secure authentication for ACM club members</p>
        </div>

      </div>
    </div>
  );
}
