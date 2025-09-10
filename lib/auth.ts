export type UserRole = "truck-owner" | "shipper" | "admin"

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  company?: string
  gst?: string
  isVerified: boolean
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication functions - to be replaced with real implementation
export const mockLogin = async (email: string, password: string, role: UserRole): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: "1",
    email,
    name: "John Doe",
    phone: "+91 9876543210",
    role,
    isVerified: true,
    createdAt: new Date(),
  }
}

export const mockSignup = async (userData: {
  name: string
  email: string
  phone: string
  password: string
  role: UserRole
  company?: string
  gst?: string
}): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: "1",
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    role: userData.role,
    company: userData.company,
    gst: userData.gst,
    isVerified: false,
    createdAt: new Date(),
  }
}
