"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Search, Phone, MoreVertical, Send, Video } from "lucide-react"
import { useState } from "react"

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1")
  const [newMessage, setNewMessage] = useState("")
  const { toast } = useToast()

  // Mock data - replace with real API calls
  const conversations = [
    {
      id: "1",
      shipper: {
        name: "Amit Sharma",
        company: "Sharma Logistics",
        avatar: "/diverse-business-person.png",
      },
      lastMessage: "When will you reach the pickup location?",
      time: "2 min ago",
      unread: 2,
      shipmentId: "SH001",
      status: "active",
    },
    {
      id: "2",
      shipper: {
        name: "Priya Patel",
        company: "Patel Enterprises",
        avatar: "/confident-business-woman.png",
      },
      lastMessage: "Thank you for the safe delivery!",
      time: "1 hour ago",
      unread: 0,
      shipmentId: "SH002",
      status: "completed",
    },
    {
      id: "3",
      shipper: {
        name: "Ravi Kumar",
        company: "Kumar Trading",
        avatar: "/diverse-businessman.png",
      },
      lastMessage: "Are you available for pickup tomorrow?",
      time: "3 hours ago",
      unread: 1,
      shipmentId: "SH003",
      status: "pending",
    },
  ]

  const messages = selectedChat
    ? [
        {
          id: 1,
          sender: "shipper",
          message: "Hi! I have a shipment from Mumbai to Delhi. Are you available?",
          time: "10:00 AM",
          avatar: "/diverse-business-person.png",
        },
        {
          id: 2,
          sender: "driver",
          message: "Yes, I am available. What are the cargo details?",
          time: "10:05 AM",
          avatar: "/truck-driver.jpg",
        },
        {
          id: 3,
          sender: "shipper",
          message: "It's 15 tons of electronics. Pickup from Andheri, delivery to Gurgaon.",
          time: "10:07 AM",
          avatar: "/diverse-business-person.png",
        },
        {
          id: 4,
          sender: "driver",
          message: "Perfect! I can handle that. My rate is ₹45,000 for this route.",
          time: "10:10 AM",
          avatar: "/truck-driver.jpg",
        },
        {
          id: 5,
          sender: "shipper",
          message: "Sounds good. When can you pick up?",
          time: "10:15 AM",
          avatar: "/diverse-business-person.png",
        },
        {
          id: 6,
          sender: "driver",
          message: "I can be there by 2 PM today. Please share the exact address.",
          time: "10:20 AM",
          avatar: "/truck-driver.jpg",
        },
        {
          id: 7,
          sender: "shipper",
          message: "When will you reach the pickup location?",
          time: "2:30 PM",
          avatar: "/diverse-business-person.png",
        },
      ]
    : []

  const selectedConversation = conversations.find((c) => c.id === selectedChat)

  const handleCall = (phoneNumber: string, contactName: string) => {
    // Open phone dialer
    window.open(`tel:${phoneNumber}`, "_self")

    toast({
      title: "Opening Phone App",
      description: `Calling ${contactName} at ${phoneNumber}`,
    })
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here - for now just clear input and show toast
      toast({
        title: "Message Sent",
        description: "Your message has been delivered",
      })
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with your shippers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="space-y-1 p-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === conversation.id ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedChat(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.shipper.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.shipper.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm truncate">{conversation.shipper.name}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                            {conversation.unread > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{conversation.shipper.company}</p>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge
                            variant={
                              conversation.status === "active"
                                ? "default"
                                : conversation.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {conversation.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{conversation.shipmentId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.shipper.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedConversation.shipper.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedConversation.shipper.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.shipper.company} • {selectedConversation.shipmentId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCall("+91 9876543210", selectedConversation.shipper.name)}
                      className="bg-transparent"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast({
                          title: "Video Call",
                          description: "Video calling feature coming soon!",
                        })
                      }
                      className="bg-transparent"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-96">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4 py-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.sender === "driver" ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{msg.sender === "driver" ? "D" : "S"}</AvatarFallback>
                        </Avatar>
                        <div className={`max-w-[70%] ${msg.sender === "driver" ? "text-right" : ""}`}>
                          <div
                            className={`p-3 rounded-lg ${
                              msg.sender === "driver" ? "bg-blue-600 text-white" : "bg-slate-100"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2 pt-4 border-t">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={newMessage.trim() ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold">Select a conversation</p>
                <p className="text-muted-foreground">Choose a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
