"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Building, Shield, Info } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  bookingDetails: {
    route: string
    trucker: string
    amount: number
    bookingId: string
  }
  onPaymentSuccess: (paymentId: string) => void
}

export function PaymentModal({ isOpen, onClose, bookingDetails, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
  })

  const platformFee = Math.round(bookingDetails.amount * 0.05) // 5% platform commission
  const totalAmount = bookingDetails.amount + platformFee

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock payment success
      const paymentId = `PAY_${Date.now()}`
      onPaymentSuccess(paymentId)
      onClose()
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "upi":
        return <Smartphone className="h-5 w-5" />
      case "netbanking":
        return <Building className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>Complete your booking payment securely</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="p-4 bg-slate-50 rounded-lg space-y-2">
            <div className="font-medium">Booking Summary</div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Route:</span>
                <span>{bookingDetails.route}</span>
              </div>
              <div className="flex justify-between">
                <span>Trucker:</span>
                <span>{bookingDetails.trucker}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking ID:</span>
                <span className="font-mono">{bookingDetails.bookingId}</span>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Freight Amount:</span>
              <span>₹{bookingDetails.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Platform Fee (5%):</span>
              <span>₹{platformFee.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total Amount:</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Escrow Notice */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <div className="font-medium">Escrow Protection</div>
              <div>Payment will be held securely until delivery is confirmed</div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={paymentMethod === "card" ? "default" : "outline"}
                className="flex-col h-16 gap-1"
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs">Card</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "upi" ? "default" : "outline"}
                className="flex-col h-16 gap-1"
                onClick={() => setPaymentMethod("upi")}
              >
                <Smartphone className="h-5 w-5" />
                <span className="text-xs">UPI</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "netbanking" ? "default" : "outline"}
                className="flex-col h-16 gap-1"
                onClick={() => setPaymentMethod("netbanking")}
              >
                <Building className="h-5 w-5" />
                <span className="text-xs">Net Banking</span>
              </Button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod && (
            <form onSubmit={handlePayment} className="space-y-4">
              {paymentMethod === "card" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={formData.upiId}
                    onChange={(e) => handleInputChange("upiId", e.target.value)}
                    required
                  />
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="space-y-2">
                  <Label>Select Bank</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sbi">State Bank of India</SelectItem>
                      <SelectItem value="hdfc">HDFC Bank</SelectItem>
                      <SelectItem value="icici">ICICI Bank</SelectItem>
                      <SelectItem value="axis">Axis Bank</SelectItem>
                      <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing} className="flex-1">
                  {isProcessing ? "Processing..." : `Pay ₹${totalAmount.toLocaleString()}`}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
