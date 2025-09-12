"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, FileText, CheckCircle, X, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import DocumentViewer from "@/components/document-viewer" // Import DocumentViewer component

// Mock verification data
const mockVerifications = [
  {
    id: "1",
    user: {
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      type: "truck-owner",
    },
    verificationType: "KYC Documents",
    documents: ["RC Book", "Insurance Certificate", "PUC Certificate", "Vehicle Photos"],
    submittedAt: "2024-01-15",
    status: "pending",
    priority: "high",
    notes: "All truck owner documents submitted, awaiting review",
  },
  {
    id: "2",
    user: {
      name: "Singh Logistics",
      email: "singh@logistics.com",
      type: "truck-owner",
    },
    verificationType: "Vehicle Registration",
    documents: ["RC Book", "Insurance Certificate", "PUC Certificate", "Vehicle Photos"],
    submittedAt: "2024-01-14",
    status: "pending",
    priority: "medium",
    notes: "Vehicle registration documents uploaded",
  },
  {
    id: "3",
    user: {
      name: "ABC Industries",
      email: "contact@abcindustries.com",
      type: "shipper",
    },
    verificationType: "Business Verification",
    documents: ["Aadhaar Card", "PAN Card", "GSTIN Certificate"],
    submittedAt: "2024-01-13",
    status: "approved",
    priority: "low",
    notes: "Business verification completed successfully",
  },
  {
    id: "4",
    user: {
      name: "XYZ Transport",
      email: "xyz@transport.com",
      type: "truck-owner",
    },
    verificationType: "KYC Documents",
    documents: ["RC Book", "Insurance Certificate", "PUC Certificate", "Vehicle Photos"],
    submittedAt: "2024-01-12",
    status: "rejected",
    priority: "medium",
    notes: "Insurance certificate expired, resubmission required",
  },
]

export default function VerificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)

  const filteredVerifications = mockVerifications.filter((verification) => {
    const matchesSearch =
      verification.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.verificationType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || verification.status === statusFilter
    const matchesType = typeFilter === "all" || verification.verificationType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "truck-owner":
        return "bg-blue-100 text-blue-800"
      case "shipper":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleVerificationAction = (verificationId: string, action: string, reason?: string) => {
    const verificationIndex = mockVerifications.findIndex((v) => v.id === verificationId)
    if (verificationIndex === -1) return

    // Update the verification in the array
    switch (action) {
      case "approve":
        mockVerifications[verificationIndex] = {
          ...mockVerifications[verificationIndex],
          status: "approved",
          notes: "Verification approved by admin",
        }
        toast({
          title: "Verification Approved",
          description: `${mockVerifications[verificationIndex].user.name}'s ${mockVerifications[verificationIndex].verificationType} has been approved.`,
        })
        break
      case "reject":
        mockVerifications[verificationIndex] = {
          ...mockVerifications[verificationIndex],
          status: "rejected",
          notes: reason || "Verification rejected by admin",
        }
        toast({
          title: "Verification Rejected",
          description: `${mockVerifications[verificationIndex].user.name}'s ${mockVerifications[verificationIndex].verificationType} has been rejected.`,
        })
        break
    }

    setRejectionReason("")
    // Force re-render by updating a state that triggers component refresh
    setSearchTerm((prev) => prev + "")
  }

  const handleDocumentView = (docName: string) => {
    setSelectedDocument({ name: docName, type: "document" })
    setShowDocumentViewer(true)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Verifications</h1>
            <p className="text-slate-600">Review and approve user verification requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {mockVerifications.filter((v) => v.status === "pending").length}
              </div>
              <div className="text-sm text-slate-600">Pending Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {mockVerifications.filter((v) => v.status === "approved").length}
              </div>
              <div className="text-sm text-slate-600">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {mockVerifications.filter((v) => v.status === "rejected").length}
              </div>
              <div className="text-sm text-slate-600">Rejected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {mockVerifications.filter((v) => v.priority === "high").length}
              </div>
              <div className="text-sm text-slate-600">High Priority</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by user name or verification type..."
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="KYC Documents">KYC Documents</SelectItem>
                  <SelectItem value="Vehicle Registration">Vehicle Registration</SelectItem>
                  <SelectItem value="Business Verification">Business Verification</SelectItem>
                  <SelectItem value="RFID Registration">RFID Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Verifications List */}
        <div className="space-y-4">
          {filteredVerifications.map((verification) => (
            <Card key={verification.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{verification.verificationType}</h3>
                        <Badge className={getPriorityColor(verification.priority)}>
                          {verification.priority} priority
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{verification.user.name}</span>
                        <Badge className={getUserTypeColor(verification.user.type)}>
                          {verification.user.type.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">{verification.user.email}</div>
                    </div>
                    <Badge className={getStatusColor(verification.status)}>{verification.status.toUpperCase()}</Badge>
                  </div>

                  {/* Documents */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm font-medium text-slate-700 mb-2">Submitted Documents:</div>
                    <div className="flex flex-wrap gap-2">
                      {verification.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white px-3 py-1 rounded border">
                          <FileText className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">{doc}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleDocumentView(doc)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Submitted:</span>
                      <span className="ml-2 font-medium">{verification.submittedAt}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Notes:</span>
                      <span className="ml-2">{verification.notes}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {verification.status === "pending" && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Verification
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Approve Verification</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to approve {verification.user.name}'s{" "}
                              {verification.verificationType}?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-3 justify-end">
                            <Button variant="outline">Cancel</Button>
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                handleVerificationAction(verification.id, "approve")
                                // Close dialog by clicking outside or using escape
                                const dialog = document.querySelector('[role="dialog"]') as HTMLElement
                                if (dialog) {
                                  const closeButton = dialog.querySelector(
                                    'button[aria-label="Close"]',
                                  ) as HTMLButtonElement
                                  if (closeButton) closeButton.click()
                                }
                              }}
                            >
                              Approve
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-transparent"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject Verification
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Verification</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for rejecting {verification.user.name}'s{" "}
                              {verification.verificationType}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Enter rejection reason..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <div className="flex gap-3 justify-end">
                              <Button variant="outline" onClick={() => setRejectionReason("")}>
                                Cancel
                              </Button>
                              <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  handleVerificationAction(verification.id, "reject", rejectionReason)
                                  // Close dialog
                                  const dialog = document.querySelector('[role="dialog"]') as HTMLElement
                                  if (dialog) {
                                    const closeButton = dialog.querySelector(
                                      'button[aria-label="Close"]',
                                    ) as HTMLButtonElement
                                    if (closeButton) closeButton.click()
                                  }
                                }}
                                disabled={!rejectionReason.trim()}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {verification.status !== "pending" && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-slate-600">
                        Verification {verification.status} on {verification.submittedAt}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVerifications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No verifications found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}

        {/* Document Viewer */}
        {showDocumentViewer && selectedDocument && (
          <DocumentViewer document={selectedDocument} onClose={() => setShowDocumentViewer(false)} />
        )}
      </div>
    </ProtectedRoute>
  )
}
