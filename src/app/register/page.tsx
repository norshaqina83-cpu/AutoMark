"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register, users } = useAuth();
  const [form, setForm] = useState({
    idNumber: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "student" as UserRole,
    linkedStudentId: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.idNumber.trim() || !form.password || !form.name.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    if (form.role === "parent" && !form.linkedStudentId) {
      setError("Please enter your child's Student ID.");
      return;
    }

    const result = register({
      idNumber: form.idNumber,
      password: form.password,
      name: form.name,
      role: form.role,
      linkedStudentId: form.role === "parent" ? form.linkedStudentId.toUpperCase() : undefined,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      setError(result.error || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-slate-400 mt-2">Register for AutoMark Attendance System</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-green-400 font-semibold">Registration successful!</p>
              <p className="text-slate-400 text-sm mt-2">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-1.5">ID Number <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.idNumber}
                  onChange={(e) => setForm({ ...form, idNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. ADM001, TCH001, STU001"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Role <span className="text-red-400">*</span></label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {form.role === "parent" && (
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">Child's Student ID <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={form.linkedStudentId}
                    onChange={(e) => setForm({ ...form, linkedStudentId: e.target.value.toUpperCase() })}
                    placeholder="e.g. STU001"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Password <span className="text-red-400">*</span></label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 4 characters"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Register
              </button>

              <p className="text-center text-slate-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
