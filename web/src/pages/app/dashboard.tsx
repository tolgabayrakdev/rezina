import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Car, Users, Handshake, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price)
  }

  const statItems = [
    { label: "Toplam Araç", value: stats?.totalCars ?? 0, icon: Car, link: "/cars" },
    { label: "Stokta", value: stats?.inStockCars ?? 0, icon: Car, link: "/cars" },
    { label: "Müşteriler", value: stats?.totalCustomers ?? 0, icon: Users, link: "/customers" },
    { label: "Aktif İlgi", value: stats?.activeInterests ?? 0, icon: Handshake, link: "/interests" },
  ]

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">İkinci el araç yönetim paneli</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statItems.map(({ label, value, icon: Icon, link }) => (
          <Link
            key={label}
            to={link}
            className="border-b pb-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</p>
              <Icon className="text-muted-foreground/40 size-4" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          </Link>
        ))}
      </div>

      {stats && (
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Performans</p>
          <div className="space-y-4">
            {[
              {
                label: "Stok oranı",
                value: stats.totalCars > 0 ? Math.round((stats.inStockCars / stats.totalCars) * 100) : 0,
                color: "bg-emerald-500",
              },
              {
                label: "Satış oranı",
                value: stats.totalCars > 0 ? Math.round((stats.soldCars / stats.totalCars) * 100) : 0,
                color: "bg-blue-500",
              },
              {
                label: "İlgi dönüşümü",
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
                  <span className="font-medium">%{value}</span>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className={cn("h-full rounded-full", color)}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Son Araçlar</p>
            <Link to="/cars" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs">
              Tümü <ArrowUpRight className="size-3" />
            </Link>
          </div>
          {recentCars.length === 0 ? (
            <p className="text-muted-foreground py-6 text-sm">Henüz araç eklenmemiş</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Araç</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">Fiyat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <Link to={`/cars/${car.id}`} className="hover:underline">
                        <div>
                          <p className="font-medium">{car.title}</p>
                          <p className="text-muted-foreground text-xs">
                            {car.brand} {car.model} · {car.year}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(statusColors[car.status] ?? "")}>
                        {statusLabels[car.status] ?? car.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(car.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Son İlgiler</p>
            <Link to="/interests" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs">
              Tümü <ArrowUpRight className="size-3" />
            </Link>
          </div>
          {recentInterests.length === 0 ? (
            <p className="text-muted-foreground py-6 text-sm">Henüz ilgi kaydı yok</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Araç</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInterests.map((interest) => (
                  <TableRow key={interest.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{interest.customer_name}</p>
                        {interest.customer_phone && (
                          <p className="text-muted-foreground text-xs">{interest.customer_phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {interest.car_brand} {interest.car_model}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(statusColors[interest.status] ?? "")}>
                        {statusLabels[interest.status] ?? interest.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
