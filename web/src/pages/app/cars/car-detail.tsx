import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import {
  ArrowLeft,
  Car,
  Plus,
  Trash2,
  Link as LinkIcon,
  Save,
  ChevronLeft,
  ChevronRight,
  X,
  Pencil,
  FileDown,
  Shield,
  ClipboardCheck,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CarBodyDiagram } from "@/components/car-body-diagram"
import { type Expertise, type PanelStatus } from "@/types/expertise"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { CarImageDialog } from "@/components/car-image-dialog"
import { CarLinkDialog } from "@/components/car-link-dialog"
import { CarDeleteImageDialog } from "@/components/car-delete-image-dialog"
import { exportCarReport } from "@/components/car-report-export"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

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

interface CarImage {
  id: string
  url: string
  is_cover: boolean
  created_at: string
}

interface CarLink {
  id: string
  platform: string
  url: string
  created_at: string
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

function getExpiryDate(dateStr: string, years: number): Date {
  const d = new Date(dateStr + "T12:00:00")
  d.setFullYear(d.getFullYear() + years)
  return d
}

function getDaysRemaining(dateStr: string | null, years: number): number | null {
  if (!dateStr) return null
  const expiry = getExpiryDate(dateStr, years)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000)
}

function StatusBadge({ days }: { days: number | null }) {
  if (days === null)
    return <span className="text-muted-foreground/50 text-xs italic">Tarih eklenmemiş</span>
  if (days < 0)
    return (
      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
        {Math.abs(days)} gün geçti
      </span>
    )
  if (days <= 30)
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
        {days} gün kaldı
      </span>
    )
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      {days} gün kaldı
    </span>
  )
}

export default function CarDetail() {
  const { carId } = useParams<{ carId: string }>()
  const navigate = useNavigate()
  const [car, setCar] = useState<CarDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [deleteImageOpen, setDeleteImageOpen] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [expertise, setExpertise] = useState<Expertise>({})
  const [expertiseSaving, setExpertiseSaving] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [editingDesc, setEditingDesc] = useState(false)
  const [descValue, setDescValue] = useState("")
  const [descSaving, setDescSaving] = useState(false)
  const [editingInsurance, setEditingInsurance] = useState(false)
  const [insuranceDateValue, setInsuranceDateValue] = useState("")
  const [insuranceSaving, setInsuranceSaving] = useState(false)
  const [editingInspection, setEditingInspection] = useState(false)
  const [inspectionDateValue, setInspectionDateValue] = useState("")
  const [inspectionSaving, setInspectionSaving] = useState(false)

  useEffect(() => {
    if (!carId) return
    let cancelled = false
    apiClient
      .get<{ success: boolean; data: CarDetail }>(`/api/cars/${carId}`)
      .then((res) => {
        if (!cancelled) {
          setCar(res.data)
          setExpertise(res.data.expertise ?? {})
          setDescValue(res.data.description ?? "")
        }
      })
      .catch(() => {
        toast.error("Araç yüklenemedi")
        navigate("/cars")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [carId, navigate])

  const fetchCar = () => {
    if (!carId) return
    apiClient
      .get<{ success: boolean; data: CarDetail }>(`/api/cars/${carId}`)
      .then((res) => setCar(res.data))
      .catch(() => toast.error("Araç yüklenemedi"))
  }

  const handleSetCover = async (imageId: string) => {
    if (!carId) return
    try {
      await apiClient.patch(`/api/cars/${carId}/images/${imageId}/cover`)
      toast.success("Kapak fotoğrafı güncellendi")
      fetchCar()
    } catch {
      toast.error("Kapak fotoğrafı güncellenemedi")
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!carId) return
    try {
      await apiClient.delete(`/api/cars/${carId}/links/${linkId}`)
      toast.success("Link silindi")
      fetchCar()
    } catch {
      toast.error("Link silinemedi")
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

  const handleDescSave = async () => {
    if (!carId) return
    setDescSaving(true)
    try {
      await apiClient.patch(`/api/cars/${carId}`, { description: descValue })
      setCar((prev) => (prev ? { ...prev, description: descValue } : prev))
      toast.success("Açıklama güncellendi")
      setEditingDesc(false)
    } catch {
      toast.error("Açıklama güncellenemedi")
    } finally {
      setDescSaving(false)
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

  const handleInsuranceSave = async () => {
    if (!carId) return
    setInsuranceSaving(true)
    try {
      await apiClient.patch(`/api/cars/${carId}`, {
        insurance_date: insuranceDateValue || null,
      })
      setCar((prev) => (prev ? { ...prev, insurance_date: insuranceDateValue || null } : prev))
      toast.success("Sigorta tarihi güncellendi")
      setEditingInsurance(false)
    } catch {
      toast.error("Sigorta tarihi güncellenemedi")
    } finally {
      setInsuranceSaving(false)
    }
  }

  const handleInspectionSave = async () => {
    if (!carId) return
    setInspectionSaving(true)
    try {
      await apiClient.patch(`/api/cars/${carId}`, {
        inspection_date: inspectionDateValue || null,
      })
      setCar((prev) => (prev ? { ...prev, inspection_date: inspectionDateValue || null } : prev))
      toast.success("Muayene tarihi güncellendi")
      setEditingInspection(false)
    } catch {
      toast.error("Muayene tarihi güncellenemedi")
    } finally {
      setInspectionSaving(false)
    }
  }

  const handleExportPdf = () => {
    exportCarReport(car, expertise)
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

  const getDisplayUrl = (url: string) => {
    try {
      const { hostname, pathname } = new URL(url)
      const path =
        pathname.length > 1 ? pathname.slice(0, 28) + (pathname.length > 28 ? "…" : "") : ""
      return hostname + path
    } catch {
      return url.slice(0, 40) + (url.length > 40 ? "…" : "")
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatShortDate = (date: string) => {
    return new Date(date + "T12:00:00").toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const inspectionYears = car.vehicle_type === "commercial" ? 1 : 2

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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Fotoğraflar
              </p>
              <Button variant="outline" size="sm" onClick={() => setImageDialogOpen(true)}>
                <Plus className="mr-1.5 size-3.5" />
                Ekle
              </Button>
            </div>
            {car.images.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
                <Car className="text-muted-foreground/30 mb-2 size-8" />
                <p className="text-muted-foreground text-sm">Henüz fotoğraf eklenmemiş</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {car.images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="group relative cursor-zoom-in overflow-hidden rounded-lg border"
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <img src={img.url} alt="" className="aspect-[4/3] w-full object-cover" />
                    {img.is_cover && (
                      <Badge className="absolute top-2 left-2 text-[10px]">Kapak</Badge>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      {!img.is_cover && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSetCover(img.id)
                          }}
                        >
                          Kapak yap
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImageId(img.id)
                          setDeleteImageOpen(true)
                        }}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Açıklama
              </p>
              {!editingDesc && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => {
                    setDescValue(car.description ?? "")
                    setEditingDesc(true)
                  }}
                >
                  <Pencil className="size-3.5" />
                </Button>
              )}
            </div>
            {editingDesc ? (
              <div className="space-y-2">
                <Textarea
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  placeholder="Araç hakkında açıklama yazın..."
                  className="min-h-[120px] resize-none text-sm"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingDesc(false)}
                    disabled={descSaving}
                  >
                    İptal
                  </Button>
                  <Button size="sm" onClick={handleDescSave} disabled={descSaving}>
                    <Save className="mr-1.5 size-3.5" />
                    Kaydet
                  </Button>
                </div>
              </div>
            ) : car.description ? (
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {car.description}
              </p>
            ) : (
              <p className="text-muted-foreground/50 text-sm italic">Açıklama eklenmemiş</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Ekspertiz Raporu
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExpertiseSave}
                disabled={expertiseSaving}
              >
                <Save className="mr-1.5 size-3.5" />
                Kaydet
              </Button>
            </div>
            <div className="rounded-lg border p-4">
              <CarBodyDiagram expertise={expertise} onChange={handleExpertisePanelChange} />
            </div>
          </div>
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

          {/* Sigorta & Muayene */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Sigorta & Muayene
            </p>
            <div className="space-y-2">
              {/* Sigorta */}
              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Shield className="text-muted-foreground size-3.5" />
                    <span className="text-sm font-medium">Sigorta</span>
                    <span className="text-muted-foreground text-xs">(1 yıl)</span>
                  </div>
                  {!editingInsurance ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => {
                        setInsuranceDateValue(car.insurance_date ?? "")
                        setEditingInsurance(true)
                      }}
                    >
                      <Pencil className="size-3" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={handleInsuranceSave}
                        disabled={insuranceSaving}
                      >
                        <Save className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setEditingInsurance(false)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {editingInsurance ? (
                  <input
                    type="date"
                    value={insuranceDateValue}
                    onChange={(e) => setInsuranceDateValue(e.target.value)}
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-8 w-full rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  />
                ) : car.insurance_date ? (
                  <div className="space-y-1.5">
                    <div className="text-muted-foreground text-xs space-y-0.5">
                      <div>Yapılma: {formatShortDate(car.insurance_date)}</div>
                      <div>
                        Bitiş:{" "}
                        {formatShortDate(
                          getExpiryDate(car.insurance_date, 1)
                            .toISOString()
                            .split("T")[0]
                        )}
                      </div>
                    </div>
                    <StatusBadge days={getDaysRemaining(car.insurance_date, 1)} />
                  </div>
                ) : (
                  <StatusBadge days={null} />
                )}
              </div>

              {/* Muayene */}
              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ClipboardCheck className="text-muted-foreground size-3.5" />
                    <span className="text-sm font-medium">Muayene</span>
                    <span className="text-muted-foreground text-xs">
                      ({inspectionYears} yıl ·{" "}
                      {car.vehicle_type === "commercial" ? "ticari" : "otomobil"})
                    </span>
                  </div>
                  {!editingInspection ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => {
                        setInspectionDateValue(car.inspection_date ?? "")
                        setEditingInspection(true)
                      }}
                    >
                      <Pencil className="size-3" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={handleInspectionSave}
                        disabled={inspectionSaving}
                      >
                        <Save className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setEditingInspection(false)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {editingInspection ? (
                  <input
                    type="date"
                    value={inspectionDateValue}
                    onChange={(e) => setInspectionDateValue(e.target.value)}
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-8 w-full rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  />
                ) : car.inspection_date ? (
                  <div className="space-y-1.5">
                    <div className="text-muted-foreground text-xs space-y-0.5">
                      <div>Yapılma: {formatShortDate(car.inspection_date)}</div>
                      <div>
                        Bitiş:{" "}
                        {formatShortDate(
                          getExpiryDate(car.inspection_date, inspectionYears)
                            .toISOString()
                            .split("T")[0]
                        )}
                      </div>
                    </div>
                    <StatusBadge days={getDaysRemaining(car.inspection_date, inspectionYears)} />
                  </div>
                ) : (
                  <StatusBadge days={null} />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                İlan Linkleri
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setLinkDialogOpen(true)}
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
            {car.links.length === 0 ? (
              <p className="text-muted-foreground text-sm">Henüz link eklenmemiş</p>
            ) : (
              <div className="space-y-2">
                {car.links.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 rounded-md border p-2.5">
                    <LinkIcon className="text-muted-foreground size-3.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{link.platform}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.url}
                        className="text-primary block truncate text-xs hover:underline"
                      >
                        {getDisplayUrl(link.url)}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <DialogContent className="max-w-5xl border-0 bg-black/95 p-0 shadow-2xl">
          {lightboxIndex !== null && (
            <div className="relative flex items-center justify-center">
              <img
                src={car.images[lightboxIndex].url}
                alt=""
                className="max-h-[88vh] w-full object-contain"
              />
              <button
                className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="size-4" />
              </button>
              {lightboxIndex > 0 && (
                <button
                  className="absolute left-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((i) => (i ?? 1) - 1)
                  }}
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {lightboxIndex < car.images.length - 1 && (
                <button
                  className="absolute right-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((i) => (i ?? 0) + 1)
                  }}
                >
                  <ChevronRight className="size-5" />
                </button>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white/70">
                {lightboxIndex + 1} / {car.images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CarImageDialog
        carId={carId!}
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onSaved={fetchCar}
      />

      <CarLinkDialog
        carId={carId!}
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onSaved={fetchCar}
      />

      <CarDeleteImageDialog
        carId={carId!}
        imageId={selectedImageId}
        open={deleteImageOpen}
        onOpenChange={setDeleteImageOpen}
        onDeleted={() => {
          setSelectedImageId(null)
          fetchCar()
        }}
      />
    </div>
  )
}
