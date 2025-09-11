"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, MessageCircle, Clock, Truck, Package, Send } from "lucide-react"

export default function TrackShipmentPage({ params }: { params: { id: string } }) {
  const shipmentId = params.id

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
    },
    truck: {
      number: "MH 12 AB 1234",
      type: "Container Truck",
      capacity: "20 Tons",
    },
    timeline: [
      { status: "booked", time: "2024-01-15 10:00", completed: true },
      { status: "pickup_confirmed", time: "2024-01-15 14:30", completed: true },
      { status: "in_transit", time: "2024-01-15 16:00", completed: true },
      { status: "delivered", time: "Expected: 2024-01-16 18:00", completed: false },
    ],
    currentLocation: {
      lat: 19.076,
      lng: 72.8777,
      address: "Near Pune, Maharashtra",
    },
    estimatedArrival: "2024-01-16 18:00",
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Track Shipment</h1>
          <p className="text-muted-foreground">Shipment ID: {shipmentId}</p>
        </div>
        <Badge variant={shipment.status === "in_transit" ? "default" : "secondary"} className="text-sm">
          {shipment.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Tracking Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Live Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
                <div className="relative z-10 text-center space-y-4">
                  <div className="bg-white rounded-full p-4 shadow-lg inline-block">
                    <Truck className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Current Location</p>
                    <p className="text-muted-foreground">{shipment.currentLocation.address}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Pickup: {shipment.pickup}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Delivery: {shipment.delivery}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-medium">ETA</p>
                  <p className="text-xs text-muted-foreground">{shipment.estimatedArrival}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Package className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <p className="text-sm font-medium">Distance Covered</p>
                  <p className="text-xs text-muted-foreground">245 / 450 km</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Info & Chat */}
        <div className="space-y-6">
          {/* Driver Information */}
          <Card>
            <CardHeader>
              <CardTitle>Driver Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={shipment.driver.avatar || "/placeholder.svg"} />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{shipment.driver.name}</p>
                  <p className="text-sm text-muted-foreground">Rating: ⭐ {shipment.driver.rating}</p>
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
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={handleCall}>
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-64 pr-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.sender === "shipper" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{msg.sender === "driver" ? "D" : "S"}</AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[80%] ${msg.sender === "shipper" ? "text-right" : ""}`}>
                        <div
                          className={`p-2 rounded-lg text-sm ${
                            msg.sender === "shipper" ? "bg-blue-600 text-white" : "bg-slate-100"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shipment Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {shipment.timeline.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? "bg-green-600 text-white" : "bg-slate-200"
                  }`}
                >
                  {step.completed ? "✓" : index + 1}
                </div>
                <p className="text-sm font-medium mt-2 text-center">{step.status.replace("_", " ").toUpperCase()}</p>
                <p className="text-xs text-muted-foreground text-center">{step.time}</p>
                {index < shipment.timeline.length - 1 && (
                  <div className="absolute h-0.5 bg-slate-200 w-full top-4 left-1/2 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
