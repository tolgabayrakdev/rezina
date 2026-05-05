import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Plus, Search, Car, Pencil, Trash2, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiClient, ApiClientError } from "@/lib/api-client"
import { cn } from "@/lib/utils"

interface CarItem {
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
}

interface CarFormProps {
  form: {
    title: string
    brand: string
    model: string
    year: string
    mileage: string
    price: string
    status: string
    description: string
  }
  setForm: React.Dispatch<React.SetStateAction<CarFormProps["form"]>>
  onSubmit: () => void
  onCancel: () => void
  saving: boolean
  isEdit?: boolean
}

function CarForm({ form, setForm, onSubmit, onCancel, saving, isEdit }: CarFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Araç Başlığı *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Örn: 2020 BMW 3.20i M Sport"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Marka</Label>
          <Input
            id="brand"
            value={form.brand}
            onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
            placeholder="BMW"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={form.model}
            onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
            placeholder="3.20i M Sport"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Yıl</Label>
          <Input
            id="year"
            type="number"
            value={form.year}
            onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
            placeholder="2020"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">Kilometre</Label>
          <Input
            id="mileage"
            type="number"
            value={form.mileage}
            onChange={(e) => setForm((p) => ({ ...p, mileage: e.target.value }))}
            placeholder="45000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Fiyat (₺)</Label>
          <Input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="850000"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Durum</Label>
        <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_stock">Stokta</SelectItem>
            <SelectItem value="reserved">Rezerve</SelectItem>
            <SelectItem value="sold">Satıldı</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Araç hakkında detaylar..."
          rows={3}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button onClick={onSubmit} disabled={saving || !form.title}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEdit ? "Güncelle" : "Ekle"}
        </Button>
      </DialogFooter>
    </div>
  )
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

type CarFormState = {
  title: string
  brand: string
  model: string
  year: string
  mileage: string
  price: string
  status: string
  description: string
}

export default function Cars() {
  const [cars, setCars] = useState<CarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<CarItem | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<CarFormState>({
    title: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    status: "in_stock",
    description: "",
  })

  useEffect(() => {
    let cancelled = false
    apiClient.get<{ success: boolean; data: CarItem[] }>("/api/cars")
      .then((res) => {
        if (!cancelled) setCars(res.data)
      })
      .catch(() => {
        toast.error("Araçlar yüklenemedi")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const fetchCars = () => {
    apiClient.get<{ success: boolean; data: CarItem[] }>("/api/cars")
      .then((res) => setCars(res.data))
      .catch(() => toast.error("Araçlar yüklenemedi"))
  }

  const filteredCars = cars.filter((car) => {
    const matchSearch =
      !search ||
      car.title.toLowerCase().includes(search.toLowerCase()) ||
      (car.brand?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (car.model?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchStatus = statusFilter === "all" || car.status === statusFilter
    return matchSearch && matchStatus
  })

  const resetForm = () => {
    setForm({ title: "", brand: "", model: "", year: "", mileage: "", price: "", status: "in_stock", description: "" })
  }

  const handleCreate = async () => {
    setSaving(true)
    try {
      await apiClient.post("/api/cars", {
        title: form.title,
        brand: form.brand || null,
        model: form.model || null,
        year: form.year ? parseInt(form.year) : null,
        mileage: form.mileage ? parseInt(form.mileage) : null,
        price: form.price ? parseFloat(form.price) : null,
        status: form.status,
        description: form.description || null,
      })
      toast.success("Araç eklendi")
      setCreateOpen(false)
      resetForm()
      fetchCars()
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.data.message : "Araç eklenemedi"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedCar) return
    setSaving(true)
    try {
      await apiClient.patch(`/api/cars/${selectedCar.id}`, {
        title: form.title,
        brand: form.brand || null,
        model: form.model || null,
        year: form.year ? parseInt(form.year) : null,
        mileage: form.mileage ? parseInt(form.mileage) : null,
        price: form.price ? parseFloat(form.price) : null,
        status: form.status,
        description: form.description || null,
      })
      toast.success("Araç güncellendi")
      setEditOpen(false)
      setSelectedCar(null)
      resetForm()
      fetchCars()
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.data.message : "Araç güncellenemedi"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCar) return
    try {
      await apiClient.delete(`/api/cars/${selectedCar.id}`)
      toast.success("Araç silindi")
      setDeleteOpen(false)
      setSelectedCar(null)
      fetchCars()
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.data.message : "Araç silinemedi"
      toast.error(msg)
    }
  }

  const openEdit = (car: CarItem) => {
    setSelectedCar(car)
    setForm({
      title: car.title,
      brand: car.brand ?? "",
      model: car.model ?? "",
      year: car.year?.toString() ?? "",
      mileage: car.mileage?.toString() ?? "",
      price: car.price?.toString() ?? "",
      status: car.status,
      description: car.description ?? "",
    })
    setEditOpen(true)
  }

  const openDelete = (car: CarItem) => {
    setSelectedCar(car)
    setDeleteOpen(true)
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "-"
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price)
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Araçlar</h1>
          <p className="text-muted-foreground mt-1 text-sm">Araç listenizi yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true) }}>
          <Plus className="mr-2 size-4" />
          Yeni Araç
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Araç ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="in_stock">Stokta</SelectItem>
            <SelectItem value="reserved">Rezerve</SelectItem>
            <SelectItem value="sold">Satıldı</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-6" />
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Car className="text-muted-foreground/30 mb-4 size-12" />
          <p className="text-muted-foreground mb-1 text-sm font-medium">Araç bulunamadı</p>
          <p className="text-muted-foreground/60 mb-4 text-xs">
            {search || statusFilter !== "all" ? "Filtreleri değiştirin" : "İlk aracınızı ekleyin"}
          </p>
          {!search && statusFilter === "all" && (
            <Button variant="outline" onClick={() => { resetForm(); setCreateOpen(true) }}>
              <Plus className="mr-2 size-4" />
              Araç Ekle
            </Button>
          )}
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Car className="text-primary size-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{car.title}</h3>
                    <Badge className={cn("shrink-0", statusColors[car.status] ?? "")}>
                      {statusLabels[car.status] ?? car.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground/70 text-xs">
                    {car.brand} {car.model} {car.year ? `· ${car.year}` : ""}
                    {car.mileage ? ` · ${car.mileage.toLocaleString("tr-TR")} km` : ""}
                  </p>
                  <p className="text-sm font-bold">{formatPrice(car.price)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 pl-12 sm:pl-0">
                <Link to={`/cars/${car.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="mr-1.5 size-3.5" />
                    Detay
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => openEdit(car)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openDelete(car)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Araç Ekle</DialogTitle>
            <DialogDescription>Araç bilgilerini girin</DialogDescription>
          </DialogHeader>
          <CarForm
            form={form}
            setForm={setForm}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            saving={saving}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Araç Düzenle</DialogTitle>
            <DialogDescription>Araç bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <CarForm
            form={form}
            setForm={setForm}
            onSubmit={handleEdit}
            onCancel={() => setEditOpen(false)}
            saving={saving}
            isEdit
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Araç silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{selectedCar?.title}</span> aracı silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
