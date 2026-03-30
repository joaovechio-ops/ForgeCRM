"use client";

import { Role } from "@/lib/types";
import { ReactNode } from "react";

interface UserRoleGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

// In a real app, this would get the role from an Auth Context
const CURRENT_USER_ROLE: Role = 'manager'; 

export function UserRoleGuard({ allowedRoles, children, fallback }: UserRoleGuardProps) {
  const hasAccess = allowedRoles.includes(CURRENT_USER_ROLE);

  if (!hasAccess) {
    return fallback || null;
  }

  return <>{children}</>;
}
