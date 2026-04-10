"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "admin" | "teacher" | "parent" | "student";

export type User = {
  id: string;
  idNumber: string;
  name: string;
  role: UserRole;
  linkedStudentId?: string;
};

const STORAGE_KEYS = {
  users: "automark_users",
  passwords: "automark_passwords",
  user: "automark_current_user",
};

function getStoredUsers(): User[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.users);
  return stored ? JSON.parse(stored) : [];
}

function getStoredPasswords(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEYS.passwords);
  return stored ? JSON.parse(stored) : {};
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function savePasswords(passwords: Record<string, string>) {
  localStorage.setItem(STORAGE_KEYS.passwords, JSON.stringify(passwords));
}

type AuthContextType = {
  user: User | null;
  users: User[];
  login: (idNumber: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (data: { idNumber: string; password: string; name: string; role: UserRole; linkedStudentId?: string }) => { success: boolean; error?: string };
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.user);
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as User;
        const storedUsers = getStoredUsers();
        const valid = storedUsers.find((u) => u.id === parsed.id);
        if (valid) setUser(valid);
      }
      setUsers(getStoredUsers());
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    (idNumber: string, password: string): { success: boolean; error?: string } => {
      const normalised = idNumber.trim().toUpperCase();
      const storedUsers = getStoredUsers();
      const storedPasswords = getStoredPasswords();
      const found = storedUsers.find((u) => u.idNumber === normalised);
      if (!found) return { success: false, error: "ID number not found. Please check and try again." };
      if (storedPasswords[normalised] !== password)
        return { success: false, error: "Incorrect password." };
      setUser(found);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(found));
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
  }, []);

  const register = useCallback(
    (data: { idNumber: string; password: string; name: string; role: UserRole; linkedStudentId?: string }): { success: boolean; error?: string } => {
      const normalisedId = data.idNumber.trim().toUpperCase();
      const storedUsers = getStoredUsers();
      const storedPasswords = getStoredPasswords();

      if (storedUsers.some((u) => u.idNumber === normalisedId)) {
        return { success: false, error: "This ID number is already registered." };
      }

      const newUser: User = {
        id: `u${Date.now()}`,
        idNumber: normalisedId,
        name: data.name.trim(),
        role: data.role,
        linkedStudentId: data.linkedStudentId,
      };

      storedUsers.push(newUser);
      storedPasswords[normalisedId] = data.password;

      saveUsers(storedUsers);
      savePasswords(storedPasswords);
      setUsers(storedUsers);

      return { success: true };
    },
    []
  );

  return (
    <AuthContext.Provider value={{ user, users, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
