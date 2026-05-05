import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Car, Users, Handshake, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

interface DashboardStats {
  totalCars: number
  inStockCars: number
  soldCars: number
  totalCustomers: number
  totalInterests: number
  activeInterests: number
}

interface RecentCar {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  status: string
  created_at: string
}

interface RecentInterest {
  id: string
  car_title: string
  car_brand: string
  car_model: string
  customer_name: string
  customer_phone: string
  status: string
  updated_at: string
}

const statusLabels: Record<string, string> = {
  in_stock: "Stokta",
  reserved: "Rezerve",
  sold: "Satıldı",
  interested: "İlgili",
  test_drive: "Test Sürüşü",
  negotiating: "Pazarlık",
  lost: "Kayıp",
}

const statusColors: Record<string, string> = {
  in_stock: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  reserved: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  sold: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  interested: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  test_drive: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  negotiating: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  lost: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentCars, setRecentCars] = useState<RecentCar[]>([])
  const [recentInterests, setRecentInterests] = useState<RecentInterest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, interestsRes] = await Promise.all([
          apiClient.get<{ success: boolean; data: RecentCar[] }>("/api/cars?limit=5"),
          apiClient.get<{ success: boolean; data: RecentInterest[] }>("/api/interests?limit=5"),
        ])
        setRecentCars(carsRes.data.slice(0, 5))
        setRecentInterests(interestsRes.data.slice(0, 5))
        setStats({
          totalCars: carsRes.data.length,
          inStockCars: carsRes.data.filter((c) => c.status === "in_stock").length,
          soldCars: carsRes.data.filter((c) => c.status === "sold").length,
          totalCustomers: 0,
          totalInterests: interestsRes.data.length,
          activeInterests: interestsRes.data.filter(
            (i) => i.status !== "lost" && i.status !== "sold"
          ).length,
        })
      } catch {
        setStats({
          totalCars: 0,
          inStockCars: 0,
          soldCars: 0,
          totalCustomers: 0,
          totalInterests: 0,
          activeInterests: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  const statCards = [
    {
      label: "Toplam Araç",
      value: stats?.totalCars ?? 0,
      icon: Car,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: "/cars",
    },
    {
      label: "Stoktaki Araçlar",
      value: stats?.inStockCars ?? 0,
      icon: Car,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      link: "/cars",
    },
    {
      label: "Müşteriler",
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      link: "/customers",
    },
    {
      label: "Aktif İlgiler",
      value: stats?.activeInterests ?? 0,
      icon: Handshake,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      link: "/interests",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">İkinci el araç yönetim paneli</p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link
            key={label}
            to={link}
            className="bg-card hover:border-primary/30 group rounded-xl border p-6 transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              <div className={cn("flex size-9 items-center justify-center rounded-lg", bg)}>
                <Icon className={cn("size-4", color)} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-semibold tracking-tight">{value}</p>
              <ArrowRight className="text-muted-foreground/40 size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mb-8 h-px bg-border" />

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-medium">Son Eklenen Araçlar</h2>
            <Link to="/cars" className="text-primary text-xs hover:underline">
              Tümünü gör
            </Link>
          </div>
          {recentCars.length === 0 ? (
            <div className="py-8 text-center">
              <Car className="text-muted-foreground/30 mx-auto mb-3 size-10" />
              <p className="text-muted-foreground text-sm">Henüz araç eklenmemiş</p>
              <Link to="/cars" className="text-primary mt-2 inline-block text-sm hover:underline">
                İlk aracınızı ekleyin
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentCars.map((car) => (
                <Link
                  key={car.id}
                  to={`/cars/${car.id}`}
                  className="flex items-center gap-3 py-3 transition-colors hover:text-foreground/80"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{car.title}</p>
                    <p className="text-muted-foreground/70 truncate text-xs">
                      {car.brand} {car.model} · {car.year}
                    </p>
                  </div>
                  <Badge className={cn("shrink-0", statusColors[car.status] ?? "")}>
                    {statusLabels[car.status] ?? car.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-medium">Son Müşteri İlgileri</h2>
            <Link to="/interests" className="text-primary text-xs hover:underline">
              Tümünü gör
            </Link>
          </div>
          {recentInterests.length === 0 ? (
            <div className="py-8 text-center">
              <Handshake className="text-muted-foreground/30 mx-auto mb-3 size-10" />
              <p className="text-muted-foreground text-sm">Henüz ilgi kaydı yok</p>
              <Link
                to="/interests"
                className="text-primary mt-2 inline-block text-sm hover:underline"
              >
                İlk ilgi kaydını oluşturun
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentInterests.map((interest) => (
                <div key={interest.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{interest.customer_name}</p>
                    <p className="text-muted-foreground/70 truncate text-xs">
                      {interest.car_brand} {interest.car_model}
                    </p>
                  </div>
                  <Badge className={cn("shrink-0", statusColors[interest.status] ?? "")}>
                    {statusLabels[interest.status] ?? interest.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {stats && (
        <>
          <div className="my-8 h-px bg-border" />
          <div>
            <h2 className="mb-6 text-base font-medium">Satış İstatistikleri</h2>
            <div className="space-y-5">
              {[
                {
                  label: "Stoktaki araçlar",
                  value: stats.totalCars > 0 ? Math.round((stats.inStockCars / stats.totalCars) * 100) : 0,
                  color: "bg-emerald-500",
                },
                {
                  label: "Satılan araçlar",
                  value: stats.totalCars > 0 ? Math.round((stats.soldCars / stats.totalCars) * 100) : 0,
                  color: "bg-blue-500",
                },
                {
                  label: "Aktif ilgi oranı",
                  value:
                    stats.totalCars > 0
                      ? Math.round((stats.activeInterests / stats.totalCars) * 100)
                      : 0,
                  color: "bg-violet-500",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", color)}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
