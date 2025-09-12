"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Truck,
  Package,
  Send,
  Navigation,
  Fuel,
  Thermometer,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default function TrackShipmentPage({ params }: { params: { id: string } }) {
  const shipmentId = params.id
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Mock data - replace with real API calls
  const shipment = {
    id: shipmentId,
    status: "in_transit",
    pickup: "Mumbai, Maharashtra",
    delivery: "Delhi, NCR",
    driver: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      rating: 4.8,
      avatar: "/indian-truck-driver.jpg",
      license: "MH1234567890",
      experience: "8 years",
    },
    truck: {
      number: "MH 12 AB 1234",
      type: "Container Truck",
      capacity: "20 Tons",
      model: "Tata Prima 2518.K",
      year: "2020",
      fuelLevel: 75,
      temperature: 22, // for refrigerated trucks
      speed: 65,
      lastMaintenance: "2024-01-01",
    },
    timeline: [
      { status: "booked", time: "2024-01-15 10:00", completed: true, description: "Booking confirmed" },
      {
        status: "pickup_confirmed",
        time: "2024-01-15 14:30",
        completed: true,
        description: "Cargo picked up from Mumbai",
      },
      { status: "in_transit", time: "2024-01-15 16:00", completed: true, description: "Journey started towards Delhi" },
      { status: "delivered", time: "Expected: 2024-01-16 18:00", completed: false, description: "Delivery to Delhi" },
    ],
    currentLocation: {
      lat: 19.076,
      lng: 72.8777,
      address: "Near Pune, Maharashtra",
      lastUpdated: "2 minutes ago",
    },
    estimatedArrival: "2024-01-16 18:00",
    totalDistance: 450,
    coveredDistance: 245,
    alerts: [
      { type: "info", message: "Driver took a scheduled break", time: "30 mins ago" },
      { type: "warning", message: "Heavy traffic ahead", time: "1 hour ago" },
    ],
    cargo: {
      type: "Electronics",
      weight: "15 Tons",
      value: "₹5,00,000",
      description: "Consumer electronics and accessories",
    },
  }

  const messages = [
    {
      id: 1,
      sender: "driver",
      message: "Pickup completed successfully. Starting journey to Delhi.",
      time: "16:00",
      avatar: "/indian-truck-driver.jpg",
    },
    {
      id: 2,
      sender: "shipper",
      message: "Great! Please keep me updated on the progress.",
      time: "16:05",
      avatar: "/diverse-business-person.png",
    },
    {
      id: 3,
      sender: "driver",
      message: "Currently near Pune. Traffic is good, should reach on time.",
      time: "18:30",
      avatar: "/indian-truck-driver.jpg",
    },
  ]

  const handleCall = () => {
    window.open(`tel:${shipment.driver.phone}`, "_self")
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const progressPercentage = (shipment.coveredDistance / shipment.totalDistance) * 100

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/shipper/shipments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Live Tracking</h1>
            <p className="text-muted-foreground">Shipment ID: {shipmentId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Badge variant={shipment.status === "in_transit" ? "default" : "secondary"} className="text-sm">
            {shipment.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span className="font-medium">{shipment.pickup}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span className="font-medium">{shipment.delivery}</span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{shipment.coveredDistance} km covered</span>
              <span>{shipment.totalDistance - shipment.coveredDistance} km remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Tracking Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Live Location
                </div>
                <div className="text-sm text-slate-600">Updated {shipment.currentLocation.lastUpdated}</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
                <div className="relative z-10 text-center space-y-4">
                  <div className="bg-white rounded-full p-4 shadow-lg inline-block animate-pulse">
                    <Truck className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Current Location</p>
                    <p className="text-muted-foreground">{shipment.currentLocation.address}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Start</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Destination</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Stats */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-medium">ETA</p>
                  <p className="text-xs text-muted-foreground">{shipment.estimatedArrival}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Navigation className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <p className="text-sm font-medium">Speed</p>
                  <p className="text-xs text-muted-foreground">{shipment.truck.speed} km/h</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Fuel className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                  <p className="text-sm font-medium">Fuel</p>
                  <p className="text-xs text-muted-foreground">{shipment.truck.fuelLevel}%</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Thermometer className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                  <p className="text-sm font-medium">Temp</p>
                  <p className="text-xs text-muted-foreground">{shipment.truck.temperature}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Live Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shipment.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`p-1 rounded-full ${alert.type === "warning" ? "bg-orange-100" : "bg-blue-100"}`}>
                      {alert.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-slate-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Info */}
        <div className="space-y-6">
          {/* Driver Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Driver Information
                <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showDetails ? "Hide" : "Details"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={shipment.driver.avatar || "/placeholder.svg"} />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{shipment.driver.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{shipment.driver.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Truck Number:</span>
                  <span className="font-medium">{shipment.truck.number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vehicle Type:</span>
                  <span className="font-medium">{shipment.truck.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Capacity:</span>
                  <span className="font-medium">{shipment.truck.capacity}</span>
                </div>

                {showDetails && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Model:</span>
                      <span className="font-medium">{shipment.truck.model}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Year:</span>
                      <span className="font-medium">{shipment.truck.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>License:</span>
                      <span className="font-medium">{shipment.driver.license}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Experience:</span>
                      <span className="font-medium">{shipment.driver.experience}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={handleCall}>
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cargo Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Cargo Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <span className="font-medium">{shipment.cargo.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Weight:</span>
                <span className="font-medium">{shipment.cargo.weight}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Value:</span>
                <span className="font-medium">{shipment.cargo.value}</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-600">Description:</span>
                <p className="font-medium mt-1">{shipment.cargo.description}</p>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">Insurance Protected</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Shipment Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipment.timeline.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? "bg-green-600 text-white" : "bg-slate-200"
                    }`}
                  >
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < shipment.timeline.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${step.completed ? "bg-green-600" : "bg-slate-200"}`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{step.status.replace("_", " ").toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">{step.time}</p>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
