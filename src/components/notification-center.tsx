"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, X, MapPin, MessageCircle, CreditCard, Truck } from "lucide-react"

interface Notification {
  id: string
  type: "booking" | "message" | "payment" | "tracking" | "system"
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "booking",
      title: "New Booking Request",
      message: "Amit Sharma wants to book your Mumbai-Delhi route for ₹45,000",
      time: "2 min ago",
      read: false,
      actionUrl: "/dashboard/truck-owner/bookings",
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      message: 'Priya Patel: "When will you reach the pickup location?"',
      time: "5 min ago",
      read: false,
      actionUrl: "/dashboard/truck-owner/messages",
    },
    {
      id: "3",
      type: "payment",
      title: "Payment Received",
      message: "Payment of ₹42,750 has been credited to your account",
      time: "1 hour ago",
      read: true,
      actionUrl: "/dashboard/truck-owner/earnings",
    },
    {
      id: "4",
      type: "tracking",
      title: "Location Update Required",
      message: "Please update your current location for active shipment SH001",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "5",
      type: "system",
      title: "Document Verification",
      message: "Your driving license verification is pending. Please upload required documents.",
      time: "1 day ago",
      read: true,
      actionUrl: "/dashboard/truck-owner/profile",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Truck className="h-4 w-4" />
      case "message":
        return <MessageCircle className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "tracking":
        return <MapPin className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "booking":
        return "text-blue-600 bg-blue-50"
      case "message":
        return "text-green-600 bg-green-50"
      case "payment":
        return "text-emerald-600 bg-emerald-50"
      case "tracking":
        return "text-orange-600 bg-orange-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1 p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read ? "bg-slate-50 border-slate-200" : "bg-white border-blue-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        {notification.actionUrl && (
                          <Button variant="outline" size="sm" className="text-xs bg-transparent">
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
