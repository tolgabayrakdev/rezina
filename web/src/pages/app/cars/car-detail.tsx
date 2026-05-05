import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { ArrowLeft, Car, Plus, Trash2, Loader2, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { apiClient, ApiClientError } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [saving, setSaving] = useState(false)

  const [imageUrl, setImageUrl] = useState("")
  const [isCover, setIsCover] = useState(false)
  const [linkPlatform, setLinkPlatform] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const fetchCar = async () => {
    if (!carId) return
    setLoading(true)
    try {
      const res = await apiClient.get<{ success: boolean; data: CarDetail }>(`/api/cars/${carId}`)
      setCar(res.data)
    } catch {
      toast.error("Araç yüklenemedi")
      navigate("/cars")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCar()
  }, [carId])

  const handleAddImage = async () => {
    if (!carId || !imageUrl) return
    setSaving(true)
    try {
      await apiClient.post(`/api/cars/${carId}/images`, { url: imageUrl, is_cover: isCover })
      toast.success("Fotoğraf eklendi")
      setImageDialogOpen(false)
      setImageUrl("")
      setIsCover(false)
      fetchCar()
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.data.message : "Fotoğraf eklenemedi"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
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

  const handleDeleteImage = async () => {
    if (!carId || !selectedImageId) return
    try {
      await apiClient.delete(`/api/cars/${carId}/images/${selectedImageId}`)
      toast.success("Fotoğraf silindi")
      setDeleteImageOpen(false)
      setSelectedImageId(null)
      fetchCar()
    } catch {
      toast.error("Fotoğraf silinemedi")
    }
  }

  const handleAddLink = async () => {
    if (!carId || !linkPlatform || !linkUrl) return
    setSaving(true)
    try {
      await apiClient.post(`/api/cars/${carId}/links`, { platform: linkPlatform, url: linkUrl })
      toast.success("Link eklendi")
      setLinkDialogOpen(false)
      setLinkPlatform("")
      setLinkUrl("")
      fetchCar()
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.data.message : "Link eklenemedi"
      toast.error(msg)
    } finally {
      setSaving(false)
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

  const formatPrice = (price: number | null) => {
    if (!price) return "-"
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link to="/cars">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{car.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {car.brand} {car.model} {car.year ? `· ${car.year}` : ""}
          </p>
        </div>
        <Select value={car.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_stock">Stokta</SelectItem>
            <SelectItem value="reserved">Rezerve</SelectItem>
            <SelectItem value="sold">Satıldı</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border p-6">
            <h2 className="mb-4 text-base font-medium">Fotoğraflar</h2>
            {car.images.length === 0 ? (
              <div className="bg-muted/50 flex flex-col items-center justify-center rounded-lg py-12">
                <Car className="text-muted-foreground/30 mb-3 size-10" />
                <p className="text-muted-foreground text-sm">Henüz fotoğraf eklenmemiş</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {car.images.map((img) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-lg border">
                    <img src={img.url} alt="" className="aspect-square w-full object-cover" />
                    {img.is_cover && (
                      <Badge className="absolute top-2 left-2">Kapak</Badge>
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
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setImageDialogOpen(true)}
            >
              <Plus className="mr-2 size-4" />
              Fotoğraf Ekle
            </Button>
          </div>

          {car.description && (
            <div className="bg-card rounded-xl border p-6">
              <h2 className="mb-3 text-base font-medium">Açıklama</h2>
              <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                {car.description}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border p-6">
            <h2 className="mb-4 text-base font-medium">Araç Bilgileri</h2>
            <div className="space-y-3">
              <InfoRow label="Fiyat" value={formatPrice(car.price)} />
              <InfoRow label="Kilometre" value={car.mileage ? `${car.mileage.toLocaleString("tr-TR")} km` : "-"} />
              <InfoRow label="Marka" value={car.brand || "-"} />
              <InfoRow label="Model" value={car.model || "-"} />
              <InfoRow label="Yıl" value={car.year?.toString() || "-"} />
              <InfoRow label="Durum" value={<Badge className={cn(statusColors[car.status])}>{statusLabels[car.status]}</Badge>} />
              <InfoRow label="Eklenme" value={formatDate(car.created_at)} />
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-medium">İlan Linkleri</h2>
              <Button variant="ghost" size="sm" onClick={() => setLinkDialogOpen(true)}>
                <Plus className="size-4" />
              </Button>
            </div>
            {car.links.length === 0 ? (
              <p className="text-muted-foreground text-sm">Henüz link eklenmemiş</p>
            ) : (
              <div className="space-y-2">
                {car.links.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 rounded-lg border p-2">
                    <LinkIcon className="text-muted-foreground size-4 shrink-0" />
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
                      size="sm"
                      className="h-6 w-6 shrink-0"
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

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fotoğraf Ekle</DialogTitle>
            <DialogDescription>Fotoğraf URL'sini girin</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCover"
                className="accent-primary h-4 w-4"
                checked={isCover}
                onChange={(e) => setIsCover(e.target.checked)}
              />
              <Label htmlFor="isCover">Kapak fotoğrafı olarak ayarla</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddImage} disabled={saving || !imageUrl}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlan Linki Ekle</DialogTitle>
            <DialogDescription>Platform ve URL bilgilerini girin</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={linkPlatform}
                onChange={(e) => setLinkPlatform(e.target.value)}
                placeholder="sahibinden, arabam.com..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddLink} disabled={saving || !linkPlatform || !linkUrl}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteImageOpen} onOpenChange={setDeleteImageOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fotoğraf silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteImage}>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
