import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./../firebase/config";
import "./logoacm-removebg-preview (1).png";


interface LoginPageProps {
  onLogin: (email: string, name: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState<string>("");

  const handleGoogleSignIn = async (): Promise<void> => {
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email) {
        setError("No email found in Google account");
        return;
      }

      // 🎓 College email restriction
      if (!user.email.endsWith("@stvincentngp.edu.in")) {
        setError("Please use your SVPCET Google account");
        await auth.signOut();
        return;
      }

      onLogin(user.email, user.displayName ?? "User");

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Google sign-in failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-300 to-purple-400 flex items-center justify-center px-4">
      <div className="max-w-md w-full">

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src='logoacm-removebg-preview (1).png' alt="ACM Logo" className="w-20 h-20" />
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

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg transition font-medium shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          {/* Info Box */}
          <div className="mt-6 flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">College Email Required</p>
              <p className="text-blue-800">
                Only SVPCET Google accounts (@stvincentngp.edu.in) are allowed
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Secure authentication for ACM club members</p>
        </div>

      </div>
    </div>
  );
}
