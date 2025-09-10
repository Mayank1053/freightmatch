"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Package, Phone, MessageCircle, Check, X, Search } from "lucide-react"
import Link from "next/link"

// Mock booking data
const mockBookings = [
  {
    id: "1",
    route: "Mumbai → Pune",
    shipper: {
      name: "ABC Logistics",
      company: "ABC Logistics Pvt Ltd",
      phone: "+91 9876543210",
      rating: 4.5,
    },
    cargo: {
      type: "Electronics",
      weight: "5 Tons",
      description: "Consumer electronics and accessories",
    },
    amount: 8500,
    status: "pending",
    date: "2024-01-15",
    requestedAt: "2024-01-10",
  },
  {
    id: "2",
    route: "Delhi → Gurgaon",
    shipper: {
      name: "XYZ Corp",
      company: "XYZ Corporation",
      phone: "+91 9876543211",
      rating: 4.2,
    },
    cargo: {
      type: "Textiles",
      weight: "3 Tons",
      description: "Cotton fabrics and garments",
    },
    amount: 3200,
    status: "confirmed",
    date: "2024-01-12",
    requestedAt: "2024-01-08",
  },
  {
    id: "3",
    route: "Bangalore → Chennai",
    shipper: {
      name: "PQR Industries",
      company: "PQR Industries Ltd",
      phone: "+91 9876543212",
      rating: 4.8,
    },
    cargo: {
      type: "Auto Parts",
      weight: "8 Tons",
      description: "Automotive spare parts and components",
    },
    amount: 12000,
    status: "completed",
    date: "2024-01-10",
    requestedAt: "2024-01-05",
  },
]

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.shipper.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAcceptBooking = (bookingId: string) => {
    // TODO: Implement accept booking logic
    console.log("Accepting booking:", bookingId)
  }

  const handleDeclineBooking = (bookingId: string) => {
    // TODO: Implement decline booking logic
    console.log("Declining booking:", bookingId)
  }

  return (
    <ProtectedRoute allowedRoles={["truck-owner"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/truck-owner">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Booking Requests</h1>
            <p className="text-slate-600">Manage your booking requests and confirmations</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by route or shipper..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      {booking.route}
                    </CardTitle>
                    <CardDescription>
                      Requested on {booking.requestedAt} • Travel Date: {booking.date}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Shipper Info */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{booking.shipper.name}</div>
                    <div className="text-sm text-slate-600">{booking.shipper.company}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span>{booking.shipper.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>

                {/* Cargo Info */}
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Package className="h-8 w-8 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">{booking.cargo.type}</div>
                    <div className="text-sm text-slate-600">
                      {booking.cargo.weight} • {booking.cargo.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{booking.amount.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">Offered Amount</div>
                  </div>
                </div>

                {/* Actions */}
                {booking.status === "pending" && (
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => handleAcceptBooking(booking.id)} className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Accept Booking
                    </Button>
                    <Button variant="outline" onClick={() => handleDeclineBooking(booking.id)} className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                )}

                {booking.status === "confirmed" && (
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    <Button className="flex-1">Start Trip</Button>
                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      View Invoice
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Rate Shipper
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any booking requests yet"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/dashboard/truck-owner/list-trip">
                  <Button>List Your First Trip</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
