import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Plus, Search, Car, Pencil, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { CarForm } from "@/components/car-form"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
      .catch(() => toast.error("Araçlar yüklenemedi"))
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

  const formatPrice = (price: number | null) => {
    if (!price) return "-"
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Araçlar</h1>
          <p className="text-muted-foreground text-sm">{cars.length} araç</p>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true) }}>
          <Plus className="mr-2 size-4" />
          Yeni Araç
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Araç ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
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
          <Car className="text-muted-foreground/30 mb-3 size-10" />
          <p className="text-muted-foreground text-sm">Araç bulunamadı</p>
          {!search && statusFilter === "all" && (
            <Button variant="outline" size="sm" className="mt-3" onClick={() => { resetForm(); setCreateOpen(true) }}>
              <Plus className="mr-2 size-3.5" />
              Araç Ekle
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Araç</TableHead>
              <TableHead>Marka/Model</TableHead>
              <TableHead>Yıl</TableHead>
              <TableHead>Km</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">Fiyat</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  <Link to={`/cars/${car.id}`} className="hover:underline font-medium">
                    {car.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {car.brand} {car.model}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {car.year ?? "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {car.mileage ? `${car.mileage.toLocaleString("tr-TR")}` : "-"}
                </TableCell>
                <TableCell>
                  <Badge className={cn(statusColors[car.status] ?? "")}>
                    {statusLabels[car.status] ?? car.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(car.price)}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {formatDate(car.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/cars/${car.id}`}>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Eye className="size-3.5" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(car)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => { setSelectedCar(car); setDeleteOpen(true) }}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
