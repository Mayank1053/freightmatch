"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, TrendingUp, Users, Package, DollarSign, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock analytics data
const mockMetrics = {
  userGrowth: {
    current: 2847,
    previous: 2543,
    change: 11.9,
  },
  revenue: {
    current: 2450000,
    previous: 2180000,
    change: 12.4,
  },
  bookings: {
    current: 1256,
    previous: 1089,
    change: 15.3,
  },
  matchRate: {
    current: 78.5,
    previous: 74.2,
    change: 5.8,
  },
}

const mockTopRoutes = [
  { route: "Mumbai → Pune", bookings: 145, revenue: 285000 },
  { route: "Delhi → Gurgaon", bookings: 132, revenue: 198000 },
  { route: "Bangalore → Chennai", bookings: 98, revenue: 245000 },
  { route: "Kolkata → Bhubaneswar", bookings: 87, revenue: 156000 },
  { route: "Hyderabad → Vijayawada", bookings: 76, revenue: 134000 },
]

const mockTopUsers = [
  { name: "Rajesh Kumar", type: "Truck Owner", trips: 45, revenue: 125000 },
  { name: "Singh Logistics", type: "Truck Owner", trips: 38, revenue: 98000 },
  { name: "ABC Industries", type: "Shipper", shipments: 32, spent: 156000 },
  { name: "XYZ Corporation", type: "Shipper", shipments: 28, spent: 134000 },
  { name: "South Express", type: "Truck Owner", trips: 25, revenue: 87000 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    const color = change >= 0 ? "text-green-600" : "text-red-600"
    return (
      <span className={color}>
        {sign}
        {change.toFixed(1)}%
      </span>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
              <p className="text-slate-600">Platform performance and business insights</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.userGrowth.current.toLocaleString()}</div>
              <p className="text-xs text-slate-600">{formatChange(mockMetrics.userGrowth.change)} from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(mockMetrics.revenue.current / 100000).toFixed(1)}L</div>
              <p className="text-xs text-slate-600">{formatChange(mockMetrics.revenue.change)} from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.bookings.current.toLocaleString()}</div>
              <p className="text-xs text-slate-600">{formatChange(mockMetrics.bookings.change)} from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.matchRate.current}%</div>
              <p className="text-xs text-slate-600">{formatChange(mockMetrics.matchRate.change)} from last period</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Routes */}
          <Card>
            <CardHeader>
              <CardTitle>Top Routes</CardTitle>
              <CardDescription>Most popular shipping routes by volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopRoutes.map((route, index) => (
                  <div key={route.route} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{route.route}</div>
                        <div className="text-sm text-slate-600">{route.bookings} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{(route.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-slate-600">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Users */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Most active users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopUsers.map((user, index) => (
                  <div key={user.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-slate-600">
                          {user.type} •{" "}
                          {user.type === "Truck Owner" ? `${user.trips} trips` : `${user.shipments} shipments`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{((user.revenue || user.spent) / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-slate-600">{user.type === "Truck Owner" ? "Earned" : "Spent"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Impact</CardTitle>
            <CardDescription>Platform's contribution to sustainability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">15.6 Tons</div>
                <div className="text-sm text-green-700 mt-2">CO₂ Emissions Saved</div>
                <div className="text-xs text-green-600 mt-1">This month</div>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">2,847</div>
                <div className="text-sm text-blue-700 mt-2">Empty Miles Reduced</div>
                <div className="text-xs text-blue-600 mt-1">Kilometers saved</div>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">78.5%</div>
                <div className="text-sm text-purple-700 mt-2">Efficiency Rate</div>
                <div className="text-xs text-purple-600 mt-1">Successful matches</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
