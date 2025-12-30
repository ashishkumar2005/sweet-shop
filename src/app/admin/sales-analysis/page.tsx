"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Users,
  Package,
  PieChart as PieChartIcon,
  Calendar,
  LogOut,
  IndianRupee,
  Lightbulb,
  CheckCircle2,
} from "lucide-react"
import { motion } from "framer-motion"

type AnalysisData = {
  kpis: {
    totalSales: number
    totalProfit: number
    totalOrders: number
    averageOrderValue: number
    profitMargin: number
  }
  insights: string[]
  recommendations: string[]
}

export default function SalesAnalysisPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<AnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === "admin") fetchAnalysisData()
  }, [user])

  const fetchAnalysisData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/sales-analysis")
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Mithai Mahal</span>
          </div>

          <Button variant="ghost" onClick={() => router.push("/admin/dashboard")}>
            <BarChart3 className="h-4 w-4 mr-2" /> Dashboard
          </Button>

          <Button variant="ghost" className="bg-primary/10 text-primary">
            <TrendingUp className="h-4 w-4 mr-2" /> Sales Analysis
          </Button>

          <Button variant="ghost">
            <Users className="h-4 w-4 mr-2" /> Customers
          </Button>
        </div>

        <div className="mt-auto p-4 border-t">
          <Button
            variant="ghost"
            onClick={() => {
              logout()
              router.push("/admin/login")
            }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Sales Analysis Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Deep dive into your business performance and metrics.
            </p>
          </div>

          <Button size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toDateString()}
          </Button>
        </header>

        {/* Content */}
        <main className="p-8 space-y-8 overflow-auto">
          {isLoading || !data ? (
            <div className="h-[60vh] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  ["Total Sales", `₹${data.kpis.totalSales}`, IndianRupee],
                  ["Total Profit", `₹${data.kpis.totalProfit}`, TrendingUp],
                  ["Orders", data.kpis.totalOrders, ShoppingCart],
                  ["Avg Order", `₹${data.kpis.averageOrderValue}`, Package],
                  ["Margin", `${data.kpis.profitMargin}%`, PieChartIcon],
                ].map(([label, value, Icon]: any, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Icon className="h-5 w-5 mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <h3 className="text-xl font-bold">{value}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Insights & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Insights */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-indigo-50 rounded-t-lg p-4 border-b border-indigo-200">
                    <CardTitle className="flex items-center gap-2 text-indigo-700 font-semibold">
                      <Lightbulb className="h-5 w-5 text-indigo-600" />
                      Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {data.insights.map((i, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {i}
                      </p>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-emerald-50 rounded-t-lg p-4 border-b border-emerald-200">
                    <CardTitle className="flex items-center gap-2 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {data.recommendations.map((r, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {r}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </div>

            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
