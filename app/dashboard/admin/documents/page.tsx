"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Search, Filter, Check, X, Eye, Clock, User, Truck, Building } from "lucide-react"

export default function AdminDocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)

  // Mock data - replace with real API calls
  const pendingDocuments = [
    {
      id: "1",
      userId: "TRK001",
      userName: "Rajesh Kumar",
      userType: "truck_owner",
      documentType: "driving_license",
      fileName: "driving_license.pdf",
      uploadDate: "2024-01-15",
      status: "pending",
      avatar: "/indian-truck-driver.jpg",
    },
    {
      id: "2",
      userId: "SHP001",
      userName: "Amit Sharma",
      userType: "shipper",
      documentType: "gst_certificate",
      fileName: "gst_certificate.pdf",
      uploadDate: "2024-01-14",
      status: "pending",
      avatar: "/diverse-business-person.png",
    },
    {
      id: "3",
      userId: "TRK002",
      userName: "Suresh Patel",
      userType: "truck_owner",
      documentType: "vehicle_registration",
      fileName: "vehicle_rc.pdf",
      uploadDate: "2024-01-13",
      status: "pending",
      avatar: "/truck-driver.jpg",
    },
  ]

  const recentActions = [
    {
      id: "1",
      action: "approved",
      documentType: "pan_card",
      userName: "Priya Patel",
      adminName: "Admin User",
      timestamp: "2024-01-15 14:30",
    },
    {
      id: "2",
      action: "rejected",
      documentType: "vehicle_insurance",
      userName: "Vikram Singh",
      adminName: "Admin User",
      timestamp: "2024-01-15 13:45",
      reason: "Document not clear, please reupload",
    },
    {
      id: "3",
      action: "approved",
      documentType: "trade_license",
      userName: "Ravi Kumar",
      adminName: "Admin User",
      timestamp: "2024-01-15 12:20",
    },
  ]

  const stats = {
    pending: 15,
    approved: 142,
    rejected: 8,
    total: 165,
  }

  const handleApprove = (documentId: string) => {
    console.log("Approving document:", documentId)
    // Handle approval logic
  }

  const handleReject = (documentId: string) => {
    console.log("Rejecting document:", documentId)
    // Handle rejection logic
  }

  const getDocumentTypeIcon = (type: string) => {
    if (type.includes("license") || type.includes("aadhaar") || type.includes("pan")) {
      return <User className="h-4 w-4" />
    }
    if (type.includes("vehicle") || type.includes("insurance") || type.includes("permit")) {
      return <Truck className="h-4 w-4" />
    }
    return <Building className="h-4 w-4" />
  }

  const getUserTypeColor = (type: string) => {
    return type === "truck_owner" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Verification</h1>
          <p className="text-muted-foreground">Review and verify user documents</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({stats.pending})</TabsTrigger>
          <TabsTrigger value="recent">Recent Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents Pending Review</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search documents..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDocuments.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={doc.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {doc.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{doc.userName}</p>
                            <Badge className={getUserTypeColor(doc.userType)}>{doc.userType.replace("_", " ")}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getDocumentTypeIcon(doc.documentType)}
                            <span>{doc.documentType.replace("_", " ").toUpperCase()}</span>
                            <span>•</span>
                            <span>{doc.fileName}</span>
                            <span>•</span>
                            <span>Uploaded {doc.uploadDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(doc.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Verification Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {recentActions.map((action) => (
                    <div key={action.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div
                        className={`p-2 rounded-full ${action.action === "approved" ? "bg-green-100" : "bg-red-100"}`}
                      >
                        {action.action === "approved" ? (
                          <Check
                            className={`h-4 w-4 ${action.action === "approved" ? "text-green-600" : "text-red-600"}`}
                          />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {action.documentType.replace("_", " ").toUpperCase()} {action.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Document for {action.userName} was {action.action} by {action.adminName}
                        </p>
                        {action.reason && <p className="text-sm text-red-600 mt-1">Reason: {action.reason}</p>}
                        <p className="text-xs text-muted-foreground mt-2">{action.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
