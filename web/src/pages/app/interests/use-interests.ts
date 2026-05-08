import { useEffect, useState } from "react"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"

export interface Interest {
  id: string
  car_id: string
  customer_id: string
  status: string
  note: string | null
  created_at: string
  updated_at: string
  car_title: string
  car_brand: string
  car_model: string
  customer_name: string
  customer_phone: string | null
}

export interface CarOption {
  id: string
  title: string
  brand: string
  model: string
}

export interface CustomerOption {
  id: string
  name: string
  phone: string | null
}

export type InterestFormState = {
  car_id: string
  customer_id: string
  status: string
  note: string
}

export const statusLabels: Record<string, string> = {
  interested: "İlgili",
  test_drive: "Test Sürüşü",
  negotiating: "Pazarlık",
  lost: "Kayıp",
  sold: "Satıldı",
}

export const statusColors: Record<string, string> = {
  interested: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  test_drive: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  negotiating: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  lost: "bg-red-500/10 text-red-600 dark:text-red-400",
  sold: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

const emptyForm: InterestFormState = { car_id: "", customer_id: "", status: "interested", note: "" }

export function useInterests() {
  const [interests, setInterests] = useState<Interest[]>([])
  const [cars, setCars] = useState<CarOption[]>([])
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Interest | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [form, setForm] = useState<InterestFormState>(emptyForm)

  const fetchData = () => {
    Promise.all([
      apiClient.get<{ success: boolean; data: Interest[] }>("/api/interests"),
      apiClient.get<{ success: boolean; data: CarOption[] }>("/api/cars"),
      apiClient.get<{ success: boolean; data: CustomerOption[] }>("/api/customers"),
    ])
      .then(([interestsRes, carsRes, customersRes]) => {
        setInterests(interestsRes.data)
        setCars(carsRes.data)
        setCustomers(customersRes.data)
      })
      .catch(() => toast.error("Veriler yüklenemedi"))
  }

  useEffect(() => {
    let cancelled = false
    Promise.all([
      apiClient.get<{ success: boolean; data: Interest[] }>("/api/interests"),
      apiClient.get<{ success: boolean; data: CarOption[] }>("/api/cars"),
      apiClient.get<{ success: boolean; data: CustomerOption[] }>("/api/customers"),
    ])
      .then(([interestsRes, carsRes, customersRes]) => {
        if (!cancelled) {
          setInterests(interestsRes.data)
          setCars(carsRes.data)
          setCustomers(customersRes.data)
        }
      })
      .catch(() => toast.error("Veriler yüklenemedi"))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = interests.filter((i) => statusFilter === "all" || i.status === statusFilter)

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const resetForm = () => setForm(emptyForm)

  const handleCreate = async () => {
    if (!form.car_id || !form.customer_id) return
    setSaving(true)
    try {
      await apiClient.post("/api/interests", {
        car_id: form.car_id,
        customer_id: form.customer_id,
        status: form.status,
        note: form.note || null,
      })
      toast.success("İlgi kaydı eklendi")
      setCreateOpen(false)
      resetForm()
      fetchData()
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.data.message : "İlgi kaydı eklenemedi")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await apiClient.patch(`/api/interests/${selected.id}`, {
        status: form.status,
        note: form.note || null,
      })
      toast.success("İlgi kaydı güncellendi")
      setEditOpen(false)
      setSelected(null)
      resetForm()
      fetchData()
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.data.message : "İlgi kaydı güncellenemedi")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await apiClient.delete(`/api/interests/${selected.id}`)
      toast.success("İlgi kaydı silindi")
      setDeleteOpen(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.data.message : "İlgi kaydı silinemedi")
    }
  }

  const openEdit = (interest: Interest) => {
    setSelected(interest)
    setForm({
      car_id: interest.car_id,
      customer_id: interest.customer_id,
      status: interest.status,
      note: interest.note ?? "",
    })
    setEditOpen(true)
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })

  return {
    interests,
    cars,
    customers,
    loading,
    saving,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    selected,
    setSelected,
    form,
    setForm,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    filtered,
    paginated,
    safePage,
    resetForm,
    handleCreate,
    handleEdit,
    handleDelete,
    openEdit,
    formatDate,
  }
}
