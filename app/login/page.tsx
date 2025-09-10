"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/auth"

export default function LoginPage() {
  const [userType, setUserType] = useState<UserRole | "">("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userType) return

    setIsLoading(true)
    setError("")

    try {
      await login(email, password, userType as UserRole)

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
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
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
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">Account Type</Label>
              <Select value={userType} onValueChange={(value) => setUserType(value as UserRole)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck-owner">Truck Owner</SelectItem>
                  <SelectItem value="shipper">Shipper/Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
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
