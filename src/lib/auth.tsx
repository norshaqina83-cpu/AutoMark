"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "admin" | "teacher" | "parent";

export type User = {
  id: string;
  name: string;
  role: UserRole;
  /** For parents: the studentId they are linked to */
  linkedStudentId?: string;
};

// Mock user accounts — in production these would come from a real auth system
export const MOCK_USERS: User[] = [
  { id: "u1", name: "Admin User", role: "admin" },
  { id: "u2", name: "Ms. Thompson", role: "teacher" },
  { id: "u3", name: "Mr. Johnson", role: "parent", linkedStudentId: "STU001" },
  { id: "u4", name: "Mrs. Smith", role: "parent", linkedStudentId: "STU002" },
  { id: "u5", name: "Mr. White", role: "parent", linkedStudentId: "STU003" },
  { id: "u6", name: "Mrs. Brown", role: "parent", linkedStudentId: "STU004" },
  { id: "u7", name: "Mr. Davis", role: "parent", linkedStudentId: "STU005" },
  { id: "u8", name: "Mrs. Wilson", role: "parent", linkedStudentId: "STU006" },
];

// Mock passwords — in production use hashed passwords + real auth
export const MOCK_PASSWORDS: Record<string, string> = {
  u1: "admin123",
  u2: "teacher123",
  u3: "parent123",
  u4: "parent123",
  u5: "parent123",
  u6: "parent123",
  u7: "parent123",
  u8: "parent123",
};

type AuthContextType = {
  user: User | null;
  login: (userId: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "rfid_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        // Validate the stored user still exists in mock users
        const valid = MOCK_USERS.find((u) => u.id === parsed.id);
        if (valid) setUser(valid);
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    (userId: string, password: string): { success: boolean; error?: string } => {
      const found = MOCK_USERS.find((u) => u.id === userId);
      if (!found) return { success: false, error: "User not found." };
      if (MOCK_PASSWORDS[userId] !== password)
        return { success: false, error: "Incorrect password." };
      setUser(found);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
