import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import { Plus, Search, Car, Pencil, Trash2, Eye, SlidersHorizontal, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Pagination } from "@/components/ui/pagination"
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

type SortKey = "newest" | "oldest" | "price_asc" | "price_desc" | "mileage_asc" | "mileage_desc" | "year_asc" | "year_desc"

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "price_asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price_desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "mileage_asc", label: "KM: Az → Çok" },
  { value: "mileage_desc", label: "KM: Çok → Az" },
  { value: "year_asc", label: "Yıl: Eskiden Yeniye" },
  { value: "year_desc", label: "Yıl: Yeniden Eskiye" },
]

function applySortAndFilter(cars: CarItem[], filters: {
  search: string
  status: string
  brand: string
  yearMin: string
  yearMax: string
  priceMin: string
  priceMax: string
  mileageMin: string
  mileageMax: string
  sortBy: SortKey
}) {
  let result = cars.filter((car) => {
    if (filters.search) {
      const s = filters.search.toLowerCase()
      const match =
        car.title.toLowerCase().includes(s) ||
        (car.brand?.toLowerCase().includes(s) ?? false) ||
        (car.model?.toLowerCase().includes(s) ?? false)
      if (!match) return false
    }
    if (filters.status !== "all" && car.status !== filters.status) return false
    if (filters.brand && !car.brand?.toLowerCase().includes(filters.brand.toLowerCase())) return false
    if (filters.yearMin && (car.year ?? 0) < Number(filters.yearMin)) return false
    if (filters.yearMax && (car.year ?? 9999) > Number(filters.yearMax)) return false
    if (filters.priceMin && (car.price ?? 0) < Number(filters.priceMin)) return false
    if (filters.priceMax && (car.price ?? Infinity) > Number(filters.priceMax)) return false
    if (filters.mileageMin && (car.mileage ?? 0) < Number(filters.mileageMin)) return false
    if (filters.mileageMax && (car.mileage ?? Infinity) > Number(filters.mileageMax)) return false
    return true
  })

  result = [...result].sort((a, b) => {
    switch (filters.sortBy) {
      case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case "price_asc": return (a.price ?? 0) - (b.price ?? 0)
      case "price_desc": return (b.price ?? 0) - (a.price ?? 0)
      case "mileage_asc": return (a.mileage ?? 0) - (b.mileage ?? 0)
      case "mileage_desc": return (b.mileage ?? 0) - (a.mileage ?? 0)
      case "year_asc": return (a.year ?? 0) - (b.year ?? 0)
      case "year_desc": return (b.year ?? 0) - (a.year ?? 0)
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  return result
}

export default function Cars() {
  const [cars, setCars] = useState<CarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<CarItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("")
  const [yearMin, setYearMin] = useState("")
  const [yearMax, setYearMax] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [mileageMin, setMileageMin] = useState("")
  const [mileageMax, setMileageMax] = useState("")
  const [sortBy, setSortBy] = useState<SortKey>("newest")

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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

  const activeFilterCount = [
    brandFilter,
    yearMin,
    yearMax,
    priceMin,
    priceMax,
    mileageMin,
    mileageMax,
    statusFilter !== "all" ? statusFilter : "",
  ].filter(Boolean).length

  const filteredCars = useMemo(() =>
    applySortAndFilter(cars, {
      search, status: statusFilter, brand: brandFilter,
      yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax, sortBy,
    }),
    [cars, search, statusFilter, brandFilter, yearMin, yearMax, priceMin, priceMax, mileageMin, mileageMax, sortBy]
  )

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginatedCars = filteredCars.slice((safePage - 1) * pageSize, safePage * pageSize)

  const resetFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setBrandFilter("")
    setYearMin("")
    setYearMax("")
    setPriceMin("")
    setPriceMax("")
    setMileageMin("")
    setMileageMax("")
    setSortBy("newest")
    setPage(1)
  }

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v)
    setPage(1)
  }

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

  const formatPrice = (price: number | string | null) => {
    const num = Number(price)
    if (!num) return "-"
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(num)
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

      {/* Search + Filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Araç ara..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="in_stock">Stokta</SelectItem>
            <SelectItem value="reserved">Rezerve</SelectItem>
            <SelectItem value="sold">Satıldı</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => { setSortBy(v as SortKey); setPage(1) }}>
          <SelectTrigger className="w-[210px]">
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setShowFilters((p) => !p)}
          className={cn(showFilters && "border-primary text-primary")}
        >
          <SlidersHorizontal className="mr-2 size-4" />
          Filtreler
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground ml-1.5 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold">
              {activeFilterCount}
            </span>
          )}
        </Button>
        {(activeFilterCount > 0 || search) && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            <X className="mr-1 size-3.5" />
            Temizle
          </Button>
        )}
      </div>

      {/* Advanced filter panel */}
      {showFilters && (
        <div className="rounded-lg border p-3 max-w-2xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Marka</label>
              <Input
                className="h-8 text-sm"
                placeholder="Marka ara..."
                value={brandFilter}
                onChange={(e) => handleFilterChange(setBrandFilter)(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Yıl (min)</label>
              <Input
                className="h-8 text-sm"
                type="number"
                placeholder="örn. 2015"
                value={yearMin}
                onChange={(e) => handleFilterChange(setYearMin)(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Yıl (max)</label>
              <Input
                className="h-8 text-sm"
                type="number"
                placeholder="örn. 2024"
                value={yearMax}
                onChange={(e) => handleFilterChange(setYearMax)(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Fiyat min (₺)</label>
              <Input
                className="h-8 text-sm"
                type="number"
                placeholder="örn. 500000"
                value={priceMin}
                onChange={(e) => handleFilterChange(setPriceMin)(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Fiyat max (₺)</label>
              <Input
                className="h-8 text-sm"
                type="number"
                placeholder="örn. 2000000"
                value={priceMax}
                onChange={(e) => handleFilterChange(setPriceMax)(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">KM min</label>
              <Input
                className="h-8 text-sm"
                type="number"
                placeholder="örn. 0"
                value={mileageMin}
                onChange={(e) => handleFilterChange(setMileageMin)(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">KM max</label>
              <Input
                className="h-8 text-sm"
                type="number"
                placeholder="örn. 100000"
                value={mileageMax}
                onChange={(e) => handleFilterChange(setMileageMax)(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-6" />
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Car className="text-muted-foreground/30 mb-3 size-10" />
          <p className="text-muted-foreground text-sm">Araç bulunamadı</p>
          {!search && statusFilter === "all" && activeFilterCount === 0 && (
            <Button variant="outline" size="sm" className="mt-3" onClick={() => { resetForm(); setCreateOpen(true) }}>
              <Plus className="mr-2 size-3.5" />
              Araç Ekle
            </Button>
          )}
        </div>
      ) : (
        <>
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
              {paginatedCars.map((car) => (
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

          <Pagination
            total={filteredCars.length}
            page={safePage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
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
