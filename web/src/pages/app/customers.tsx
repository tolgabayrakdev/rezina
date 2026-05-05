import { useEffect, useState } from "react"
import { Plus, Search, Users, Pencil, Trash2, Phone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import { CustomerForm } from "@/components/customer-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface Customer {
  id: string
  name: string
  phone: string | null
  created_at: string
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({ name: "", phone: "" })

  useEffect(() => {
    let cancelled = false
    apiClient.get<{ success: boolean; data: Customer[] }>("/api/customers")
      .then((res) => {
        if (!cancelled) setCustomers(res.data)
      })
      .catch(() => toast.error("Müşteriler yüklenemedi"))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const fetchCustomers = () => {
    apiClient.get<{ success: boolean; data: Customer[] }>("/api/customers")
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error("Müşteriler yüklenemedi"))
  }

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone?.includes(search) ?? false)
  )

  const resetForm = () => setForm({ name: "", phone: "" })

  const handleCreate = async () => {
    if (!form.name) return
    setSaving(true)
    try {
      await apiClient.post("/api/customers", {
        name: form.name,
        phone: form.phone || null,
      })
      toast.success("Müşteri eklendi")
      setCreateOpen(false)
      resetForm()
      fetchCustomers()
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.data.message : "Müşteri eklenemedi"
      toast.error(msg)
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
      const msg = err instanceof ApiClientError ? err.data.message : "Müşteri güncellenemedi"
      toast.error(msg)
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
      const msg = err instanceof ApiClientError ? err.data.message : "Müşteri silinemedi"
      toast.error(msg)
    }
  }

  const openEdit = (c: Customer) => {
    setSelected(c)
    setForm({ name: c.name, phone: c.phone ?? "" })
    setEditOpen(true)
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
          <h1 className="text-2xl font-semibold tracking-tight">Müşteriler</h1>
          <p className="text-muted-foreground mt-1 text-sm">Müşteri listenizi yönetin</p>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true) }}>
          <Plus className="mr-2 size-4" />
          Yeni Müşteri
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          className="pl-9"
          placeholder="Müşteri ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-6" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="text-muted-foreground/30 mb-4 size-12" />
          <p className="text-muted-foreground mb-1 text-sm font-medium">Müşteri bulunamadı</p>
          <p className="text-muted-foreground/60 mb-4 text-xs">
            {search ? "Aramayı değiştirin" : "İlk müşterinizi ekleyin"}
          </p>
          {!search && (
            <Button variant="outline" onClick={() => { resetForm(); setCreateOpen(true) }}>
              <Plus className="mr-2 size-4" />
              Müşteri Ekle
            </Button>
          )}
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {filtered.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                  <span className="text-primary text-sm font-semibold">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{customer.name}</p>
                  <div className="text-muted-foreground/70 flex items-center gap-1 text-xs">
                    {customer.phone && (
                      <>
                        <Phone className="size-3" />
                        {customer.phone}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-muted-foreground/50 mr-3 text-xs">{formatDate(customer.created_at)}</p>
                <Button variant="ghost" size="sm" onClick={() => openEdit(customer)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setSelected(customer); setDeleteOpen(true) }}>
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
            <DialogTitle>Yeni Müşteri Ekle</DialogTitle>
            <DialogDescription>Müşteri bilgilerini girin</DialogDescription>
          </DialogHeader>
          <CustomerForm
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
            <DialogTitle>Müşteri Düzenle</DialogTitle>
            <DialogDescription>Müşteri bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <CustomerForm
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
            <AlertDialogTitle>Müşteri silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{selected?.name}</span> müşterisi silinecek. Bu işlem geri alınamaz.
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
