"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, CreditCard, Download, Eye, RefreshCw } from "lucide-react"
import Link from "next/link"

// Mock payment data
const mockPayments = [
  {
    id: "PAY_001",
    bookingId: "SH001",
    route: "Mumbai → Pune",
    trucker: "Rajesh Kumar",
    amount: 8500,
    platformFee: 425,
    totalPaid: 8925,
    status: "completed",
    paymentMethod: "UPI",
    paidAt: "2024-01-15",
    escrowReleased: true,
    invoiceUrl: "#",
  },
  {
    id: "PAY_002",
    bookingId: "SH002",
    route: "Delhi → Gurgaon",
    trucker: "Singh Logistics",
    amount: 3200,
    platformFee: 160,
    totalPaid: 3360,
    status: "escrow",
    paymentMethod: "Card",
    paidAt: "2024-01-12",
    escrowReleased: false,
    invoiceUrl: "#",
  },
  {
    id: "PAY_003",
    bookingId: "SH003",
    route: "Bangalore → Chennai",
    trucker: "South Express",
    amount: 12000,
    platformFee: 600,
    totalPaid: 12600,
    status: "pending",
    paymentMethod: "Net Banking",
    paidAt: null,
    escrowReleased: false,
    invoiceUrl: null,
  },
  {
    id: "PAY_004",
    bookingId: "SH004",
    route: "Kolkata → Bhubaneswar",
    trucker: "East Transport",
    amount: 7500,
    platformFee: 375,
    totalPaid: 7875,
    status: "refunded",
    paymentMethod: "UPI",
    paidAt: "2024-01-08",
    escrowReleased: false,
    invoiceUrl: "#",
  },
]

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-purple-100 text-purple-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "completed":
        return "Payment completed and released to trucker"
      case "escrow":
        return "Payment held in escrow until delivery"
      case "pending":
        return "Payment processing or awaiting confirmation"
      case "refunded":
        return "Payment refunded to your account"
      case "failed":
        return "Payment failed, please retry"
      default:
        return ""
    }
  }

  const totalSpent = mockPayments
    .filter((p) => p.status === "completed" || p.status === "escrow")
    .reduce((sum, p) => sum + p.totalPaid, 0)

  const escrowAmount = mockPayments.filter((p) => p.status === "escrow").reduce((sum, p) => sum + p.totalPaid, 0)

  return (
    <ProtectedRoute allowedRoles={["shipper"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/shipper">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
            <p className="text-slate-600">Track your payments and transactions</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
              <p className="text-xs text-slate-600">All time payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Escrow</CardTitle>
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{escrowAmount.toLocaleString()}</div>
              <p className="text-xs text-slate-600">Pending delivery confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹
                {mockPayments
                  .filter((p) => p.paidAt && p.paidAt.startsWith("2024-01"))
                  .reduce((sum, p) => sum + p.totalPaid, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-slate-600">January 2024</p>
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
                    placeholder="Search by booking ID, route, or trucker..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
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
                      <div className="text-sm text-slate-600">Trucker: {payment.trucker}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{payment.totalPaid.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">{payment.paymentMethod}</div>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">Freight Amount</div>
                        <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Platform Fee</div>
                        <div className="font-medium">₹{payment.platformFee.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Payment Date</div>
                        <div className="font-medium">{payment.paidAt || "Not paid"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Status Description */}
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                    {getStatusDescription(payment.status)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    {payment.invoiceUrl && (
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    )}

                    {payment.status === "pending" && (
                      <Button size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Complete Payment
                      </Button>
                    )}

                    {payment.status === "failed" && (
                      <Button size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Payment
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No payments found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't made any payments yet"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/dashboard/shipper/search">
                  <Button>Find Trucks to Book</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
