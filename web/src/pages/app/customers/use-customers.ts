import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"

export interface Customer {
  id: string
  name: string
  phone: string | null
  created_at: string
}

const emptyForm = { name: "", phone: "" }

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [form, setForm] = useState(emptyForm)

  const fetchCustomers = () => {
    apiClient
      .get<{ success: boolean; data: Customer[] }>("/api/customers")
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error("Müşteriler yüklenemedi"))
  }

  useEffect(() => {
    let cancelled = false
    apiClient
      .get<{ success: boolean; data: Customer[] }>("/api/customers")
      .then((res) => {
        if (!cancelled) setCustomers(res.data)
      })
      .catch(() => toast.error("Müşteriler yüklenemedi"))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.phone?.includes(search) ?? false)
      ),
    [customers, search]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const resetForm = () => setForm(emptyForm)

  const handleCreate = async () => {
    if (!form.name) return
    setSaving(true)
    try {
      await apiClient.post("/api/customers", { name: form.name, phone: form.phone || null })
      toast.success("Müşteri eklendi")
      setCreateOpen(false)
      resetForm()
      fetchCustomers()
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.data.message : "Müşteri eklenemedi")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!selected || !form.name) return
    setSaving(true)
    try {
      await apiClient.patch(`/api/customers/${selected.id}`, {
        name: form.name,
        phone: form.phone || null,
      })
      toast.success("Müşteri güncellendi")
      setEditOpen(false)
      setSelected(null)
      resetForm()
      fetchCustomers()
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.data.message : "Müşteri güncellenemedi")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await apiClient.delete(`/api/customers/${selected.id}`)
      toast.success("Müşteri silindi")
      setDeleteOpen(false)
      setSelected(null)
      fetchCustomers()
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.data.message : "Müşteri silinemedi")
    }
  }

  const openEdit = (c: Customer) => {
    setSelected(c)
    setForm({ name: c.name, phone: c.phone ?? "" })
    setEditOpen(true)
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })

  return {
    customers,
    loading,
    saving,
    search,
    setSearch,
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
