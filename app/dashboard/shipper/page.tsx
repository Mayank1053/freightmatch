"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Search, MapPin, DollarSign, TrendingUp, Truck } from "lucide-react"
import Link from "next/link"

// Mock data - replace with real API calls
const mockStats = {
  activeShipments: 2,
  totalSpent: 125000,
  completedShipments: 18,
  savedCO2: 450,
}

const mockRecentShipments = [
  {
    id: "1",
    route: "Mumbai → Pune",
    trucker: "Rajesh Transport",
    cargo: "Electronics",
    weight: "5 Tons",
    amount: 8500,
    status: "in-transit",
    pickupDate: "2024-01-15",
    estimatedDelivery: "2024-01-16",
  },
  {
    id: "2",
    route: "Delhi → Gurgaon",
    trucker: "Singh Logistics",
    cargo: "Textiles",
    weight: "3 Tons",
    amount: 3200,
    status: "delivered",
    pickupDate: "2024-01-12",
    estimatedDelivery: "2024-01-12",
  },
  {
    id: "3",
    route: "Bangalore → Chennai",
    trucker: "South Express",
    cargo: "Auto Parts",
    weight: "8 Tons",
    amount: 12000,
    status: "booked",
    pickupDate: "2024-01-20",
    estimatedDelivery: "2024-01-21",
  },
]

export default function ShipperDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-blue-100 text-blue-800"
      case "in-transit":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["shipper"]}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage your shipments and find trucks</p>
          </div>
          <Link href="/dashboard/shipper/search">
            <Button size="lg">
              <Search className="mr-2 h-5 w-5" />
              Find Trucks
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeShipments}</div>
              <p className="text-xs text-slate-600">Currently in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{mockStats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-slate-600">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Shipments</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.completedShipments}</div>
              <p className="text-xs text-slate-600">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.savedCO2}kg</div>
              <p className="text-xs text-slate-600">Environmental impact</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/shipper/search">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                  <Search className="h-6 w-6" />
                  <span>Search Trucks</span>
                </Button>
              </Link>

              <Link href="/dashboard/shipper/post-requirement">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                  <Package className="h-6 w-6" />
                  <span>Post Requirement</span>
                </Button>
              </Link>

              <Link href="/dashboard/shipper/shipments">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                  <MapPin className="h-6 w-6" />
                  <span>Track Shipments</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Shipments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>Your latest shipping activity</CardDescription>
            </div>
            <Link href="/dashboard/shipper/shipments">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentShipments.map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{shipment.route}</div>
                      <div className="text-sm text-slate-600">
                        {shipment.trucker} • {shipment.cargo} • {shipment.weight}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">₹{shipment.amount.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">
                        {shipment.status === "delivered" ? "Delivered" : `ETA: ${shipment.estimatedDelivery}`}
                      </div>
                    </div>
                    <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
