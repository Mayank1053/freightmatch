"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Truck, ArrowLeft, Package, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/auth"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [userType, setUserType] = useState<UserRole | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    company: "",
    gst: "",
    agreeTerms: false,
  })

  const { signup } = useAuth()

  useEffect(() => {
    const type = searchParams.get("type")
    if (type) {
      setUserType(type as UserRole)
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!userType) return

    setIsLoading(true)
    setError("")

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: userType as UserRole,
        company: formData.company,
        gst: formData.gst,
      })

      switch (userType) {
        case "truck-owner":
          router.push("/dashboard/truck-owner")
          break
        case "shipper":
          router.push("/dashboard/shipper")
          break
        case "admin":
          router.push("/dashboard/admin")
          break
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getUserTypeIcon = () => {
    switch (userType) {
      case "truck-owner":
        return <Truck className="h-6 w-6 text-blue-600" />
      case "shipper":
        return <Package className="h-6 w-6 text-green-600" />
      case "admin":
        return <Shield className="h-6 w-6 text-purple-600" />
      default:
        return <Truck className="h-6 w-6 text-blue-600" />
    }
  }

  const getUserTypeTitle = () => {
    switch (userType) {
      case "truck-owner":
        return "Truck Owner Registration"
      case "shipper":
        return "Shipper Registration"
      case "admin":
        return "Admin Registration"
      default:
        return "Create Account"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">FreightMatch</h1>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            {getUserTypeIcon()}
            <CardTitle className="text-lg">{getUserTypeTitle()}</CardTitle>
          </div>
          <CardDescription>
            Join our platform to start {userType === "truck-owner" ? "listing your trucks" : "shipping your cargo"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {!userType && (
              <div className="space-y-2">
                <Label htmlFor="userType">Account Type</Label>
                <Select value={userType} onValueChange={(value) => setUserType(value as UserRole)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck-owner">Truck Owner</SelectItem>
                    <SelectItem value="shipper">Shipper/Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{userType === "truck-owner" ? "Full Name" : "Contact Name"}</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>

            {userType === "shipper" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number (Optional)</Label>
                  <Input
                    id="gst"
                    placeholder="Enter GST number"
                    value={formData.gst}
                    onChange={(e) => handleInputChange("gst", e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                required
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

            <Button type="submit" className="w-full" disabled={!formData.agreeTerms || isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
            <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
