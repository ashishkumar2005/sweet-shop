"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Loader2,
  Search,
  Settings,
  LogOut,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  BarChart3,
  IndianRupee,
  Download,
  MoreHorizontal,
  CreditCard,
  Wallet,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type DashboardData = {
  totalSales: string
  salesByChannel: {
    website: { amount: string; percentage: number }
    mobile: { amount: string; percentage: number }
    market: { amount: string; percentage: number }
    agent: { amount: string; percentage: number }
  }
  revenueData: Array<{ day: string; revenue: number }>
  yearlySales: {
    data: Array<{ month: string; sales2023: number; sales2024: number }>
    total2023: number
    total2024: number
  }
  profitExpense: {
    profit: string
    expense: string
    total: string
  }
  activeUsers: {
    total: number
    growth: number
  }
  paymentGateways: Array<{
    name: string
    category: string
    amount: number
    icon: string
  }>
  totalOrders: number
}

export default function AdminDashboardPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard")
      const dashboardData = await res.json()
      setData(dashboardData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (authLoading || !user || user.role !== "admin" || isLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const pieData = [
    { name: "Profit", value: parseInt(data.profitExpense.profit) },
    { name: "Expense", value: parseInt(data.profitExpense.expense) },
  ]
  const COLORS = ["#8b5cf6", "#ec4899"]

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mithai Mahal
            </span>
          </div>

          <div className="text-xs font-semibold text-primary uppercase mb-3">
            MAIN MENU
          </div>

          <div className="space-y-1">
            <Button className="w-full justify-start gap-3 bg-primary/10 text-primary">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => router.push("/admin/sales-analysis")}
            >
              <TrendingUp className="h-4 w-4" />
              Sales Analysis
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => router.push("/admin")}
            >
              <ShoppingCart className="h-4 w-4" />
              Products
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <Package className="h-4 w-4" />
              Orders
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <Users className="h-4 w-4" />
              Customers
            </Button>
          </div>
        </div>

        {/* User */}
        <div className="mt-auto border-t border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">Administrator</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => router.push("/admin")}
            >
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={handleLogout}
            >
              <LogOut className="h-3 w-3 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header (cleaned) */}
        <header className="border-b border-border px-6 py-4 bg-card">
          <div className="max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, orders, customers..."
                className="pl-10"
              />
            </div>
          </div>
        </header>

        {/* CONTENT — unchanged below */}
        {/* Your remaining dashboard JSX stays EXACTLY the same */}
      </div>
    </div>
  )
}
