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
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Package, MapPin, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

export default function PostRequirementPage() {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    flexibleDate: false,
    cargoType: "",
    cargoWeight: "",
    cargoDescription: "",
    vehicleType: "",
    budget: "",
    urgency: "",
    specialRequirements: "",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit requirement
    console.log("Requirement posted:", formData)
  }

  return (
    <ProtectedRoute allowedRoles={["shipper"]}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/shipper">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Post Freight Requirement</h1>
            <p className="text-slate-600">Let truck owners know about your shipping needs</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Freight Details
            </CardTitle>
            <CardDescription>Provide detailed information about your cargo and requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Pickup & Drop Locations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input
                      id="pickupLocation"
                      placeholder="e.g., Mumbai, Maharashtra"
                      value={formData.pickupLocation}
                      onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dropLocation">Drop Location</Label>
                    <Input
                      id="dropLocation"
                      placeholder="e.g., Pune, Maharashtra"
                      value={formData.dropLocation}
                      onChange={(e) => handleInputChange("dropLocation", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Schedule
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Preferred Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flexibleDate"
                      checked={formData.flexibleDate}
                      onCheckedChange={(checked) => handleInputChange("flexibleDate", checked as boolean)}
                    />
                    <Label htmlFor="flexibleDate" className="text-sm">
                      I'm flexible with the pickup date (±2 days)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Cargo Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Cargo Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargoType">Cargo Type</Label>
                    <Select
                      value={formData.cargoType}
                      onValueChange={(value) => handleInputChange("cargoType", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cargo type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Cargo</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="textiles">Textiles</SelectItem>
                        <SelectItem value="food">Food Items</SelectItem>
                        <SelectItem value="automotive">Automotive Parts</SelectItem>
                        <SelectItem value="chemicals">Chemicals</SelectItem>
                        <SelectItem value="construction">Construction Materials</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="machinery">Machinery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cargoWeight">Cargo Weight</Label>
                    <Select
                      value={formData.cargoWeight}
                      onValueChange={(value) => handleInputChange("cargoWeight", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select weight range" />
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
                  <Label htmlFor="cargoDescription">Cargo Description</Label>
                  <Textarea
                    id="cargoDescription"
                    placeholder="Describe your cargo in detail (dimensions, packaging, handling requirements, etc.)"
                    value={formData.cargoDescription}
                    onChange={(e) => handleInputChange("cargoDescription", e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Vehicle & Budget */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Requirements & Budget
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Preferred Vehicle Type</Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value) => handleInputChange("vehicleType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Vehicle Type</SelectItem>
                        <SelectItem value="open-body">Open Body Truck</SelectItem>
                        <SelectItem value="closed-container">Closed Container</SelectItem>
                        <SelectItem value="refrigerated">Refrigerated Truck</SelectItem>
                        <SelectItem value="flatbed">Flatbed Truck</SelectItem>
                        <SelectItem value="tanker">Tanker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range (₹)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="e.g., 15000"
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => handleInputChange("urgency", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait 3-5 days</SelectItem>
                      <SelectItem value="medium">Medium - Need within 2-3 days</SelectItem>
                      <SelectItem value="high">High - Need within 24 hours</SelectItem>
                      <SelectItem value="urgent">Urgent - Need immediately</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="space-y-2">
                <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="Any special handling, insurance, or delivery requirements..."
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Post Requirement
                </Button>
                <Link href="/dashboard/shipper">
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
