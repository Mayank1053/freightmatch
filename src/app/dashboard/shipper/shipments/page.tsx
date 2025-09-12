"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RatingModal } from "@/components/rating/rating-modal"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin, Package, Phone, Search, Eye, Download, Star, X } from "lucide-react"
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
    status: "delivered",
    pickupDate: "2024-01-15",
    estimatedDelivery: "2024-01-16",
    actualDelivery: "2024-01-16",
    trackingId: "TRK123456789",
    currentLocation: "Delivered",
    userRating: null, // User hasn't rated yet
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
    userRating: 4.5, // User has already rated
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
    status: "in-transit",
    pickupDate: "2024-01-20",
    estimatedDelivery: "2024-01-21",
    actualDelivery: null,
    trackingId: "TRK123456787",
    currentLocation: "Near Hosur",
    userRating: null,
  },
]

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean
    shipment: (typeof mockShipments)[0] | null
  }>({
    isOpen: false,
    shipment: null,
  })

  const [viewDetailsModal, setViewDetailsModal] = useState<{
    isOpen: boolean
    shipment: (typeof mockShipments)[0] | null
  }>({
    isOpen: false,
    shipment: null,
  })

  const { toast } = useToast()

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

  const handleRateService = (shipment: (typeof mockShipments)[0]) => {
    setRatingModal({
      isOpen: true,
      shipment,
    })
  }

  const handleViewDetails = (shipment: (typeof mockShipments)[0]) => {
    setViewDetailsModal({
      isOpen: true,
      shipment,
    })
  }

  const handleCall = (phone: string, truckerName: string) => {
    if (window.confirm(`Call ${truckerName}?`)) {
      window.open(`tel:${phone}`)
      toast({
        title: "Calling...",
        description: `Connecting to ${truckerName}`,
      })
    }
  }

  const handleRatingSubmit = (ratingData: any) => {
    // TODO: Submit rating to API
    console.log("Rating submitted:", ratingData)
    toast({
      title: "Rating Submitted!",
      description: "Thank you for your feedback. It helps improve our service quality.",
    })

    // Update the shipment with user rating (in real app, this would come from API)
    if (ratingModal.shipment) {
      const shipmentIndex = mockShipments.findIndex((s) => s.id === ratingModal.shipment!.id)
      if (shipmentIndex !== -1) {
        mockShipments[shipmentIndex].userRating = ratingData.overall
      }
    }

    setRatingModal({ isOpen: false, shipment: null })
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
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                    {shipment.userRating && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {shipment.userRating}
                      </Badge>
                    )}
                  </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCall(shipment.trucker.phone, shipment.trucker.name)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
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
                    <div className="text-sm text-slate-600">
                      {shipment.status === "delivered"
                        ? `Delivered: ${shipment.actualDelivery}`
                        : `ETA: ${shipment.estimatedDelivery}`}
                    </div>
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
                    <Link href={`/dashboard/shipper/track/${shipment.id}`}>
                      <Button className="flex-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        Track Live Location
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleViewDetails(shipment)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>

                  {shipment.status === "delivered" && !shipment.userRating && (
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleRateService(shipment)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Rate Service
                    </Button>
                  )}

                  {shipment.status === "delivered" && shipment.userRating && (
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleRateService(shipment)}
                    >
                      <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                      Update Rating
                    </Button>
                  )}

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

        {/* No shipments found */}
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

        {/* Rating Modal */}
        {ratingModal.shipment && (
          <RatingModal
            isOpen={ratingModal.isOpen}
            onClose={() => setRatingModal({ isOpen: false, shipment: null })}
            shipmentDetails={{
              id: ratingModal.shipment.id,
              route: ratingModal.shipment.route,
              trucker: ratingModal.shipment.trucker.name,
              company: ratingModal.shipment.trucker.company,
              amount: ratingModal.shipment.amount,
              deliveryDate: ratingModal.shipment.actualDelivery || ratingModal.shipment.estimatedDelivery,
            }}
            onRatingSubmit={handleRatingSubmit}
          />
        )}

        {/* View Details Modal */}
        {viewDetailsModal.shipment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">Shipment Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewDetailsModal({ isOpen: false, shipment: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Shipment Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Shipment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Shipment ID:</span>
                        <span className="font-medium">{viewDetailsModal.shipment.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Route:</span>
                        <span className="font-medium">{viewDetailsModal.shipment.route}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <Badge className={getStatusColor(viewDetailsModal.shipment.status)}>
                          {viewDetailsModal.shipment.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Pickup Date:</span>
                        <span className="font-medium">{viewDetailsModal.shipment.pickupDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Delivery Date:</span>
                        <span className="font-medium">
                          {viewDetailsModal.shipment.actualDelivery || viewDetailsModal.shipment.estimatedDelivery}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trucker Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Name:</span>
                        <span className="font-medium">{viewDetailsModal.shipment.trucker.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Company:</span>
                        <span className="font-medium">{viewDetailsModal.shipment.trucker.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{viewDetailsModal.shipment.trucker.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Phone:</span>
                        <span className="font-medium">{viewDetailsModal.shipment.trucker.phone}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cargo Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cargo Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-slate-600 text-sm">Type:</span>
                        <div className="font-medium">{viewDetailsModal.shipment.cargo.type}</div>
                      </div>
                      <div>
                        <span className="text-slate-600 text-sm">Weight:</span>
                        <div className="font-medium">{viewDetailsModal.shipment.cargo.weight}</div>
                      </div>
                      <div>
                        <span className="text-slate-600 text-sm">Amount:</span>
                        <div className="font-medium text-green-600">
                          ₹{viewDetailsModal.shipment.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-slate-600 text-sm">Description:</span>
                      <div className="font-medium">{viewDetailsModal.shipment.cargo.description}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {viewDetailsModal.shipment.status === "in-transit" && (
                    <Link href={`/dashboard/shipper/track/${viewDetailsModal.shipment.id}`}>
                      <Button className="flex-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        Track Live Location
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleCall(viewDetailsModal.shipment!.trucker.phone, viewDetailsModal.shipment!.trucker.name)
                    }
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Trucker
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
