"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Truck,
  ArrowLeft,
  Search,
  MapPin,
  Phone,
  MessageCircle,
  Package,
  Check,
  X,
  Eye,
  FileText,
  Star,
  Download,
} from "lucide-react"
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
  const [bookings, setBookings] = useState(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showInvoice, setShowInvoice] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [ratingComment, setRatingComment] = useState("")
  const [showTripDetails, setShowTripDetails] = useState(false)
  const [showStartTrip, setShowStartTrip] = useState(false)
  const { toast } = useToast()

  const filteredBookings = bookings.filter((booking) => {
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
      case "in-transit":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAcceptBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "confirmed" } : booking)),
    )

    toast({
      title: "Booking Accepted",
      description: "You have successfully accepted the booking request. The shipper has been notified.",
    })
  }

  const handleDeclineBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)),
    )

    toast({
      title: "Booking Declined",
      description: "The booking request has been declined. The shipper has been notified.",
      variant: "destructive",
    })
  }

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, "_self")
  }

  const handleViewInvoice = (booking: any) => {
    setSelectedBooking(booking)
    setShowInvoice(true)
  }

  const handleRateShipper = (booking: any) => {
    setSelectedBooking(booking)
    setShowRating(true)
    setRating(0)
    setRatingComment("")
  }

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking)
    setShowTripDetails(true)
  }

  const handleStartTrip = (booking: any) => {
    setSelectedBooking(booking)
    setShowStartTrip(true)
  }

  const confirmStartTrip = () => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === selectedBooking?.id
          ? { ...booking, status: "in-transit", startedAt: new Date().toISOString() }
          : booking,
      ),
    )

    toast({
      title: "Trip Started",
      description: `Trip for ${selectedBooking?.route} has been started. Safe travels!`,
    })

    setShowStartTrip(false)
    setSelectedBooking(null)
  }

  const submitRating = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Rating Submitted",
      description: `You rated ${selectedBooking?.shipper.name} ${rating} stars. Thank you for your feedback!`,
    })

    setShowRating(false)
    setRating(0)
    setRatingComment("")
  }

  const confirmCompleteTrip = (bookingId: string, routeForToast?: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "completed", completedAt: new Date().toISOString() }
          : booking,
      ),
    )

    toast({
      title: "Trip Completed",
      description: `Trip for ${routeForToast ?? "this route"} has been marked as completed successfully.`,
    })

    // Clear any previously selected booking if it matches the completed one
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking(null)
    }
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
                  <SelectItem value="in-transit">In Transit</SelectItem>
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
                    <Button variant="outline" size="sm" onClick={() => handleCall(booking.shipper.phone)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
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
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button className="flex-1" onClick={() => handleStartTrip(booking)}>
                      Start Trip
                    </Button>
                  </div>
                )}

                {booking.status === "in-transit" && (
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 bg-blue-50 text-blue-700 border-blue-200">
                      Trip In Progress
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1">Complete Trip</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Complete Trip</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to mark this trip as completed? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">Trip Summary</h4>
                            <div className="text-sm text-green-700 space-y-1">
                              <p>Route: {booking.route}</p>
                              <p>Shipper: {booking.shipper.name}</p>
                              <p>
                                Cargo: {booking.cargo.type} ({booking.cargo.weight})
                              </p>
                              <p>Amount: ₹{booking.amount.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                className="flex-1 bg-transparent"
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => confirmCompleteTrip(booking.id, booking.route)}
                              >
                                Complete Trip
                              </Button>
                            </DialogClose>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewInvoice(booking)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Invoice
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleRateShipper(booking)}
                    >
                      <Star className="h-4 w-4 mr-2" />
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

        {/* Invoice Dialog */}
        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Invoice Details
              </DialogTitle>
              <DialogDescription>Invoice for booking #{selectedBooking?.id}</DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start p-6 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold">FreightMatch Invoice</h3>
                    <p className="text-sm text-slate-600">Invoice #INV-{selectedBooking.id}-2024</p>
                    <p className="text-sm text-slate-600">Date: {selectedBooking.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Status</p>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Trip Details</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-slate-600">Route:</span> {selectedBooking.route}
                      </p>
                      <p>
                        <span className="text-slate-600">Date:</span> {selectedBooking.date}
                      </p>
                      <p>
                        <span className="text-slate-600">Cargo:</span> {selectedBooking.cargo.type}
                      </p>
                      <p>
                        <span className="text-slate-600">Weight:</span> {selectedBooking.cargo.weight}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Shipper Details</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-slate-600">Name:</span> {selectedBooking.shipper.name}
                      </p>
                      <p>
                        <span className="text-slate-600">Company:</span> {selectedBooking.shipper.company}
                      </p>
                      <p>
                        <span className="text-slate-600">Phone:</span> {selectedBooking.shipper.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Payment Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Freight Amount:</span>
                      <span>₹{selectedBooking.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee (5%):</span>
                      <span>-₹{Math.round(selectedBooking.amount * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Net Amount Received:</span>
                      <span className="text-green-600">
                        ₹{Math.round(selectedBooking.amount * 0.95).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowInvoice(false)}>
                    Close
                  </Button>
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Rating Dialog */}
        <Dialog open={showRating} onOpenChange={setShowRating}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Rate Shipper
              </DialogTitle>
              <DialogDescription>How was your experience with {selectedBooking?.shipper.name}?</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 rounded transition-colors ${
                        star <= rating ? "text-yellow-500" : "text-slate-300 hover:text-yellow-400"
                      }`}
                    >
                      <Star className={`h-8 w-8 ${star <= rating ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-slate-600">
                    {rating === 1 && "Poor - Had significant issues"}
                    {rating === 2 && "Fair - Below expectations"}
                    {rating === 3 && "Good - Met expectations"}
                    {rating === 4 && "Very Good - Exceeded expectations"}
                    {rating === 5 && "Excellent - Outstanding experience"}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment">Comments (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this shipper..."
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowRating(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={submitRating}>
                  Submit Rating
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Trip Details Dialog */}
        <Dialog open={showTripDetails} onOpenChange={setShowTripDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Trip Details
              </DialogTitle>
              <DialogDescription>Complete information about your confirmed booking</DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-6">
                {/* Trip Overview */}
                <div className="p-6 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-900">Trip Overview</h3>
                    <Badge className="bg-blue-100 text-blue-800">CONFIRMED</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Route:</span>
                      <p className="text-blue-900">{selectedBooking.route}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Travel Date:</span>
                      <p className="text-blue-900">{selectedBooking.date}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Booking ID:</span>
                      <p className="text-blue-900">#{selectedBooking.id}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Amount:</span>
                      <p className="text-blue-900 font-semibold">₹{selectedBooking.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Shipper Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Shipper Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-600">Name:</span>
                        <p className="font-medium">{selectedBooking.shipper.name}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Company:</span>
                        <p>{selectedBooking.shipper.company}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Phone:</span>
                        <p>{selectedBooking.shipper.phone}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Rating:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{selectedBooking.shipper.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Cargo Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-600">Type:</span>
                        <p className="font-medium">{selectedBooking.cargo.type}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Weight:</span>
                        <p>{selectedBooking.cargo.weight}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Description:</span>
                        <p>{selectedBooking.cargo.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleCall(selectedBooking.shipper.phone)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Shipper
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowTripDetails(false)}>
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setShowTripDetails(false)
                      handleStartTrip(selectedBooking)
                    }}
                  >
                    Start Trip
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Start Trip Confirmation Dialog */}
        <Dialog open={showStartTrip} onOpenChange={setShowStartTrip}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                Start Trip
              </DialogTitle>
              <DialogDescription>
                Are you ready to start this trip? This will notify the shipper and begin tracking.
              </DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">{selectedBooking.route}</span>
                  </div>
                  <div className="text-sm text-green-700">
                    <p>Shipper: {selectedBooking.shipper.name}</p>
                    <p>
                      Cargo: {selectedBooking.cargo.type} ({selectedBooking.cargo.weight})
                    </p>
                    <p>Amount: ₹{selectedBooking.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What happens when you start the trip:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Shipper will be notified that the trip has started</li>
                    <li>• Live tracking will begin for the shipper</li>
                    <li>• Trip status will change to "In Transit"</li>
                    <li>• You can update progress and communicate with shipper</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowStartTrip(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={confirmStartTrip}>
                    Start Trip
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
