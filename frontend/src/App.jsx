import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import GiftGrid from './components/GiftGrid';

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Auto-authenticate on application initialization check
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_username');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // 2. Pass this handler down to AuthForm to manage successful logins
  const handleLoginSuccess = (newToken, username) => {
    setToken(newToken);
    setUser(username);
  };

  // 3. Clear session context keys completely on sign out
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    setToken(null);
    setUser('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-semibold animate-pulse">Verifying token context...</div>
      </div>
    );
  }

  // Enforce redirection to the secure form layer if no active token string exists
  if (!token) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Synchronized Application Session Navigation Toolbar */}
      <nav className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🎁</span>
            <span className="font-extrabold text-gray-900 tracking-tight">GiftFinder Enterprise</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
              Active Session: <span className="text-indigo-600 font-bold">@{user}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-100"
            >
              Sign Out Session
            </button>
          </div>
        </div>
      </nav>

      {/* Render Product Catalog Responsive Grid Layout Card System */}
      <main className="py-6">
        <GiftGrid />
      </main>
    </div>
  );
}
