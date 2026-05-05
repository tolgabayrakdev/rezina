import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { ArrowLeft, Car, Plus, Trash2, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { CarImageDialog } from "@/components/car-image-dialog"
import { CarLinkDialog } from "@/components/car-link-dialog"
import { CarDeleteImageDialog } from "@/components/car-delete-image-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

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

export default function CarDetail() {
  const { carId } = useParams<{ carId: string }>()
  const navigate = useNavigate()
  const [car, setCar] = useState<CarDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [deleteImageOpen, setDeleteImageOpen] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)

  useEffect(() => {
    if (!carId) return
    let cancelled = false
    apiClient.get<{ success: boolean; data: CarDetail }>(`/api/cars/${carId}`)
      .then((res) => {
        if (!cancelled) setCar(res.data)
      })
      .catch(() => {
        toast.error("Araç yüklenemedi")
        navigate("/cars")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [carId, navigate])

  const fetchCar = () => {
    if (!carId) return
    apiClient.get<{ success: boolean; data: CarDetail }>(`/api/cars/${carId}`)
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-3">
        <Link to="/cars">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold tracking-tight truncate">{car.title}</h1>
          <p className="text-muted-foreground text-sm">
            {car.brand} {car.model} {car.year ? `· ${car.year}` : ""}
          </p>
        </div>
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
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Fotoğraflar</p>
              <Button variant="outline" size="sm" onClick={() => setImageDialogOpen(true)}>
                <Plus className="mr-1.5 size-3.5" />
                Ekle
              </Button>
            </div>
            {car.images.length === 0 ? (
              <div className="border-dashed border-2 rounded-lg flex flex-col items-center justify-center py-12">
                <Car className="text-muted-foreground/30 mb-2 size-8" />
                <p className="text-muted-foreground text-sm">Henüz fotoğraf eklenmemiş</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {car.images.map((img) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-lg border">
                    <img src={img.url} alt="" className="aspect-square w-full object-cover" />
                    {img.is_cover && (
                      <Badge className="absolute top-2 left-2 text-[10px]">Kapak</Badge>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      {!img.is_cover && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleSetCover(img.id)}
                        >
                          Kapak yap
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
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

          {car.description && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Açıklama</p>
              <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                {car.description}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Araç Bilgileri</p>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Fiyat</TableCell>
                  <TableCell className="text-right pr-0 font-medium">{formatPrice(car.price)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Kilometre</TableCell>
                  <TableCell className="text-right pr-0 font-medium">
                    {car.mileage ? `${car.mileage.toLocaleString("tr-TR")} km` : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Marka</TableCell>
                  <TableCell className="text-right pr-0 font-medium">{car.brand || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Model</TableCell>
                  <TableCell className="text-right pr-0 font-medium">{car.model || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Yıl</TableCell>
                  <TableCell className="text-right pr-0 font-medium">{car.year?.toString() || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Durum</TableCell>
                  <TableCell className="text-right pr-0">
                    <Badge className={cn(statusColors[car.status])}>{statusLabels[car.status]}</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground pl-0">Eklenme</TableCell>
                  <TableCell className="text-right pr-0 text-sm">{formatDate(car.created_at)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">İlan Linkleri</p>
              <Button variant="ghost" size="icon" className="size-7" onClick={() => setLinkDialogOpen(true)}>
                <Plus className="size-3.5" />
              </Button>
            </div>
            {car.links.length === 0 ? (
              <p className="text-muted-foreground text-sm">Henüz link eklenmemiş</p>
            ) : (
              <div className="space-y-2">
                {car.links.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 border rounded-md p-2.5">
                    <LinkIcon className="text-muted-foreground size-3.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{link.platform}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary truncate text-xs hover:underline"
                      >
                        {link.url}
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
