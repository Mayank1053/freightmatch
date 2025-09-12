"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PaymentModal } from "@/components/payment/payment-modal"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Search, Package, Star, Phone, Filter, Clock, Truck, Shield, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock truck data
const mockTrucks = [
  {
    id: "1",
    owner: {
      name: "Rajesh Kumar",
      company: "Kumar Transport",
      rating: 4.8,
      completedTrips: 156,
      phone: "+91 9876543210",
      verified: true,
      responseTime: "2 mins",
    },
    route: "Mumbai → Pune",
    departureDate: "2024-01-20",
    vehicleType: "Open Body Truck",
    capacity: "10 Tons",
    price: 15000,
    negotiable: true,
    distance: "148 km",
    estimatedTime: "3 hours",
    features: ["GPS Tracking", "Insurance Covered", "24/7 Support"],
    availability: "Available Now",
    lastSeen: "Online",
  },
  {
    id: "2",
    owner: {
      name: "Singh Logistics",
      company: "Singh Logistics Pvt Ltd",
      rating: 4.5,
      completedTrips: 89,
      phone: "+91 9876543211",
      verified: true,
      responseTime: "5 mins",
    },
    route: "Mumbai → Pune",
    departureDate: "2024-01-21",
    vehicleType: "Closed Container",
    capacity: "15 Tons",
    price: 18000,
    negotiable: false,
    distance: "148 km",
    estimatedTime: "3 hours",
    features: ["Temperature Control", "Security Lock", "Insurance"],
    availability: "Available Tomorrow",
    lastSeen: "2 hours ago",
  },
  {
    id: "3",
    owner: {
      name: "South Express",
      company: "South Express Transport",
      rating: 4.6,
      completedTrips: 203,
      phone: "+91 9876543212",
      verified: true,
      responseTime: "1 min",
    },
    route: "Mumbai → Nashik",
    departureDate: "2024-01-19",
    vehicleType: "Refrigerated Truck",
    capacity: "8 Tons",
    price: 22000,
    negotiable: true,
    distance: "165 km",
    estimatedTime: "4 hours",
    features: ["Refrigeration", "Real-time Monitoring", "Premium Service"],
    availability: "Available Now",
    lastSeen: "Online",
  },
]

export default function SearchTrucksPage() {
  const [searchForm, setSearchForm] = useState({
    origin: "",
    destination: "",
    date: "",
    cargoWeight: "",
    cargoType: "",
  })

  const [filters, setFilters] = useState({
    vehicleType: "all",
    priceRange: "all",
    sortBy: "price",
    availability: "all",
    rating: "all",
  })

  const [showFilters, setShowFilters] = useState(false)
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    selectedTruck: null as (typeof mockTrucks)[0] | null,
  })

  const [viewDetailsModal, setViewDetailsModal] = useState({
    isOpen: false,
    selectedTruck: null as (typeof mockTrucks)[0] | null,
  })

  const { toast } = useToast()
  const router = useRouter()

  const handleSearchChange = (field: string, value: string) => {
    setSearchForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchForm.origin || !searchForm.destination) {
      toast({
        title: "Missing Information",
        description: "Please enter pickup and drop locations",
        variant: "destructive",
      })
      return
    }

    console.log("Search:", searchForm, filters)
    toast({
      title: "Search Updated",
      description: "Showing trucks matching your criteria",
    })
  }

  const handleBookTruck = (truckId: string) => {
    const selectedTruck = mockTrucks.find((truck) => truck.id === truckId)
    if (selectedTruck) {
      setPaymentModal({
        isOpen: true,
        selectedTruck,
      })
    }
  }

  const handleViewDetails = (truckId: string) => {
    const selectedTruck = mockTrucks.find((truck) => truck.id === truckId)
    if (selectedTruck) {
      setViewDetailsModal({
        isOpen: true,
        selectedTruck,
      })
    }
  }

  const handlePaymentSuccess = (paymentId: string) => {
    toast({
      title: "Booking Confirmed!",
      description: `Your truck has been booked successfully. Payment ID: ${paymentId}`,
    })

    setTimeout(() => {
      router.push("/dashboard/shipper/shipments")
    }, 2000)
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

  const filteredTrucks = mockTrucks.filter((truck) => {
    if (filters.vehicleType !== "all" && !truck.vehicleType.toLowerCase().includes(filters.vehicleType)) {
      return false
    }
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number)
      if (max && (truck.price < min || truck.price > max)) return false
      if (!max && truck.price < min) return false
    }
    if (filters.rating !== "all") {
      const minRating = Number.parseFloat(filters.rating)
      if (truck.owner.rating < minRating) return false
    }
    if (filters.availability !== "all") {
      if (filters.availability === "now" && !truck.availability.includes("Now")) return false
    }
    return true
  })

  const sortedTrucks = [...filteredTrucks].sort((a, b) => {
    switch (filters.sortBy) {
      case "price":
        return a.price - b.price
      case "rating":
        return b.owner.rating - a.owner.rating
      case "date":
        return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
      case "response":
        return Number.parseInt(a.owner.responseTime) - Number.parseInt(b.owner.responseTime)
      default:
        return 0
    }
  })

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
            <h1 className="text-3xl font-bold text-slate-900">Search Trucks</h1>
            <p className="text-slate-600">Find available trucks for your cargo</p>
          </div>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Search Criteria
            </CardTitle>
            <CardDescription>Enter your shipment details to find matching trucks</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Pickup Location *</Label>
                  <Input
                    id="origin"
                    placeholder="e.g., Mumbai"
                    value={searchForm.origin}
                    onChange={(e) => handleSearchChange("origin", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Drop Location *</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Pune"
                    value={searchForm.destination}
                    onChange={(e) => handleSearchChange("destination", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date (Optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={searchForm.date}
                    onChange={(e) => handleSearchChange("date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargoWeight">Cargo Weight (Optional)</Label>
                  <Select
                    value={searchForm.cargoWeight}
                    onValueChange={(value) => handleSearchChange("cargoWeight", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Weight</SelectItem>
                      <SelectItem value="1-3">1-3 Tons</SelectItem>
                      <SelectItem value="3-7">3-7 Tons</SelectItem>
                      <SelectItem value="7-15">7-15 Tons</SelectItem>
                      <SelectItem value="15-25">15-25 Tons</SelectItem>
                      <SelectItem value="25+">25+ Tons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargoType">Cargo Type (Optional)</Label>
                  <Select
                    value={searchForm.cargoType}
                    onValueChange={(value) => handleSearchChange("cargoType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cargo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Type</SelectItem>
                      <SelectItem value="general">General Cargo</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="food">Food Items</SelectItem>
                      <SelectItem value="automotive">Automotive Parts</SelectItem>
                      <SelectItem value="chemicals">Chemicals</SelectItem>
                      <SelectItem value="construction">Construction Materials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Search Trucks
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Enhanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Select
                      value={filters.vehicleType}
                      onValueChange={(value) => handleFilterChange("vehicleType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="open-body">Open Body</SelectItem>
                        <SelectItem value="closed-container">Closed Container</SelectItem>
                        <SelectItem value="refrigerated">Refrigerated</SelectItem>
                        <SelectItem value="flatbed">Flatbed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <Select
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange("priceRange", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="0-10000">₹0 - ₹10,000</SelectItem>
                        <SelectItem value="10000-20000">₹10,000 - ₹20,000</SelectItem>
                        <SelectItem value="20000-50000">₹20,000 - ₹50,000</SelectItem>
                        <SelectItem value="50000">₹50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Rating</Label>
                    <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        <SelectItem value="4.0">4.0+ Stars</SelectItem>
                        <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Select
                      value={filters.availability}
                      onValueChange={(value) => handleFilterChange("availability", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="now">Available Now</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sort By</Label>
                    <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price (Low to High)</SelectItem>
                        <SelectItem value="rating">Rating (High to Low)</SelectItem>
                        <SelectItem value="date">Departure Date</SelectItem>
                        <SelectItem value="response">Response Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Trucks ({sortedTrucks.length})</h2>
            <div className="text-sm text-slate-600">
              Showing {sortedTrucks.length} of {mockTrucks.length} trucks
            </div>
          </div>

          {sortedTrucks.map((truck) => (
            <Card key={truck.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Truck Owner Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Truck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-lg">{truck.owner.name}</div>
                          {truck.owner.verified && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant={truck.lastSeen === "Online" ? "default" : "secondary"} className="text-xs">
                            {truck.lastSeen}
                          </Badge>
                        </div>
                        <div className="text-slate-600">{truck.owner.company}</div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{truck.owner.rating}</span>
                          </div>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-600">{truck.owner.completedTrips} trips</span>
                          <span className="text-slate-400">•</span>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Clock className="h-3 w-3" />
                            {truck.owner.responseTime} response
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{truck.price.toLocaleString()}</div>
                      <div className="flex gap-1 mt-1">
                        {truck.negotiable && (
                          <Badge variant="outline" className="text-xs">
                            Negotiable
                          </Badge>
                        )}
                        <Badge
                          variant={truck.availability.includes("Now") ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {truck.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="text-sm text-slate-600">Route</div>
                      <div className="font-medium">{truck.route}</div>
                      <div className="text-xs text-slate-500">
                        {truck.distance} • {truck.estimatedTime}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Departure</div>
                      <div className="font-medium">{truck.departureDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Vehicle Type</div>
                      <div className="font-medium">{truck.vehicleType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Capacity</div>
                      <div className="font-medium">{truck.capacity}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {truck.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button onClick={() => handleBookTruck(truck.id)} className="flex-1">
                      <Package className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                    <Button variant="outline" className="bg-transparent" onClick={() => handleViewDetails(truck.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => handleCall(truck.owner.phone, truck.owner.name)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedTrucks.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No trucks found</h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search criteria or check back later for new listings
              </p>
              <Link href="/dashboard/shipper/post-requirement">
                <Button>Post Your Requirement</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Payment Modal */}
        {paymentModal.selectedTruck && (
          <PaymentModal
            isOpen={paymentModal.isOpen}
            onClose={() => setPaymentModal({ isOpen: false, selectedTruck: null })}
            bookingDetails={{
              route: paymentModal.selectedTruck.route,
              trucker: paymentModal.selectedTruck.owner.name,
              amount: paymentModal.selectedTruck.price,
              bookingId: `BK${Date.now()}`,
            }}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {viewDetailsModal.selectedTruck && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Truck Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewDetailsModal({ isOpen: false, selectedTruck: null })}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-6">
                {/* Owner Details */}
                <div>
                  <h4 className="font-medium mb-3">Owner Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Name:</span>
                      <div className="font-medium">{viewDetailsModal.selectedTruck.owner.name}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Company:</span>
                      <div className="font-medium">{viewDetailsModal.selectedTruck.owner.company}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Rating:</span>
                      <div className="font-medium flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {viewDetailsModal.selectedTruck.owner.rating}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600">Completed Trips:</span>
                      <div className="font-medium">{viewDetailsModal.selectedTruck.owner.completedTrips}</div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div>
                  <h4 className="font-medium mb-3">Vehicle Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Type:</span>
                      <div className="font-medium">{viewDetailsModal.selectedTruck.vehicleType}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Capacity:</span>
                      <div className="font-medium">{viewDetailsModal.selectedTruck.capacity}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Route:</span>
                      <div className="font-medium">{viewDetailsModal.selectedTruck.route}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Distance:</span>
                      <div className="font-medium">{viewDetailsModal.selectedTruck.distance}</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-medium mb-3">Features & Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewDetailsModal.selectedTruck.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="font-medium mb-3">Pricing</h4>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{viewDetailsModal.selectedTruck.price.toLocaleString()}
                  </div>
                  {viewDetailsModal.selectedTruck.negotiable && (
                    <div className="text-sm text-slate-600">Price is negotiable</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={() => handleBookTruck(viewDetailsModal.selectedTruck!.id)} className="flex-1">
                    Book This Truck
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleCall(
                        viewDetailsModal.selectedTruck!.owner.phone,
                        viewDetailsModal.selectedTruck!.owner.name,
                      )
                    }
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
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
