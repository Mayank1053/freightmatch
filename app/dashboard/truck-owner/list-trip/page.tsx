"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin, Calendar, Truck, DollarSign, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ListTripPage() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    viaCities: [] as string[],
    departureDate: "",
    returnDate: "",
    vehicleType: "",
    capacity: "",
    loadType: "",
    price: "",
    notes: "",
  })
  const [newViaCity, setNewViaCity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showListing, setShowListing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addViaCity = () => {
    if (newViaCity.trim() && !formData.viaCities.includes(newViaCity.trim())) {
      setFormData((prev) => ({
        ...prev,
        viaCities: [...prev.viaCities, newViaCity.trim()],
      }))
      setNewViaCity("")
    }
  }

  const removeViaCity = (cityToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      viaCities: prev.viaCities.filter((city) => city !== cityToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Trip Listed Successfully!",
        description: "Your empty return trip has been listed and is now visible to shippers.",
      })

      setShowListing(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to list your trip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addViaCity()
    }
  }

  if (showListing) {
    const routeDisplay =
      formData.viaCities.length > 0
        ? `${formData.origin} → ${formData.viaCities.join(" → ")} → ${formData.destination}`
        : `${formData.origin} → ${formData.destination}`

    return (
      <ProtectedRoute allowedRoles={["truck-owner"]}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Truck className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Trip Listed Successfully!</h1>
            <p className="text-slate-600">Your empty return trip is now live and visible to shippers</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Your New Listing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-slate-600">Route</Label>
                  <p className="font-medium">{routeDisplay}</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-600">Departure Date</Label>
                  <p className="font-medium">{formData.departureDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-600">Vehicle Type</Label>
                  <p className="font-medium">{formData.vehicleType.replace("-", " ")}</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-600">Capacity</Label>
                  <p className="font-medium">{formData.capacity} Tons</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-600">Price</Label>
                  <p className="font-medium text-green-600">₹{Number.parseInt(formData.price).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-600">Load Type</Label>
                  <p className="font-medium">{formData.loadType || "Any"}</p>
                </div>
              </div>

              {formData.notes && (
                <div>
                  <Label className="text-sm text-slate-600">Notes</Label>
                  <p className="text-sm">{formData.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={() => router.push("/dashboard/truck-owner/listings")} className="flex-1">
                  View All Listings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowListing(false)
                    setFormData({
                      origin: "",
                      destination: "",
                      viaCities: [],
                      departureDate: "",
                      returnDate: "",
                      vehicleType: "",
                      capacity: "",
                      loadType: "",
                      price: "",
                      notes: "",
                    })
                  }}
                  className="flex-1"
                >
                  List Another Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["truck-owner"]}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/truck-owner">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">List Empty Return Trip</h1>
            <p className="text-slate-600">Create a new listing for your empty return journey</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Trip Details
            </CardTitle>
            <CardDescription>
              Provide details about your empty return trip to attract potential shippers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Route Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Route Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin City</Label>
                    <Input
                      id="origin"
                      placeholder="e.g., Mumbai"
                      value={formData.origin}
                      onChange={(e) => handleInputChange("origin", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination City</Label>
                    <Input
                      id="destination"
                      placeholder="e.g., Pune"
                      value={formData.destination}
                      onChange={(e) => handleInputChange("destination", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Via Cities (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a city along the route..."
                      value={newViaCity}
                      onChange={(e) => setNewViaCity(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addViaCity} disabled={!newViaCity.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.viaCities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.viaCities.map((city, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {city}
                          <button type="button" onClick={() => removeViaCity(city)} className="ml-1 hover:text-red-600">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-slate-600">
                    Add cities along your route to attract more shippers with partial loads
                  </p>
                </div>
              </div>

              {/* Date Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Schedule
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Departure Date</Label>
                    <Input
                      id="departureDate"
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => handleInputChange("departureDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Return Date (Optional)</Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => handleInputChange("returnDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Vehicle Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value) => handleInputChange("vehicleType", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open-body">Open Body Truck</SelectItem>
                        <SelectItem value="closed-container">Closed Container</SelectItem>
                        <SelectItem value="refrigerated">Refrigerated Truck</SelectItem>
                        <SelectItem value="flatbed">Flatbed Truck</SelectItem>
                        <SelectItem value="tanker">Tanker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Load Capacity</Label>
                    <Select
                      value={formData.capacity}
                      onValueChange={(value) => handleInputChange("capacity", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 Tons</SelectItem>
                        <SelectItem value="3-7">3-7 Tons</SelectItem>
                        <SelectItem value="7-15">7-15 Tons</SelectItem>
                        <SelectItem value="15-25">15-25 Tons</SelectItem>
                        <SelectItem value="25+">25+ Tons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loadType">Preferred Load Type</Label>
                  <Select value={formData.loadType} onValueChange={(value) => handleInputChange("loadType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any load type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Load Type</SelectItem>
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

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Pricing
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="price">Asking Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 15000"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                  <p className="text-sm text-slate-600">
                    Set a competitive price for your return trip. Shippers can negotiate.
                  </p>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements, preferred routes, or additional information..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Listing Trip..." : "List Trip"}
                </Button>
                <Link href="/dashboard/truck-owner">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
