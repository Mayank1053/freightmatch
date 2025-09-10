"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Calendar, Truck, Edit, Trash2, Eye, Search, Plus } from "lucide-react"
import Link from "next/link"

// Mock listings data
const mockListings = [
  {
    id: "1",
    route: "Chennai → Coimbatore",
    origin: "Chennai",
    destination: "Coimbatore",
    date: "2024-01-20",
    capacity: "10 Tons",
    vehicleType: "Open Body Truck",
    price: 15000,
    status: "active",
    views: 12,
    inquiries: 3,
    createdAt: "2024-01-12",
  },
  {
    id: "2",
    route: "Kolkata → Bhubaneswar",
    origin: "Kolkata",
    destination: "Bhubaneswar",
    date: "2024-01-18",
    capacity: "15 Tons",
    vehicleType: "Closed Container",
    price: 18000,
    status: "active",
    views: 8,
    inquiries: 1,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    route: "Mumbai → Nashik",
    origin: "Mumbai",
    destination: "Nashik",
    date: "2024-01-08",
    capacity: "8 Tons",
    vehicleType: "Open Body Truck",
    price: 12000,
    status: "expired",
    views: 25,
    inquiries: 5,
    createdAt: "2024-01-01",
  },
]

export default function ListingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredListings = mockListings.filter((listing) => {
    const matchesSearch =
      listing.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "booked":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDeleteListing = (listingId: string) => {
    // TODO: Implement delete listing logic
    console.log("Deleting listing:", listingId)
  }

  return (
    <ProtectedRoute allowedRoles={["truck-owner"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/truck-owner">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
              <p className="text-slate-600">Manage your empty return trip listings</p>
            </div>
          </div>
          <Link href="/dashboard/truck-owner/list-trip">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by route or city..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Listings Grid */}
        <div className="grid gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      {listing.route}
                    </CardTitle>
                    <CardDescription>
                      Listed on {listing.createdAt} • Travel Date: {listing.date}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-slate-400" />
                    <div>
                      <div className="text-sm text-slate-600">Vehicle Type</div>
                      <div className="font-medium">{listing.vehicleType}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <div>
                      <div className="text-sm text-slate-600">Capacity</div>
                      <div className="font-medium">{listing.capacity}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 text-green-600 font-bold">₹</div>
                    <div>
                      <div className="text-sm text-slate-600">Asking Price</div>
                      <div className="font-medium">₹{listing.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{listing.views}</div>
                    <div className="text-sm text-slate-600">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{listing.inquiries}</div>
                    <div className="text-sm text-slate-600">Inquiries</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>

                  {listing.status === "active" && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}

                  {listing.status === "expired" && (
                    <Button size="sm" className="flex-1">
                      Relist Trip
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Truck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No listings found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't created any trip listings yet"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/dashboard/truck-owner/list-trip">
                  <Button>Create Your First Listing</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
