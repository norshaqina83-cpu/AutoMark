"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth";

type Props = {
  /** Roles allowed to view this page. If empty/undefined, any authenticated user is allowed. */
  allowedRoles?: UserRole[];
  children: React.ReactNode;
};

export default function AuthGuard({ allowedRoles, children }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Redirect to the user's own dashboard
      const roleHome: Record<UserRole, string> = {
        admin: "/",
        teacher: "/teacher",
        parent: "/parent",
      };
      router.replace(roleHome[user.role]);
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!user) return null;

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
