"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth";

const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: "/",
  teacher: "/teacher",
  parent: "/parent",
};

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(ROLE_REDIRECTS[user.role]);
    }
  }, [user, isLoading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!idNumber.trim()) {
      setError("Please enter your ID number.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setIsSubmitting(true);
    const result = login(idNumber, password);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || "Login failed.");
      return;
    }
    // Redirect is handled by the useEffect above once user state updates
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/workspaces/AutoMark/public/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl mb-4 object-cover" />
          <h1 className="text-2xl font-bold text-white">AutoMark</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in with your ID number to access your portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ID Number */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                ID Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => {
                  setIdNumber(e.target.value);
                  setError("");
                }}
                placeholder="e.g. ADM001, TCH001, PAR001"
                autoComplete="username"
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500 uppercase"
              />
              <p className="text-slate-500 text-xs mt-1.5">
                Enter your assigned ID number (case-insensitive)
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-700/60 rounded-lg text-red-300 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-5 border-t border-slate-700">
            <p className="text-slate-500 text-xs text-center mb-3">Demo credentials</p>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-900 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🛡️</span>
                  <div>
                    <p className="text-slate-300 font-medium">Administrator</p>
                    <p className="text-slate-500">ID: ADM001</p>
                  </div>
                </div>
                <p className="text-slate-500 font-mono">admin123</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>👩‍🏫</span>
                  <div>
                    <p className="text-slate-300 font-medium">Teacher</p>
                    <p className="text-slate-500">ID: TCH001</p>
                  </div>
                </div>
                <p className="text-slate-500 font-mono">teacher123</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>👨‍👩‍👧</span>
                  <div>
                    <p className="text-slate-300 font-medium">Parent</p>
                    <p className="text-slate-500">ID: PAR001 – PAR006</p>
                  </div>
                </div>
                <p className="text-slate-500 font-mono">parent123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
