"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type UserRole, type AuthState, mockLogin, mockSignup } from "@/auth/types"

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>
  signup: (userData: {
    name: string
    email: string
    phone: string
    password: string
    role: UserRole
    company?: string
    gst?: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = () => {
      const storedUser = localStorage.getItem("freight_user")
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          })
        } catch {
          localStorage.removeItem("freight_user")
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await mockLogin(email, password, role)
      localStorage.setItem("freight_user", JSON.stringify(user))
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      throw error
    }
  }

  const signup = async (userData: {
    name: string
    email: string
    phone: string
    password: string
    role: UserRole
    company?: string
    gst?: string
  }) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await mockSignup(userData)
      localStorage.setItem("freight_user", JSON.stringify(user))
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("freight_user")
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
