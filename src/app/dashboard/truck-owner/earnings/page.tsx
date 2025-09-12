"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, DollarSign, TrendingUp, Clock, Download } from "lucide-react"
import Link from "next/link"

// Mock earnings data
const mockEarnings = [
  {
    id: "ERN_001",
    bookingId: "SH001",
    route: "Mumbai → Pune",
    shipper: "ABC Industries",
    amount: 8500,
    platformFee: 425,
    netEarnings: 8075,
    status: "paid",
    completedAt: "2024-01-15",
    paidAt: "2024-01-16",
  },
  {
    id: "ERN_002",
    bookingId: "SH002",
    route: "Delhi → Gurgaon",
    shipper: "XYZ Corporation",
    amount: 3200,
    platformFee: 160,
    netEarnings: 3040,
    status: "pending",
    completedAt: "2024-01-12",
    paidAt: null,
  },
  {
    id: "ERN_003",
    bookingId: "SH003",
    route: "Bangalore → Chennai",
    shipper: "PQR Industries",
    amount: 12000,
    platformFee: 600,
    netEarnings: 11400,
    status: "processing",
    completedAt: "2024-01-10",
    paidAt: null,
  },
]

export default function EarningsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredEarnings = mockEarnings.filter((earning) => {
    const matchesSearch =
      earning.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.shipper.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || earning.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalEarnings = mockEarnings.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.netEarnings, 0)

  const pendingEarnings = mockEarnings
    .filter((e) => e.status === "pending" || e.status === "processing")
    .reduce((sum, e) => sum + e.netEarnings, 0)

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
            <h1 className="text-3xl font-bold text-slate-900">Earnings</h1>
            <p className="text-slate-600">Track your payments and earnings</p>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-slate-600">Received payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{pendingEarnings.toLocaleString()}</div>
              <p className="text-xs text-slate-600">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹
                {mockEarnings
                  .filter((e) => e.completedAt.startsWith("2024-01"))
                  .reduce((sum, e) => sum + e.netEarnings, 0)
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
                    placeholder="Search by booking ID, route, or shipper..."
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Earnings List */}
        <div className="space-y-4">
          {filteredEarnings.map((earning) => (
            <Card key={earning.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{earning.route}</h3>
                        <Badge className={getStatusColor(earning.status)}>{earning.status.toUpperCase()}</Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        Booking ID: {earning.bookingId} • Shipper: {earning.shipper}
                      </div>
                      <div className="text-sm text-slate-600">Completed: {earning.completedAt}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{earning.netEarnings.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">Net Earnings</div>
                    </div>
                  </div>

                  {/* Earnings Breakdown */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">Gross Amount</div>
                        <div className="font-medium">₹{earning.amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Platform Fee (5%)</div>
                        <div className="font-medium text-red-600">-₹{earning.platformFee.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Payment Date</div>
                        <div className="font-medium">{earning.paidAt || "Pending"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Status Description */}
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                    {earning.status === "paid" && "Payment has been transferred to your account"}
                    {earning.status === "pending" && "Waiting for shipper to confirm delivery"}
                    {earning.status === "processing" && "Payment is being processed and will be transferred soon"}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View Details
                    </Button>

                    {earning.status === "paid" && (
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEarnings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No earnings found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't completed any paid trips yet"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/dashboard/truck-owner/list-trip">
                  <Button>List Your First Trip</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
