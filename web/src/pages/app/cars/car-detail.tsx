import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { ArrowLeft, FileDown } from "lucide-react"
import { type Expertise, type PanelStatus } from "@/types/expertise"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { exportCarReport } from "@/components/car-report-export"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { CarDetailPhotos } from "@/components/car-detail-photos"
import { CarDetailDescription } from "@/components/car-detail-description"
import { CarDetailMaintenance } from "@/components/car-detail-maintenance"
import { CarDetailServiceHistory } from "@/components/car-detail-service-history"
import { CarDetailExpertise } from "@/components/car-detail-expertise"
import { CarDetailInsurance } from "@/components/car-detail-insurance"
import { CarDetailLinks } from "@/components/car-detail-links"
import type { CarImage, CarLink, MaintenanceItem, ServiceRecord } from "@/types/car-detail"

interface CarDetail {
  id: string
  title: string
  brand: string
  model: string
  year: number | null
  mileage: number | null
  price: number | null
  status: string
  description: string | null
  expertise: Expertise | null
  fuel_type: string | null
  transmission: string | null
  body_type: string | null
  engine_power: number | null
  engine_volume: number | null
  drive_type: string | null
  color: string | null
  vehicle_type: string | null
  insurance_date: string | null
  inspection_date: string | null
  created_at: string
  updated_at: string
  images: CarImage[]
  links: CarLink[]
}

const statusLabels: Record<string, string> = {
  in_stock: "Stokta",
  reserved: "Rezerve",
  sold: "Satıldı",
}

const statusColors: Record<string, string> = {
  in_stock: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  reserved: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  sold: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

const fuelLabels: Record<string, string> = {
  gasoline: "Benzin",
  diesel: "Dizel",
  lpg: "LPG",
  electric: "Elektrik",
  hybrid: "Hibrit",
}

const transmissionLabels: Record<string, string> = {
  automatic: "Otomatik",
  manual: "Manuel",
}

const bodyTypeLabels: Record<string, string> = {
  sedan: "Sedan",
  hatchback: "Hatchback",
  suv: "SUV",
  station_wagon: "Station Wagon",
  pickup: "Pickup",
  truck: "Kamyon",
}

const driveTypeLabels: Record<string, string> = {
  fwd: "Önden Çekiş",
  rwd: "Arkadan İtiş",
  "4wd": "4x4",
  awd: "AWD",
}

const vehicleTypeLabels: Record<string, string> = {
  passenger: "Otomobil",
  commercial: "Ticari",
}

export default function CarDetail() {
  const { carId } = useParams<{ carId: string }>()
  const navigate = useNavigate()
  const [car, setCar] = useState<CarDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [expertise, setExpertise] = useState<Expertise>({})
  const [expertiseSaving, setExpertiseSaving] = useState(false)
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([])
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([])

  useEffect(() => {
    if (!carId) return
    let cancelled = false
    Promise.allSettled([
      apiClient.get<{ success: boolean; data: CarDetail }>(`/api/cars/${carId}`),
      apiClient.get<{ success: boolean; data: MaintenanceItem[] }>(
        `/api/cars/${carId}/maintenance`
      ),
      apiClient.get<{ success: boolean; data: ServiceRecord[] }>(
        `/api/cars/${carId}/service-records`
      ),
    ])
      .then(([carResult, maintResult, svcResult]) => {
        if (cancelled) return
        if (carResult.status === "rejected") {
          toast.error("Araç yüklenemedi")
          navigate("/cars")
          return
        }
        const carData = carResult.value.data
        setCar(carData)
        setExpertise(carData.expertise ?? {})
        if (maintResult.status === "fulfilled") setMaintenanceItems(maintResult.value.data)
        if (svcResult.status === "fulfilled") setServiceRecords(svcResult.value.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [carId, navigate])

  const fetchCar = async () => {
    if (!carId) return
    try {
      const res = await apiClient.get<{ success: boolean; data: CarDetail }>(`/api/cars/${carId}`)
      setCar(res.data)
    } catch {
      toast.error("Araç yüklenemedi")
    }
  }

  const fetchMaintenance = async () => {
    if (!carId) return
    try {
      const res = await apiClient.get<{ success: boolean; data: MaintenanceItem[] }>(
        `/api/cars/${carId}/maintenance`
      )
      setMaintenanceItems(res.data)
    } catch {
      toast.error("Bakım kalemleri yüklenemedi")
    }
  }

  const fetchServiceRecords = async () => {
    if (!carId) return
    try {
      const res = await apiClient.get<{ success: boolean; data: ServiceRecord[] }>(
        `/api/cars/${carId}/service-records`
      )
      setServiceRecords(res.data)
    } catch {
      toast.error("Servis kayıtları yüklenemedi")
    }
  }

  const handleExpertisePanelChange = (key: string, status: PanelStatus) => {
    setExpertise((prev) => ({ ...prev, [key]: status }))
  }

  const handleExpertiseSave = async () => {
    if (!carId) return
    setExpertiseSaving(true)
    try {
      await apiClient.patch(`/api/cars/${carId}`, { expertise })
      toast.success("Ekspertiz kaydedildi")
    } catch {
      toast.error("Ekspertiz kaydedilemedi")
    } finally {
      setExpertiseSaving(false)
    }
  }

  const handleStatusChange = async (status: string) => {
    if (!carId) return
    try {
      await apiClient.patch(`/api/cars/${carId}`, { status })
      toast.success("Durum güncellendi")
      fetchCar()
    } catch {
      toast.error("Durum güncellenemedi")
    }
  }

  const handleExportPdf = () => {
    if (!car) return
    exportCarReport(car, expertise, maintenanceItems, serviceRecords)
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!car) return null

  const formatPrice = (price: number | string | null) => {
    const num = Number(price)
    if (!num) return "-"
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(num)
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-3">
        <Link to="/cars">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight">{car.title}</h1>
          <p className="text-muted-foreground text-sm">
            {car.brand} {car.model} {car.year ? `· ${car.year}` : ""}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportPdf}>
          <FileDown className="mr-1.5 size-3.5" />
          Rapor
        </Button>
        <Select value={car.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_stock">Stokta</SelectItem>
            <SelectItem value="reserved">Rezerve</SelectItem>
            <SelectItem value="sold">Satıldı</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <CarDetailPhotos carId={car.id} images={car.images} onRefresh={fetchCar} />
          <CarDetailDescription
            carId={car.id}
            description={car.description}
            onSaved={(desc) => setCar((prev) => (prev ? { ...prev, description: desc } : prev))}
          />
          <CarDetailMaintenance
            carId={car.id}
            items={maintenanceItems}
            currentMileage={car.mileage}
            onRefresh={fetchMaintenance}
          />
          <CarDetailServiceHistory
            carId={car.id}
            records={serviceRecords}
            onRefresh={fetchServiceRecords}
          />
          <CarDetailExpertise
            expertise={expertise}
            onChange={handleExpertisePanelChange}
            onSave={handleExpertiseSave}
            saving={expertiseSaving}
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Araç Bilgileri
            </p>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Fiyat</TableCell>
                  <TableCell className="pr-0 text-right font-medium">
                    {formatPrice(car.price)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Kilometre</TableCell>
                  <TableCell className="pr-0 text-right font-medium">
                    {car.mileage ? `${car.mileage.toLocaleString("tr-TR")} km` : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Marka</TableCell>
                  <TableCell className="pr-0 text-right font-medium">{car.brand || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Model</TableCell>
                  <TableCell className="pr-0 text-right font-medium">{car.model || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Yıl</TableCell>
                  <TableCell className="pr-0 text-right font-medium">
                    {car.year?.toString() || "-"}
                  </TableCell>
                </TableRow>
                {(
                  [
                    { field: "fuel_type", label: "Yakıt", labels: fuelLabels },
                    { field: "transmission", label: "Vites", labels: transmissionLabels },
                    { field: "body_type", label: "Kasa", labels: bodyTypeLabels },
                    { field: "drive_type", label: "Çekiş", labels: driveTypeLabels },
                  ] as const
                ).map(({ field, label, labels }) => (
                  <TableRow key={field}>
                    <TableCell className="text-muted-foreground pl-0">{label}</TableCell>
                    <TableCell className="pr-0 text-right font-medium">
                      {car[field] ? (
                        (labels as Record<string, string>)[car[field]!]
                      ) : (
                        <span className="text-muted-foreground font-normal">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(
                  [
                    { field: "engine_power", label: "Motor Gücü", suffix: "hp" },
                    { field: "engine_volume", label: "Motor Hacmi", suffix: "cc" },
                    { field: "color", label: "Renk", suffix: "" },
                  ] as const
                ).map(({ field, label, suffix }) => (
                  <TableRow key={field}>
                    <TableCell className="text-muted-foreground pl-0">{label}</TableCell>
                    <TableCell className="pr-0 text-right font-medium">
                      {car[field] != null ? (
                        `${car[field]}${suffix ? ` ${suffix}` : ""}`
                      ) : (
                        <span className="text-muted-foreground font-normal">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {car.vehicle_type && (
                  <TableRow>
                    <TableCell className="text-muted-foreground pl-0">Ruhsat</TableCell>
                    <TableCell className="pr-0 text-right font-medium">
                      {vehicleTypeLabels[car.vehicle_type]}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Durum</TableCell>
                  <TableCell className="pr-0 text-right">
                    <Badge className={cn(statusColors[car.status])}>
                      {statusLabels[car.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Eklenme</TableCell>
                  <TableCell className="pr-0 text-right text-sm">
                    {formatDate(car.created_at)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <CarDetailInsurance
            carId={car.id}
            insuranceDate={car.insurance_date}
            inspectionDate={car.inspection_date}
            vehicleType={car.vehicle_type}
            onUpdate={(field, value) =>
              setCar((prev) => (prev ? { ...prev, [field]: value } : prev))
            }
          />

          <CarDetailLinks carId={car.id} links={car.links} onRefresh={fetchCar} />
        </div>
      </div>
    </div>
  )
}
