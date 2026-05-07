import { useEffect, useState } from "react"
import { Link } from "react-router"
import {
  Car,
  Users,
  Handshake,
  ArrowUpRight,
  Plus,
  TrendingUp,
  Banknote,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CarItem {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  status: string
  created_at: string
}

interface InterestItem {
  id: string
  car_title: string
  car_brand: string
  car_model: string
  customer_name: string
  customer_phone: string
  status: string
  note: string
  updated_at: string
}

interface CustomerItem {
  id: string
  name: string
  phone: string | null
  created_at: string
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
  const user = useAuthStore((s) => s.user)
  const [cars, setCars] = useState<CarItem[]>([])
  const [interests, setInterests] = useState<InterestItem[]>([])
  const [customers, setCustomers] = useState<CustomerItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiClient.get<{ success: boolean; data: CarItem[] }>("/api/cars"),
      apiClient.get<{ success: boolean; data: InterestItem[] }>("/api/interests"),
      apiClient.get<{ success: boolean; data: CustomerItem[] }>("/api/customers"),
    ])
      .then(([carsRes, interestsRes, customersRes]) => {
        setCars(carsRes.data)
        setInterests(interestsRes.data)
        setCustomers(customersRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  const inStock = cars.filter((c) => c.status === "in_stock").length
  const reserved = cars.filter((c) => c.status === "reserved").length
  const sold = cars.filter((c) => c.status === "sold").length
  const activeInterests = interests.filter((i) => i.status !== "lost" && i.status !== "sold").length
  const totalRevenue = cars
    .filter((c) => c.status === "sold")
    .reduce((sum, c) => sum + (Number(c.price) || 0), 0)
  const soldWithPrice = cars.filter((c) => c.status === "sold" && c.price)
  const avgPrice = soldWithPrice.length > 0 ? totalRevenue / soldWithPrice.length : 0

  const formatPrice = (price: number | string | null) => {
    const num = Number(price)
    if (!num) return "-"
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(num)
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const recentCars = [...cars]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
  const recentInterests = [...interests]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8 p-8">
      <div>
        <p className="text-muted-foreground text-xs">{today}</p>
        <h1 className="mt-1 text-lg font-semibold tracking-tight">
          Hoş geldiniz, {user?.email?.split("@")[0]}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1 border-b pb-4">
          <div className="flex items-center gap-2">
            <Package className="text-muted-foreground size-3.5" />
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Stokta
            </p>
          </div>
          <p className="text-2xl font-semibold tracking-tight">{inStock}</p>
          <p className="text-muted-foreground text-xs">{cars.length} toplam araç</p>
        </div>

        <div className="space-y-1 border-b pb-4">
          <div className="flex items-center gap-2">
            <Handshake className="text-muted-foreground size-3.5" />
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Aktif İlgi
            </p>
          </div>
          <p className="text-2xl font-semibold tracking-tight">{activeInterests}</p>
          <p className="text-muted-foreground text-xs">{customers.length} kayıtlı müşteri</p>
        </div>

        <div className="space-y-1 border-b pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-muted-foreground size-3.5" />
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Satılan
            </p>
          </div>
          <p className="text-2xl font-semibold tracking-tight">{sold}</p>
          <p className="text-muted-foreground text-xs">{reserved} rezerve</p>
        </div>

        <div className="space-y-1 border-b pb-4">
          <div className="flex items-center gap-2">
            <Banknote className="text-muted-foreground size-3.5" />
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Satış Geliri
            </p>
          </div>
          <p className="text-2xl font-semibold tracking-tight">{formatPrice(totalRevenue)}</p>
          <p className="text-muted-foreground text-xs">Ort. {formatPrice(avgPrice)}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Son Araçlar
            </p>
            <Link
              to="/cars"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
            >
              Tümü <ArrowUpRight className="size-3" />
            </Link>
          </div>
          {recentCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10">
              <Car className="text-muted-foreground/30 mb-2 size-8" />
              <p className="text-muted-foreground text-sm">Henüz araç eklenmemiş</p>
              <Link to="/cars">
                <Button variant="outline" size="sm" className="mt-3">
                  <Plus className="mr-1.5 size-3.5" />
                  İlk Aracı Ekle
                </Button>
              </Link>
            </div>
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
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Durum Dağılımı
            </p>
          </div>
          <div className="space-y-3">
            {[
              { label: "Stokta", count: inStock, total: cars.length, color: "bg-blue-500" },
              { label: "Rezerve", count: reserved, total: cars.length, color: "bg-amber-500" },
              { label: "Satıldı", count: sold, total: cars.length, color: "bg-emerald-500" },
            ].map(({ label, count, total, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className={cn("h-full rounded-full", color)}
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3 border-t pt-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              İlgi Durumları
            </p>
            {[
              { label: "İlgili", count: interests.filter((i) => i.status === "interested").length },
              {
                label: "Test Sürüşü",
                count: interests.filter((i) => i.status === "test_drive").length,
              },
              {
                label: "Pazarlık",
                count: interests.filter((i) => i.status === "negotiating").length,
              },
              { label: "Satıldı", count: interests.filter((i) => i.status === "sold").length },
              { label: "Kayıp", count: interests.filter((i) => i.status === "lost").length },
            ].map(({ label, count }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Son İlgiler
          </p>
          <Link
            to="/interests"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
          >
            Tümü <ArrowUpRight className="size-3" />
          </Link>
        </div>
        {recentInterests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10">
            <Handshake className="text-muted-foreground/30 mb-2 size-8" />
            <p className="text-muted-foreground text-sm">Henüz ilgi kaydı yok</p>
            <Link to="/interests">
              <Button variant="outline" size="sm" className="mt-3">
                <Plus className="mr-1.5 size-3.5" />
                İlk Kaydı Oluştur
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>Araç</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Not</TableHead>
                <TableHead className="text-right">Tarih</TableHead>
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
                  <TableCell>
                    {interest.note ? (
                      <span className="text-muted-foreground line-clamp-1 text-sm">
                        {interest.note}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right text-xs">
                    {formatDate(interest.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Car className="size-3.5" />
              {cars.length} araç
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              {customers.length} müşteri
            </span>
            <span className="flex items-center gap-1.5">
              <Handshake className="size-3.5" />
              {interests.length} ilgi kaydı
            </span>
          </div>
          <p className="text-muted-foreground text-xs">BenGaraj Araç Yönetim Sistemi</p>
        </div>
      </div>
    </div>
  )
}
