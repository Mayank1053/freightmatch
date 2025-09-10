"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirect to role-specific dashboard
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
  }, [user, router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}
