import { Plus, Handshake, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Pagination } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
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
import { useInterests, statusLabels, statusColors } from "./use-interests"

export default function Interests() {
  const {
    interests, cars, customers, loading, saving,
    createOpen, setCreateOpen,
    editOpen, setEditOpen,
    deleteOpen, setDeleteOpen,
    selected, setSelected,
    form, setForm,
    statusFilter, setStatusFilter,
    setPage, pageSize, setPageSize,
    filtered, paginated, safePage,
    resetForm,
    handleCreate, handleEdit, handleDelete, openEdit,
    formatDate,
  } = useInterests()

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
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
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
        <>
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
              {paginated.map((interest) => (
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

          <Pagination
            total={filtered.length}
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
            <DialogTitle>Yeni İlgi Kaydı</DialogTitle>
            <DialogDescription>Araç ve müşteri arasında ilgi kaydı oluşturun</DialogDescription>
          </DialogHeader>
          <InterestForm form={form} setForm={setForm} cars={cars} customers={customers} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} saving={saving} />
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlgi Kaydı Düzenle</DialogTitle>
            <DialogDescription>Durum ve not bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <InterestForm form={form} setForm={setForm} cars={cars} customers={customers} onSubmit={handleEdit} onCancel={() => setEditOpen(false)} saving={saving} isEdit />
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
            <AlertDialogAction variant="destructive" onClick={handleDelete}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
