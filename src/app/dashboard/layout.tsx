"use client"

import type React from "react"
import { useState } from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Truck, LogOut, User, Bell } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userInfoOpen, setUserInfoOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Truck className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <h1 className="text-lg md:text-2xl font-bold text-slate-900">FreightMatch</h1>
            </Link>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Notifications */}
              <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="h-4 w-4 md:h-5 md:w-5" />
                    {/* Notification badge */}
                    <span className="absolute -top-1 -right-1 h-3 w-3 md:h-4 md:w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 md:w-96 p-0" align="end">
                  <NotificationCenter />
                </PopoverContent>
              </Popover>

              <Popover open={userInfoOpen} onOpenChange={setUserInfoOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 p-2">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="hidden sm:block font-medium text-sm">{user?.name}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <div className="p-4 space-y-4">
                    {/* User Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user?.name}</div>
                          <div className="text-xs text-slate-500 capitalize">{user?.role?.replace("-", " ")}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">{user?.email}</div>
                    </div>

                    {/* Quick Stats */}
                    <div className="border-t pt-3">
                      <div className="text-xs font-medium text-slate-700 mb-2">Quick Stats</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-50 p-2 rounded text-center">
                          <div className="font-medium text-green-700">12</div>
                          <div className="text-green-600">Completed</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-center">
                          <div className="font-medium text-blue-700">3</div>
                          <div className="text-blue-600">Active</div>
                        </div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="w-full text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-transparent"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Desktop logout button - hidden on mobile */}
              {/*
              <div className="hidden md:block">
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
              */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-4 md:py-8">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
