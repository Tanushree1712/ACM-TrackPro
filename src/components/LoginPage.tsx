import React, { useState } from 'react';
import { AlertCircle, Mail, Eye, EyeOff } from 'lucide-react';
import acmLogo from 'figma:asset/00d665e43d6abf23286e3228841dc8b0975226b3.png';

interface LoginPageProps {
  onLogin: (email: string, name: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showManualLogin, setShowManualLogin] = useState(false);

  const validateEmail = (email: string): boolean => {
    return email.endsWith('@stvincentngp.edu.in');
  };

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters
    return password.length >= 8;
  };

  const handleGoogleSignIn = () => {
    // Mock Google OAuth flow - in production, this would use actual Google OAuth
    setShowManualLogin(true);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !name || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please use your St. Vincent college email (@stvincentngp.edu.in)');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Successful login
    onLogin(email, name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={acmLogo} alt="ACM Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">ACM Event Manager</h1>
          <p className="text-gray-600">St. Vincent College Technical Club</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-6">Sign in to manage your club events</p>

          {!showManualLogin ? (
            <>
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg transition font-medium shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>

              {/* College Email Notice */}
              <div className="mt-6 flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">College Email Required</p>
                  <p className="text-blue-800">
                    You must sign in using your SVPCET Google account (@stvincentngp.edu.in)
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Manual Login Form (Mock) */}
              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    College Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    placeholder="example@stvincentngp.edu.in"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition font-medium shadow-sm"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => setShowManualLogin(false)}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Back to Google Sign In
                </button>
              </form>

              {/* Info Box */}
              <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900">
                  Only SVPCET email addresses (@stvincentngp.edu.in) are allowed
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Secure authentication for ACM club members</p>
        </div>
      </div>
    </div>
  );
}