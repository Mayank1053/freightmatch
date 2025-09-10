"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Users, Eye, Ban, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 9876543210",
    role: "truck-owner",
    status: "active",
    verified: true,
    joinDate: "2024-01-10",
    lastActive: "2 hours ago",
    totalTrips: 45,
    rating: 4.8,
  },
  {
    id: "2",
    name: "ABC Industries",
    email: "contact@abcindustries.com",
    phone: "+91 9876543211",
    role: "shipper",
    status: "active",
    verified: false,
    joinDate: "2024-01-12",
    lastActive: "1 day ago",
    totalShipments: 23,
    rating: 4.5,
  },
  {
    id: "3",
    name: "Singh Logistics",
    email: "singh@logistics.com",
    phone: "+91 9876543212",
    role: "truck-owner",
    status: "suspended",
    verified: true,
    joinDate: "2024-01-05",
    lastActive: "1 week ago",
    totalTrips: 12,
    rating: 3.2,
  },
  {
    id: "4",
    name: "XYZ Corporation",
    email: "admin@xyzcorp.com",
    phone: "+91 9876543213",
    role: "shipper",
    status: "pending",
    verified: false,
    joinDate: "2024-01-15",
    lastActive: "Never",
    totalShipments: 0,
    rating: null,
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "truck-owner":
        return "bg-blue-100 text-blue-800"
      case "shipper":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleUserAction = (userId: string, action: string) => {
    // TODO: Implement user actions
    console.log(`${action} user:`, userId)
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
            <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-600">Manage platform users and their accounts</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {mockUsers.filter((u) => u.role === "truck-owner").length}
              </div>
              <div className="text-sm text-slate-600">Truck Owners</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {mockUsers.filter((u) => u.role === "shipper").length}
              </div>
              <div className="text-sm text-slate-600">Shippers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {mockUsers.filter((u) => u.status === "active").length}
              </div>
              <div className="text-sm text-slate-600">Active Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{mockUsers.filter((u) => !u.verified).length}</div>
              <div className="text-sm text-slate-600">Unverified</div>
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
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="truck-owner">Truck Owners</SelectItem>
                  <SelectItem value="shipper">Shippers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <Users className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        {user.verified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="text-sm text-slate-600">{user.email}</div>
                      <div className="text-sm text-slate-600">{user.phone}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getRoleColor(user.role)}>{user.role.replace("-", " ").toUpperCase()}</Badge>
                        <Badge className={getStatusColor(user.status)}>{user.status.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="text-sm text-slate-600">Joined: {user.joinDate}</div>
                    <div className="text-sm text-slate-600">Last active: {user.lastActive}</div>
                    {user.rating && (
                      <div className="text-sm">
                        Rating: <span className="font-medium">{user.rating}★</span>
                      </div>
                    )}
                    <div className="text-sm">
                      {user.role === "truck-owner" ? `${user.totalTrips} trips` : `${user.totalShipments} shipments`}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleUserAction(user.id, "view")}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>

                  {user.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleUserAction(user.id, "suspend")}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  )}

                  {user.status === "suspended" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700 bg-transparent"
                      onClick={() => handleUserAction(user.id, "activate")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}

                  {!user.verified && (
                    <Button size="sm" onClick={() => handleUserAction(user.id, "verify")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
