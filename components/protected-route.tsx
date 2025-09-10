"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = "/login" }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        switch (user.role) {
          case "truck-owner":
            router.push("/dashboard/truck-owner")
            break
          case "shipper":
            router.push("/dashboard/shipper")
            break
          case "admin":
            router.push("/dashboard/admin")
            break
          default:
            router.push("/login")
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
