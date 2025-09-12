"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Plus, MapPin, DollarSign, TrendingUp, Clock, FileText, Star } from "lucide-react"
import Link from "next/link"

// Mock data - replace with real API calls
const mockStats = {
  activeListings: 3,
  totalEarnings: 45000,
  completedTrips: 12,
  pendingBookings: 2,
}

const mockRecentBookings = [
  {
    id: "1",
    route: "Mumbai → Pune",
    shipper: "ABC Logistics",
    cargo: "Electronics",
    amount: 8500,
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "2",
    route: "Delhi → Gurgaon",
    shipper: "XYZ Corp",
    cargo: "Textiles",
    amount: 3200,
    status: "confirmed",
    date: "2024-01-12",
  },
  {
    id: "3",
    route: "Bangalore → Chennai",
    shipper: "PQR Industries",
    cargo: "Auto Parts",
    amount: 12000,
    status: "completed",
    date: "2024-01-10",
  },
]

const mockActiveListings = [
  {
    id: "1",
    route: "Chennai → Coimbatore",
    date: "2024-01-20",
    capacity: "10 Tons",
    price: 15000,
    status: "active",
  },
  {
    id: "2",
    route: "Kolkata → Bhubaneswar",
    date: "2024-01-18",
    capacity: "15 Tons",
    price: 18000,
    status: "active",
  },
]

export default function TruckOwnerDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["truck-owner"]}>
      <div className="space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage your trucks and bookings</p>
          </div>
          <Link href="/dashboard/truck-owner/list-trip">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              List New Trip
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Active Listings</CardTitle>
              <Truck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{mockStats.activeListings}</div>
              <p className="text-xs text-slate-600">Available for booking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">₹{mockStats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-slate-600">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Completed Trips</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{mockStats.completedTrips}</div>
              <p className="text-xs text-slate-600">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{mockStats.pendingBookings}</div>
              <p className="text-xs text-slate-600">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
            <CardDescription>Manage your business efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Link href="/dashboard/truck-owner/invoices">
                <Button variant="outline" className="w-full h-16 md:h-20 flex-col gap-2 bg-transparent">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  <span className="text-xs md:text-sm">Invoices</span>
                </Button>
              </Link>

              <Link href="/dashboard/truck-owner/ratings">
                <Button variant="outline" className="w-full h-16 md:h-20 flex-col gap-2 bg-transparent">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
                  <span className="text-xs md:text-sm">Ratings</span>
                </Button>
              </Link>

              <Link href="/dashboard/truck-owner/earnings">
                <Button variant="outline" className="w-full h-16 md:h-20 flex-col gap-2 bg-transparent">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  <span className="text-xs md:text-sm">Earnings</span>
                </Button>
              </Link>

              <Link href="/dashboard/truck-owner/bookings">
                <Button variant="outline" className="w-full h-16 md:h-20 flex-col gap-2 bg-transparent">
                  <Truck className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                  <span className="text-xs md:text-sm">Bookings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Recent Bookings</CardTitle>
              <CardDescription>Latest booking requests and confirmations</CardDescription>
            </div>
            <Link href="/dashboard/truck-owner/bookings">
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {mockRecentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm md:text-base">{booking.route}</div>
                      <div className="text-xs md:text-sm text-slate-600">
                        {booking.shipper} • {booking.cargo}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4">
                    <div className="text-right">
                      <div className="font-medium text-sm md:text-base">₹{booking.amount.toLocaleString()}</div>
                      <div className="text-xs md:text-sm text-slate-600">{booking.date}</div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Active Listings</CardTitle>
              <CardDescription>Your current empty return trips</CardDescription>
            </div>
            <Link href="/dashboard/truck-owner/listings">
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                Manage All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {mockActiveListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Truck className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm md:text-base">{listing.route}</div>
                      <div className="text-xs md:text-sm text-slate-600">
                        {listing.capacity} • {listing.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4">
                    <div className="text-right">
                      <div className="font-medium text-sm md:text-base">₹{listing.price.toLocaleString()}</div>
                      <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
                    </div>
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
