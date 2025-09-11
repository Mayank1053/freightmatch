"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin, Calendar, Truck, Edit, Trash2, Eye, Search, Plus, X } from "lucide-react"
import Link from "next/link"

// Mock listings data
const mockListings = [
  {
    id: "1",
    route: "Chennai → Coimbatore",
    origin: "Chennai",
    destination: "Coimbatore",
    viaCities: ["Salem"],
    date: "2024-01-20",
    capacity: "10 Tons",
    vehicleType: "Open Body Truck",
    loadType: "general",
    price: 15000,
    status: "active",
    views: 12,
    inquiries: 3,
    createdAt: "2024-01-12",
    notes: "Prefer general cargo, flexible on timing",
  },
  {
    id: "2",
    route: "Kolkata → Bhubaneswar",
    origin: "Kolkata",
    destination: "Bhubaneswar",
    viaCities: [],
    date: "2024-01-18",
    capacity: "15 Tons",
    vehicleType: "Closed Container",
    loadType: "electronics",
    price: 18000,
    status: "active",
    views: 8,
    inquiries: 1,
    createdAt: "2024-01-10",
    notes: "",
  },
  {
    id: "3",
    route: "Mumbai → Nashik",
    origin: "Mumbai",
    destination: "Nashik",
    viaCities: ["Thane", "Kalyan"],
    date: "2024-01-08",
    capacity: "8 Tons",
    vehicleType: "Open Body Truck",
    loadType: "any",
    price: 12000,
    status: "expired",
    views: 25,
    inquiries: 5,
    createdAt: "2024-01-01",
    notes: "Can pick up from multiple locations in Mumbai",
  },
]

export default function ListingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [listings, setListings] = useState(mockListings)
  const [selectedListing, setSelectedListing] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [newViaCity, setNewViaCity] = useState("")
  const { toast } = useToast()

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.viaCities.some((city) => city.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleViewDetails = (listing: any) => {
    setSelectedListing(listing)
    setShowDetails(true)
  }

  const handleEditListing = (listing: any) => {
    setSelectedListing(listing)
    setEditData({
      ...listing,
      viaCities: [...listing.viaCities],
    })
    setShowEdit(true)
  }

  const addViaCity = () => {
    if (newViaCity.trim() && !editData.viaCities.includes(newViaCity.trim())) {
      setEditData((prev) => ({
        ...prev,
        viaCities: [...prev.viaCities, newViaCity.trim()],
      }))
      setNewViaCity("")
    }
  }

  const removeViaCity = (cityToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      viaCities: prev.viaCities.filter((city) => city !== cityToRemove),
    }))
  }

  const handleSaveEdit = () => {
    if (selectedListing.status === "active" && listings.find((l) => l.id === selectedListing.id)) {
      // Editing existing listing
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === selectedListing.id ? { ...listing, ...editData, route: getRouteDisplay(editData) } : listing,
        ),
      )
      toast({
        title: "Listing Updated",
        description: "Your trip listing has been updated successfully.",
      })
    } else {
      // Creating new listing (relist case)
      const newListing = {
        ...editData,
        route: getRouteDisplay(editData),
      }
      setListings((prev) => [newListing, ...prev])
      toast({
        title: "Trip Relisted",
        description: "Your trip has been successfully relisted and is now active.",
      })
    }

    setShowEdit(false)
    setSelectedListing(null)
    setEditData({})
  }

  const handleDeleteListing = (listing: any) => {
    setSelectedListing(listing)
    setShowDelete(true)
  }

  const confirmDelete = () => {
    setListings((prev) => prev.filter((listing) => listing.id !== selectedListing.id))

    toast({
      title: "Listing Deleted",
      description: "Your trip listing has been removed successfully.",
    })

    setShowDelete(false)
    setSelectedListing(null)
  }

  const handleRelistTrip = (listing: any) => {
    const newListing = {
      ...listing,
      id: `${Date.now()}`, // Generate new ID
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      date: "", // User will need to set new date
      views: 0,
      inquiries: 0,
    }

    setSelectedListing(newListing)
    setEditData({
      ...newListing,
      viaCities: [...newListing.viaCities],
    })
    setShowEdit(true)

    toast({
      title: "Relisting Trip",
      description: "Update the details for your relisted trip and save to make it active.",
    })
  }

  const getRouteDisplay = (listing: any) => {
    return listing.viaCities && listing.viaCities.length > 0
      ? `${listing.origin} → ${listing.viaCities.join(" → ")} → ${listing.destination}`
      : `${listing.origin} → ${listing.destination}`
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
                      {getRouteDisplay(listing)}
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleViewDetails(listing)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>

                  {listing.status === "active" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditListing(listing)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDeleteListing(listing)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}

                  {listing.status === "expired" && (
                    <Button size="sm" className="flex-1" onClick={() => handleRelistTrip(listing)}>
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

        {/* View Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Listing Details
              </DialogTitle>
              <DialogDescription>Complete information about your trip listing</DialogDescription>
            </DialogHeader>

            {selectedListing && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Route Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-600">Origin:</span> {selectedListing.origin}
                      </div>
                      <div>
                        <span className="text-slate-600">Destination:</span> {selectedListing.destination}
                      </div>
                      {selectedListing.viaCities.length > 0 && (
                        <div>
                          <span className="text-slate-600">Via Cities:</span> {selectedListing.viaCities.join(", ")}
                        </div>
                      )}
                      <div>
                        <span className="text-slate-600">Date:</span> {selectedListing.date}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Vehicle Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-600">Type:</span> {selectedListing.vehicleType}
                      </div>
                      <div>
                        <span className="text-slate-600">Capacity:</span> {selectedListing.capacity}
                      </div>
                      <div>
                        <span className="text-slate-600">Load Type:</span> {selectedListing.loadType || "Any"}
                      </div>
                      <div>
                        <span className="text-slate-600">Price:</span> ₹{selectedListing.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedListing.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Additional Notes</h4>
                    <p className="text-sm text-slate-600">{selectedListing.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedListing.views}</div>
                    <div className="text-sm text-slate-600">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedListing.inquiries}</div>
                    <div className="text-sm text-slate-600">Inquiries Received</div>
                  </div>
                </div>

                <Button onClick={() => setShowDetails(false)} className="w-full">
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Edit Listing
              </DialogTitle>
              <DialogDescription>Update your trip listing details</DialogDescription>
            </DialogHeader>

            {editData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Origin City</Label>
                    <Input
                      value={editData.origin || ""}
                      onChange={(e) => setEditData((prev) => ({ ...prev, origin: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Destination City</Label>
                    <Input
                      value={editData.destination || ""}
                      onChange={(e) => setEditData((prev) => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Via Cities</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a city along the route..."
                      value={newViaCity}
                      onChange={(e) => setNewViaCity(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addViaCity())}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addViaCity} disabled={!newViaCity.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {editData.viaCities && editData.viaCities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editData.viaCities.map((city, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {city}
                          <button type="button" onClick={() => removeViaCity(city)} className="ml-1 hover:text-red-600">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editData.date || ""}
                      onChange={(e) => setEditData((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={editData.price || ""}
                      onChange={(e) => setEditData((prev) => ({ ...prev, price: Number.parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={editData.notes || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setShowEdit(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit} className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDelete} onOpenChange={setShowDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Delete Listing
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this listing? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {selectedListing && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium">{getRouteDisplay(selectedListing)}</p>
                  <p className="text-sm text-slate-600">Travel Date: {selectedListing.date}</p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setShowDelete(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={confirmDelete} variant="destructive" className="flex-1">
                    Delete Listing
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
