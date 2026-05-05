import { useEffect, useState } from "react"
import { Plus, Handshake, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { apiClient, ApiClientError } from "@/lib/api-client"
import { InterestForm } from "@/components/interest-form"
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

interface Interest {
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

interface CarOption {
  id: string
  title: string
  brand: string
  model: string
}

interface CustomerOption {
  id: string
  name: string
  phone: string | null
}

const statusLabels: Record<string, string> = {
  interested: "İlgili",
  test_drive: "Test Sürüşü",
  negotiating: "Pazarlık",
  lost: "Kayıp",
  sold: "Satıldı",
}

const statusColors: Record<string, string> = {
  interested: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  test_drive: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  negotiating: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  lost: "bg-red-500/10 text-red-600 dark:text-red-400",
  sold: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

type InterestFormState = {
  car_id: string
  customer_id: string
  status: string
  note: string
}

export default function Interests() {
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

  const [form, setForm] = useState<InterestFormState>({
    car_id: "",
    customer_id: "",
    status: "interested",
    note: "",
  })

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
    return () => { cancelled = true }
  }, [])

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

  const filtered = interests.filter(
    (i) => statusFilter === "all" || i.status === statusFilter
  )

  const resetForm = () =>
    setForm({ car_id: "", customer_id: "", status: "interested", note: "" })

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
      const msg = err instanceof ApiClientError ? err.data.message : "İlgi kaydı eklenemedi"
      toast.error(msg)
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
      const msg = err instanceof ApiClientError ? err.data.message : "İlgi kaydı güncellenemedi"
      toast.error(msg)
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
      const msg = err instanceof ApiClientError ? err.data.message : "İlgi kaydı silinemedi"
      toast.error(msg)
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
          <h1 className="text-lg font-semibold tracking-tight">Müşteri İlgileri</h1>
          <p className="text-muted-foreground text-sm">{interests.length} kayıt</p>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true) }}>
          <Plus className="mr-2 size-4" />
          Yeni İlgi
        </Button>
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Durum filtresi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="interested">İlgili</SelectItem>
            <SelectItem value="test_drive">Test Sürüşü</SelectItem>
            <SelectItem value="negotiating">Pazarlık</SelectItem>
            <SelectItem value="sold">Satıldı</SelectItem>
            <SelectItem value="lost">Kayıp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-6" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Handshake className="text-muted-foreground/30 mb-3 size-10" />
          <p className="text-muted-foreground text-sm">İlgi kaydı bulunamadı</p>
          {statusFilter === "all" && (
            <Button variant="outline" size="sm" className="mt-3" onClick={() => { resetForm(); setCreateOpen(true) }}>
              <Plus className="mr-2 size-3.5" />
              İlgi Kaydı Oluştur
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Müşteri</TableHead>
              <TableHead>Araç</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Not</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((interest) => (
              <TableRow key={interest.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{interest.customer_name}</p>
                    {interest.customer_phone && (
                      <p className="text-muted-foreground text-xs">{interest.customer_phone}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {interest.car_brand} {interest.car_model}
                </TableCell>
                <TableCell>
                  <Badge className={cn(statusColors[interest.status] ?? "")}>
                    {statusLabels[interest.status] ?? interest.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {interest.note ? (
                    <span className="text-muted-foreground line-clamp-1 text-sm">{interest.note}</span>
                  ) : (
                    <span className="text-muted-foreground/50">-</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {formatDate(interest.updated_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(interest)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => { setSelected(interest); setDeleteOpen(true) }}>
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
            <DialogTitle>Yeni İlgi Kaydı</DialogTitle>
            <DialogDescription>Araç ve müşteri arasında ilgi kaydı oluşturun</DialogDescription>
          </DialogHeader>
          <InterestForm
            form={form}
            setForm={setForm}
            cars={cars}
            customers={customers}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            saving={saving}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlgi Kaydı Düzenle</DialogTitle>
            <DialogDescription>Durum ve not bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <InterestForm
            form={form}
            setForm={setForm}
            cars={cars}
            customers={customers}
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
            <AlertDialogTitle>İlgi kaydı silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
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
