"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, DollarSign, RefreshCw, AlertTriangle, Download } from "lucide-react"
import Link from "next/link"

// Mock admin payment data
const mockAdminPayments = [
  {
    id: "PAY_001",
    bookingId: "SH001",
    shipper: "ABC Industries",
    trucker: "Rajesh Kumar",
    route: "Mumbai → Pune",
    amount: 8500,
    platformFee: 425,
    status: "completed",
    paymentMethod: "UPI",
    createdAt: "2024-01-15",
    completedAt: "2024-01-16",
  },
  {
    id: "PAY_002",
    bookingId: "SH002",
    shipper: "XYZ Corporation",
    trucker: "Singh Logistics",
    route: "Delhi → Gurgaon",
    amount: 3200,
    platformFee: 160,
    status: "escrow",
    paymentMethod: "Card",
    createdAt: "2024-01-12",
    completedAt: null,
  },
  {
    id: "PAY_003",
    bookingId: "SH003",
    shipper: "PQR Industries",
    trucker: "South Express",
    route: "Bangalore → Chennai",
    amount: 12000,
    platformFee: 600,
    status: "dispute",
    paymentMethod: "Net Banking",
    createdAt: "2024-01-10",
    completedAt: null,
  },
]

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPayments = mockAdminPayments.filter((payment) => {
    const matchesSearch =
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.trucker.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "escrow":
        return "bg-blue-100 text-blue-800"
      case "dispute":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = mockAdminPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.platformFee, 0)

  const escrowAmount = mockAdminPayments.filter((p) => p.status === "escrow").reduce((sum, p) => sum + p.amount, 0)

  const disputeCount = mockAdminPayments.filter((p) => p.status === "dispute").length

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
            <h1 className="text-3xl font-bold text-slate-900">Payment Management</h1>
            <p className="text-slate-600">Monitor platform payments and transactions</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Platform Revenue</div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">₹{escrowAmount.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">In Escrow</div>
                </div>
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{disputeCount}</div>
                  <div className="text-sm text-slate-600">Active Disputes</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{mockAdminPayments.length}</div>
                  <div className="text-sm text-slate-600">Total Transactions</div>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
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
                    placeholder="Search by booking ID, shipper, or trucker..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="escrow">In Escrow</SelectItem>
                  <SelectItem value="dispute">Dispute</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{payment.route}</h3>
                        <Badge className={getStatusColor(payment.status)}>{payment.status.toUpperCase()}</Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        Payment ID: {payment.id} • Booking: {payment.bookingId}
                      </div>
                      <div className="text-sm text-slate-600">
                        {payment.shipper} → {payment.trucker}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{payment.amount.toLocaleString()}</div>
                      <div className="text-sm text-green-600 font-medium">
                        Fee: ₹{payment.platformFee.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">Payment Method</div>
                        <div className="font-medium">{payment.paymentMethod}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Created</div>
                        <div className="font-medium">{payment.createdAt}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Completed</div>
                        <div className="font-medium">{payment.completedAt || "Pending"}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Commission Rate</div>
                        <div className="font-medium">5%</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View Details
                    </Button>

                    {payment.status === "dispute" && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Resolve Dispute
                      </Button>
                    )}

                    {payment.status === "escrow" && (
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Release Escrow
                      </Button>
                    )}

                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No payments found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
