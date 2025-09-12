"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Truck, Package, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

// Mock admin data
const mockStats = {
  totalUsers: 2847,
  activeTrucks: 1256,
  activeShipments: 89,
  monthlyRevenue: 2450000,
  pendingVerifications: 23,
  activeDisputes: 7,
  co2Saved: 15600,
  matchRate: 78.5,
}

const mockRecentActivity = [
  {
    id: "1",
    type: "user_registration",
    description: "New truck owner registered: Rajesh Kumar",
    timestamp: "2 minutes ago",
    status: "pending",
  },
  {
    id: "2",
    type: "verification",
    description: "KYC documents submitted by Singh Logistics",
    timestamp: "1 hour ago",
    status: "pending",
  },
  {
    id: "3",
    type: "booking",
    description: "High-value booking completed: ₹45,000",
    timestamp: "2 hours ago",
    status: "completed",
  },
]

const mockPendingApprovals = [
  {
    id: "1",
    type: "KYC Verification",
    user: "Rajesh Kumar",
    userType: "Truck Owner",
    submittedAt: "2024-01-15",
    priority: "high",
  },
  {
    id: "2",
    type: "Vehicle Registration",
    user: "Singh Logistics",
    userType: "Truck Owner",
    submittedAt: "2024-01-14",
    priority: "medium",
  },
  {
    id: "3",
    type: "Business Verification",
    user: "ABC Industries",
    userType: "Shipper",
    submittedAt: "2024-01-13",
    priority: "low",
  },
]

export default function AdminDashboard() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return <Users className="h-4 w-4 text-blue-600" />
      case "dispute":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "verification":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "booking":
        return <Package className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Monitor and manage the FreightMatch platform</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-slate-600">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trucks</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeTrucks.toLocaleString()}</div>
              <p className="text-xs text-slate-600">Currently available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(mockStats.monthlyRevenue / 100000).toFixed(1)}L</div>
              <p className="text-xs text-slate-600">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.matchRate}%</div>
              <p className="text-xs text-slate-600">Successful bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/admin/users">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Button>
              </Link>

              <Link href="/dashboard/admin/verifications">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent relative">
                  <CheckCircle className="h-6 w-6" />
                  <span>Verifications</span>
                  {mockStats.pendingVerifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500">{mockStats.pendingVerifications}</Badge>
                  )}
                </Button>
              </Link>

              <Link href="/dashboard/admin/analytics">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                  <TrendingUp className="h-6 w-6" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events and actions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity
                  .filter((activity) => activity.type !== "dispute")
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg mt-1">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900">{activity.description}</div>
                        <div className="text-xs text-slate-600 mt-1">{activity.timestamp}</div>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Items requiring admin review</CardDescription>
              </div>
              <Link href="/dashboard/admin/verifications">
                <Button variant="outline" size="sm">
                  Review All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{approval.type}</div>
                      <div className="text-xs text-slate-600">
                        {approval.user} • {approval.userType}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Submitted: {approval.submittedAt}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(approval.priority)}>{approval.priority}</Badge>
                      <Button size="sm">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Health */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>Key performance indicators and system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{mockStats.co2Saved}kg</div>
                <div className="text-sm text-green-700 mt-1">CO₂ Emissions Saved</div>
                <div className="text-xs text-green-600 mt-1">This month</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mockStats.activeShipments}</div>
                <div className="text-sm text-blue-700 mt-1">Active Shipments</div>
                <div className="text-xs text-blue-600 mt-1">Currently in transit</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{mockStats.matchRate}%</div>
                <div className="text-sm text-purple-700 mt-1">Success Rate</div>
                <div className="text-xs text-purple-600 mt-1">Successful matches</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
