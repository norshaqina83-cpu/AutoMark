"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth";

type NavLink = { href: string; label: string; icon: string };

const NAV_LINKS_BY_ROLE: Record<UserRole, NavLink[]> = {
  admin: [
    { href: "/", label: "Dashboard", icon: "🏠" },
    { href: "/teacher", label: "Attendance", icon: "👩‍🏫" },
    { href: "/cards", label: "RFID Cards", icon: "💳" },
    { href: "/students", label: "Students", icon: "🎓" },
  ],
  teacher: [
    { href: "/teacher", label: "Attendance", icon: "👩‍🏫" },
    { href: "/cards", label: "RFID Cards", icon: "💳" },
    { href: "/students", label: "Students", icon: "🎓" },
  ],
  parent: [
    { href: "/parent", label: "My Child", icon: "👨‍👩‍👧" },
  ],
};

const ROLE_BADGE: Record<UserRole, { label: string; color: string }> = {
  admin: { label: "Admin", color: "bg-purple-700 text-purple-200" },
  teacher: { label: "Teacher", color: "bg-blue-700 text-blue-200" },
  parent: { label: "Parent", color: "bg-green-700 text-green-200" },
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const navLinks = user ? NAV_LINKS_BY_ROLE[user.role] : [];
  const badge = user ? ROLE_BADGE[user.role] : null;

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? (user.role === "parent" ? "/parent" : user.role === "teacher" ? "/teacher" : "/") : "/login"} className="flex items-center gap-2">
            <img src="/logo.svg" alt="RFID Attendance Logo" className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" />
            <span className="text-white font-semibold text-lg hidden sm:block">
              AutoMark
            </span>
          </Link>

          {/* Nav Links */}
          {user && (
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="hidden md:block">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side: user info + logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  {badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  )}
                  <span className="text-slate-300 text-sm">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  title="Sign out"
                >
                  <span>🚪</span>
                  <span className="hidden sm:block">Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="hidden sm:block">System Online</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
