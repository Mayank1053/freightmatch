"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Package, Phone, MessageCircle, Search, Eye, Download } from "lucide-react"
import Link from "next/link"

// Mock shipment data
const mockShipments = [
  {
    id: "SH001",
    route: "Mumbai → Pune",
    trucker: {
      name: "Rajesh Kumar",
      company: "Kumar Transport",
      phone: "+91 9876543210",
      rating: 4.8,
    },
    cargo: {
      type: "Electronics",
      weight: "5 Tons",
      description: "Consumer electronics and accessories",
    },
    amount: 8500,
    status: "in-transit",
    pickupDate: "2024-01-15",
    estimatedDelivery: "2024-01-16",
    actualDelivery: null,
    trackingId: "TRK123456789",
    currentLocation: "Lonavala",
  },
  {
    id: "SH002",
    route: "Delhi → Gurgaon",
    trucker: {
      name: "Singh Logistics",
      company: "Singh Logistics Pvt Ltd",
      phone: "+91 9876543211",
      rating: 4.5,
    },
    cargo: {
      type: "Textiles",
      weight: "3 Tons",
      description: "Cotton fabrics and garments",
    },
    amount: 3200,
    status: "delivered",
    pickupDate: "2024-01-12",
    estimatedDelivery: "2024-01-12",
    actualDelivery: "2024-01-12",
    trackingId: "TRK123456788",
    currentLocation: "Delivered",
  },
  {
    id: "SH003",
    route: "Bangalore → Chennai",
    trucker: {
      name: "South Express",
      company: "South Express Transport",
      phone: "+91 9876543212",
      rating: 4.6,
    },
    cargo: {
      type: "Auto Parts",
      weight: "8 Tons",
      description: "Automotive spare parts and components",
    },
    amount: 12000,
    status: "booked",
    pickupDate: "2024-01-20",
    estimatedDelivery: "2024-01-21",
    actualDelivery: null,
    trackingId: "TRK123456787",
    currentLocation: "Pickup Scheduled",
  },
]

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredShipments = mockShipments.filter((shipment) => {
    const matchesSearch =
      shipment.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trucker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/shipper">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Shipments</h1>
            <p className="text-slate-600">Track and manage your cargo shipments</p>
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
                    placeholder="Search by shipment ID, route, or trucker..."
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
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Shipments List */}
        <div className="space-y-4">
          {filteredShipments.map((shipment) => (
            <Card key={shipment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      {shipment.route}
                    </CardTitle>
                    <CardDescription>
                      Shipment ID: {shipment.id} • Pickup: {shipment.pickupDate}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trucker Info */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{shipment.trucker.name}</div>
                    <div className="text-sm text-slate-600">{shipment.trucker.company}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span>{shipment.trucker.rating}</span>
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

                {/* Shipment Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-slate-600 mb-1">Cargo Details</div>
                    <div className="font-medium">{shipment.cargo.type}</div>
                    <div className="text-sm text-slate-600">{shipment.cargo.weight}</div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-slate-600 mb-1">Current Status</div>
                    <div className="font-medium">{shipment.currentLocation}</div>
                    <div className="text-sm text-slate-600">ETA: {shipment.estimatedDelivery}</div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-slate-600 mb-1">Amount</div>
                    <div className="font-medium text-green-600">₹{shipment.amount.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">{shipment.status === "delivered" ? "Paid" : "Pending"}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {shipment.status === "in-transit" && (
                    <Button className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      Track Live Location
                    </Button>
                  )}

                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>

                  {shipment.status === "delivered" && (
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredShipments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No shipments found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't made any shipments yet"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/dashboard/shipper/search">
                  <Button>Find Your First Truck</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
