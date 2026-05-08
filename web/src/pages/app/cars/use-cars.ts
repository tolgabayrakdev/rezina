import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"

export interface CarItem {
  id: string
  title: string
  brand: string
  model: string
  year: number | null
  mileage: number | null
  price: number | null
  status: string
  description: string | null
  fuel_type: string | null
  transmission: string | null
  body_type: string | null
  engine_power: number | null
  engine_volume: number | null
  drive_type: string | null
  color: string | null
  created_at: string
}

export type CarFormState = {
  title: string
  brand: string
  model: string
  year: string
  mileage: string
  price: string
  status: string
  description: string
  fuel_type: string
  transmission: string
  body_type: string
  engine_power: string
  engine_volume: string
  drive_type: string
  color: string
}

export type SortKey =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "mileage_asc"
  | "mileage_desc"
  | "year_asc"
  | "year_desc"

export const statusLabels: Record<string, string> = {
  in_stock: "Stokta",
  reserved: "Rezerve",
  sold: "Satıldı",
}

export const statusColors: Record<string, string> = {
  in_stock: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  reserved: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  sold: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "price_asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price_desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "mileage_asc", label: "KM: Az → Çok" },
  { value: "mileage_desc", label: "KM: Çok → Az" },
  { value: "year_asc", label: "Yıl: Eskiden Yeniye" },
  { value: "year_desc", label: "Yıl: Yeniden Eskiye" },
]

function applySortAndFilter(
  cars: CarItem[],
  filters: {
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
  }
) {
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
    if (filters.brand && !car.brand?.toLowerCase().includes(filters.brand.toLowerCase()))
      return false
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
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case "price_asc":
        return (a.price ?? 0) - (b.price ?? 0)
      case "price_desc":
        return (b.price ?? 0) - (a.price ?? 0)
      case "mileage_asc":
        return (a.mileage ?? 0) - (b.mileage ?? 0)
      case "mileage_desc":
        return (b.mileage ?? 0) - (a.mileage ?? 0)
      case "year_asc":
        return (a.year ?? 0) - (b.year ?? 0)
      case "year_desc":
        return (b.year ?? 0) - (a.year ?? 0)
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  return result
}

const emptyForm: CarFormState = {
  title: "",
  brand: "",
  model: "",
  year: "",
  mileage: "",
  price: "",
  status: "in_stock",
  description: "",
  fuel_type: "",
  transmission: "",
  body_type: "",
  engine_power: "",
  engine_volume: "",
  drive_type: "",
  color: "",
}

export function useCars() {
  const [cars, setCars] = useState<CarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<CarItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

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

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [form, setForm] = useState<CarFormState>(emptyForm)

  const fetchCars = () => {
    apiClient
      .get<{ success: boolean; data: CarItem[] }>("/api/cars")
      .then((res) => setCars(res.data))
      .catch(() => toast.error("Araçlar yüklenemedi"))
  }

  useEffect(() => {
    let cancelled = false
    apiClient
      .get<{ success: boolean; data: CarItem[] }>("/api/cars")
      .then((res) => {
        if (!cancelled) setCars(res.data)
      })
      .catch(() => toast.error("Araçlar yüklenemedi"))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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

  const filteredCars = useMemo(
    () =>
      applySortAndFilter(cars, {
        search,
        status: statusFilter,
        brand: brandFilter,
        yearMin,
        yearMax,
        priceMin,
        priceMax,
        mileageMin,
        mileageMax,
        sortBy,
      }),
    [
      cars,
      search,
      statusFilter,
      brandFilter,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      mileageMin,
      mileageMax,
      sortBy,
    ]
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

  const resetForm = () => setForm(emptyForm)

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
        fuel_type: form.fuel_type || null,
        transmission: form.transmission || null,
        body_type: form.body_type || null,
        engine_power: form.engine_power ? parseInt(form.engine_power) : null,
        engine_volume: form.engine_volume ? parseInt(form.engine_volume) : null,
        drive_type: form.drive_type || null,
        color: form.color || null,
      })
      toast.success("Araç eklendi")
      setCreateOpen(false)
      resetForm()
      fetchCars()
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.data.message : "Araç eklenemedi")
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
        fuel_type: form.fuel_type || null,
        transmission: form.transmission || null,
        body_type: form.body_type || null,
        engine_power: form.engine_power ? parseInt(form.engine_power) : null,
        engine_volume: form.engine_volume ? parseInt(form.engine_volume) : null,
        drive_type: form.drive_type || null,
        color: form.color || null,
      })
      toast.success("Araç güncellendi")
      setEditOpen(false)
      setSelectedCar(null)
      resetForm()
      fetchCars()
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.data.message : "Araç güncellenemedi")
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
      toast.error(err instanceof ApiClientError ? err.data.message : "Araç silinemedi")
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
      fuel_type: car.fuel_type ?? "",
      transmission: car.transmission ?? "",
      body_type: car.body_type ?? "",
      engine_power: car.engine_power?.toString() ?? "",
      engine_volume: car.engine_volume?.toString() ?? "",
      drive_type: car.drive_type ?? "",
      color: car.color ?? "",
    })
    setEditOpen(true)
  }

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

  return {
    cars,
    loading,
    saving,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    selectedCar,
    setSelectedCar,
    showFilters,
    setShowFilters,
    form,
    setForm,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    brandFilter,
    setBrandFilter,
    yearMin,
    setYearMin,
    yearMax,
    setYearMax,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    mileageMin,
    setMileageMin,
    mileageMax,
    setMileageMax,
    sortBy,
    setSortBy,
    page,
    setPage,
    pageSize,
    setPageSize,
    activeFilterCount,
    filteredCars,
    paginatedCars,
    safePage,
    resetFilters,
    handleFilterChange,
    resetForm,
    handleCreate,
    handleEdit,
    handleDelete,
    openEdit,
    formatPrice,
    formatDate,
  }
}
