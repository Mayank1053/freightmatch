"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Search, FileText, Download, Eye, Send, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

// Mock invoice data
const mockInvoices = [
  {
    id: "INV-001-2024",
    bookingId: "SH001",
    route: "Mumbai → Pune",
    shipper: {
      name: "ABC Industries",
      company: "ABC Industries Pvt Ltd",
      email: "billing@abcindustries.com",
    },
    amount: 8500,
    platformFee: 425,
    netAmount: 8075,
    status: "paid",
    issuedDate: "2024-01-15",
    paidDate: "2024-01-16",
    dueDate: "2024-01-30",
  },
  {
    id: "INV-002-2024",
    bookingId: "SH002",
    route: "Delhi → Gurgaon",
    shipper: {
      name: "XYZ Corporation",
      company: "XYZ Corporation Ltd",
      email: "accounts@xyzcorp.com",
    },
    amount: 3200,
    platformFee: 160,
    netAmount: 3040,
    status: "pending",
    issuedDate: "2024-01-12",
    paidDate: null,
    dueDate: "2024-01-27",
  },
  {
    id: "INV-003-2024",
    bookingId: "SH003",
    route: "Bangalore → Chennai",
    shipper: {
      name: "PQR Industries",
      company: "PQR Industries Ltd",
      email: "finance@pqrindustries.com",
    },
    amount: 12000,
    platformFee: 600,
    netAmount: 11400,
    status: "overdue",
    issuedDate: "2024-01-08",
    paidDate: null,
    dueDate: "2024-01-23",
  },
]

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false)
  const { toast } = useToast()

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.shipper.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowInvoiceDetails(true)
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: `Invoice ${invoiceId} is being downloaded as PDF.`,
    })
  }

  const handleSendReminder = (invoice: any) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${invoice.shipper.email}`,
    })
  }

  const totalInvoiced = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalPaid = mockInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
  const totalPending = mockInvoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0)

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
            <h1 className="text-3xl font-bold text-slate-900">Invoice Management</h1>
            <p className="text-slate-600">Manage and track your invoices</p>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalInvoiced.toLocaleString()}</div>
              <p className="text-xs text-slate-600">All time invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</div>
              <p className="text-xs text-slate-600">Received payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalPending.toLocaleString()}</div>
              <p className="text-xs text-slate-600">Awaiting payment</p>
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
                    placeholder="Search by invoice ID, route, or shipper..."
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
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{invoice.id}</h3>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status.toUpperCase()}</Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        {invoice.route} • Booking: {invoice.bookingId}
                      </div>
                      <div className="text-sm text-slate-600">Shipper: {invoice.shipper.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{invoice.amount.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">Invoice Amount</div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">Issued Date</div>
                        <div className="font-medium">{invoice.issuedDate}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Due Date</div>
                        <div className="font-medium">{invoice.dueDate}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Net Amount</div>
                        <div className="font-medium text-green-600">₹{invoice.netAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Paid Date</div>
                        <div className="font-medium">{invoice.paidDate || "Not paid"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>

                    {(invoice.status === "pending" || invoice.status === "overdue") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handleSendReminder(invoice)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Reminder
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No invoices found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't generated any invoices yet"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Invoice Details Dialog */}
        <Dialog open={showInvoiceDetails} onOpenChange={setShowInvoiceDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Invoice Details
              </DialogTitle>
              <DialogDescription>Complete invoice information for {selectedInvoice?.id}</DialogDescription>
            </DialogHeader>

            {selectedInvoice && (
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start p-6 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold">FreightMatch Invoice</h3>
                    <p className="text-sm text-slate-600">Invoice #{selectedInvoice.id}</p>
                    <p className="text-sm text-slate-600">Issued: {selectedInvoice.issuedDate}</p>
                    <p className="text-sm text-slate-600">Due: {selectedInvoice.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Status</p>
                    <Badge className={getStatusColor(selectedInvoice.status)}>
                      {selectedInvoice.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Billing Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Bill To</h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{selectedInvoice.shipper.company}</p>
                      <p>{selectedInvoice.shipper.name}</p>
                      <p className="text-slate-600">{selectedInvoice.shipper.email}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Trip Details</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-slate-600">Route:</span> {selectedInvoice.route}
                      </p>
                      <p>
                        <span className="text-slate-600">Booking ID:</span> {selectedInvoice.bookingId}
                      </p>
                      <p>
                        <span className="text-slate-600">Service Date:</span> {selectedInvoice.issuedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Payment Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Freight Services:</span>
                      <span>₹{selectedInvoice.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Platform Fee (5%):</span>
                      <span>-₹{selectedInvoice.platformFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Net Amount:</span>
                      <span className="text-green-600">₹{selectedInvoice.netAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowInvoiceDetails(false)}
                  >
                    Close
                  </Button>
                  <Button className="flex-1" onClick={() => handleDownloadInvoice(selectedInvoice.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
