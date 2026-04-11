"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, UserRole } from "@/lib/auth";

const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: "/",
  teacher: "/teacher",
  parent: "/parent",
  student: "/student",
};

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl mb-4 object-cover mx-auto"/>
          <h1 className="text-2xl font-bold text-white">AutoMark</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in with your ID number to access your portal</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="e.g. ADM001, TCH001"
                autoComplete="username"
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500 uppercase"
              />
            </div>

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

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-700/60 rounded-lg text-red-300 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-400 hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
