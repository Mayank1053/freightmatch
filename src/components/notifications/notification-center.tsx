"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Bell, Check, X, MapPin, MessageCircle, CreditCard, Truck, AlertCircle, FileText } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Notification {
  id: string
  type: "booking" | "message" | "payment" | "tracking" | "system" | "document" | "rating"
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
  priority?: "low" | "medium" | "high"
}

export function NotificationCenter() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const loadNotifications = () => {
      let roleNotifications: Notification[] = []

      if (user?.role === "truck-owner") {
        roleNotifications = [
          {
            id: "1",
            type: "booking",
            title: "New Booking Request",
            message: "Amit Sharma wants to book your Mumbai-Delhi route for ₹45,000",
            time: "2 min ago",
            read: false,
            priority: "high",
            actionUrl: "/dashboard/truck-owner/bookings",
          },
          {
            id: "2",
            type: "message",
            title: "New Message",
            message: 'Priya Patel: "When will you reach the pickup location?"',
            time: "5 min ago",
            read: false,
            priority: "medium",
            actionUrl: "/dashboard/truck-owner/messages",
          },
          {
            id: "3",
            type: "payment",
            title: "Payment Received",
            message: "Payment of ₹42,750 has been credited to your account",
            time: "1 hour ago",
            read: true,
            priority: "medium",
            actionUrl: "/dashboard/truck-owner/earnings",
          },
          {
            id: "4",
            type: "rating",
            title: "New Rating Received",
            message: "Rajesh Kumar rated you 5 stars for Delhi-Jaipur trip",
            time: "2 hours ago",
            read: false,
            priority: "low",
          },
          {
            id: "5",
            type: "document",
            title: "Document Verification",
            message: "Your driving license verification is complete. Status: Approved",
            time: "1 day ago",
            read: true,
            priority: "medium",
            actionUrl: "/dashboard/truck-owner/documents",
          },
        ]
      } else if (user?.role === "shipper") {
        roleNotifications = [
          {
            id: "1",
            type: "booking",
            title: "Booking Confirmed",
            message: "Your booking with Ramesh Transport has been confirmed for tomorrow",
            time: "10 min ago",
            read: false,
            priority: "high",
            actionUrl: "/dashboard/shipper/shipments",
          },
          {
            id: "2",
            type: "tracking",
            title: "Shipment Update",
            message: "Your cargo has reached Pune. Expected delivery: 2 hours",
            time: "30 min ago",
            read: false,
            priority: "medium",
            actionUrl: "/dashboard/shipper/track/SH001",
          },
          {
            id: "3",
            type: "message",
            title: "Driver Message",
            message: 'Driver: "Reached pickup location. Please confirm cargo details"',
            time: "1 hour ago",
            read: true,
            priority: "medium",
            actionUrl: "/dashboard/shipper/messages",
          },
          {
            id: "4",
            type: "payment",
            title: "Payment Processed",
            message: "Payment of ₹38,500 has been processed successfully",
            time: "3 hours ago",
            read: true,
            priority: "low",
            actionUrl: "/dashboard/shipper/payments",
          },
        ]
      } else if (user?.role === "admin") {
        roleNotifications = [
          {
            id: "1",
            type: "system",
            title: "New User Registration",
            message: "5 new truck owners registered today requiring verification",
            time: "15 min ago",
            read: false,
            priority: "medium",
            actionUrl: "/dashboard/admin/verifications",
          },
          {
            id: "2",
            type: "document",
            title: "Document Pending",
            message: "12 documents are pending verification review",
            time: "1 hour ago",
            read: false,
            priority: "high",
            actionUrl: "/dashboard/admin/verifications",
          },
          {
            id: "3",
            type: "system",
            title: "Platform Alert",
            message: "Daily transaction volume exceeded ₹10 lakhs milestone",
            time: "2 hours ago",
            read: true,
            priority: "low",
            actionUrl: "/dashboard/admin/analytics",
          },
        ]
      }

      setNotifications(roleNotifications)
    }

    if (user?.role) {
      loadNotifications()
    }
  }, [user?.role])

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
      case "document":
        return <FileText className="h-4 w-4" />
      case "rating":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string, priority?: string) => {
    const baseColor = (() => {
      switch (type) {
        case "booking":
          return "text-blue-600 bg-blue-50"
        case "message":
          return "text-green-600 bg-green-50"
        case "payment":
          return "text-emerald-600 bg-emerald-50"
        case "tracking":
          return "text-orange-600 bg-orange-50"
        case "document":
          return "text-purple-600 bg-purple-50"
        case "rating":
          return "text-yellow-600 bg-yellow-50"
        default:
          return "text-slate-600 bg-slate-50"
      }
    })()

    // Add priority styling
    if (priority === "high") {
      return `${baseColor} ring-2 ring-red-200`
    }
    return baseColor
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "You're all caught up!",
    })
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
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
                <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
                    notification.read
                      ? "bg-slate-50 border-slate-200"
                      : "bg-white border-blue-200 shadow-sm hover:border-blue-300"
                  } ${notification.priority === "high" ? "border-l-4 border-l-red-500" : ""}`}
                  onClick={() => handleNotificationAction(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}
                    >
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
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        {notification.priority && (
                          <Badge
                            variant={notification.priority === "high" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
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
