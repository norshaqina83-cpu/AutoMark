"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, MOCK_USERS, UserRole } from "@/lib/auth";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  parent: "Parent",
};

const ROLE_ICONS: Record<UserRole, string> = {
  admin: "🛡️",
  teacher: "👩‍🏫",
  parent: "👨‍👩‍👧",
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: "Full system access — dashboard, attendance, cards, students",
  teacher: "View & manage class attendance, edit records",
  parent: "View-only access to your child's attendance history",
};

const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: "/",
  teacher: "/teacher",
  parent: "/parent",
};

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(ROLE_REDIRECTS[user.role]);
    }
  }, [user, isLoading, router]);

  const selectedUser = MOCK_USERS.find((u) => u.id === selectedUserId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedUserId) {
      setError("Please select an account.");
      return;
    }
    setIsSubmitting(true);
    const result = login(selectedUserId, password);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || "Login failed.");
      return;
    }
    // Redirect based on role
    const loggedIn = MOCK_USERS.find((u) => u.id === selectedUserId)!;
    router.replace(ROLE_REDIRECTS[loggedIn.role]);
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 text-3xl">
            📡
          </div>
          <h1 className="text-2xl font-bold text-white">RFID Attendance System</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to access your portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account selector */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Select Account
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  setError("");
                  setPassword("");
                }}
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">— Choose your account —</option>
                {(["admin", "teacher", "parent"] as UserRole[]).map((role) => (
                  <optgroup key={role} label={`${ROLE_ICONS[role]} ${ROLE_LABELS[role]}`}>
                    {MOCK_USERS.filter((u) => u.role === role).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Role info badge */}
            {selectedUser && (
              <div className="flex items-start gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg">
                <span className="text-2xl mt-0.5">{ROLE_ICONS[selectedUser.role]}</span>
                <div>
                  <p className="text-white text-sm font-medium">
                    {ROLE_LABELS[selectedUser.role]}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {ROLE_DESCRIPTIONS[selectedUser.role]}
                  </p>
                </div>
              </div>
            )}

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
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="bg-slate-900 rounded-lg p-2">
                <p className="text-slate-300 font-medium">Admin / Teacher</p>
                <p className="text-slate-500 mt-0.5">admin123 / teacher123</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-2">
                <p className="text-slate-300 font-medium">Parent</p>
                <p className="text-slate-500 mt-0.5">parent123</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-2">
                <p className="text-slate-300 font-medium">Any parent</p>
                <p className="text-slate-500 mt-0.5">sees own child only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
