import { Link } from "react-router"
import { Plus, Search, Car, Pencil, Trash2, Eye, SlidersHorizontal, X } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { useCars, statusLabels, statusColors, sortOptions } from "./use-cars"

const fmt = (val: string) => {
  const n = parseInt(val.replace(/\D/g, ""), 10)
  return isNaN(n) ? "" : n.toLocaleString("tr-TR")
}
const parse = (val: string) => val.replace(/[^\d]/g, "")

export default function Cars() {
  const {
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
  } = useCars()

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Araçlar</h1>
          <p className="text-muted-foreground text-sm">{cars.length} araç</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setCreateOpen(true)
          }}
        >
          <Plus className="mr-2 size-4" />
          Yeni Araç
        </Button>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm min-w-[200px] flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Araç ara..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
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
        <Select
          value={sortBy}
          onValueChange={(v) => {
            setSortBy(v as typeof sortBy)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[210px]">
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground"
          >
            <X className="mr-1 size-3.5" />
            Temizle
          </Button>
        )}
      </div>

      {/* Advanced filter panel */}
      {showFilters && (
        <div className="max-w-2xl rounded-lg border p-3">
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
                inputMode="numeric"
                placeholder="500.000"
                value={fmt(priceMin)}
                onChange={(e) => handleFilterChange(setPriceMin)(parse(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Fiyat max (₺)</label>
              <Input
                className="h-8 text-sm"
                inputMode="numeric"
                placeholder="2.000.000"
                value={fmt(priceMax)}
                onChange={(e) => handleFilterChange(setPriceMax)(parse(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">KM min</label>
              <Input
                className="h-8 text-sm"
                inputMode="numeric"
                placeholder="0"
                value={fmt(mileageMin)}
                onChange={(e) => handleFilterChange(setMileageMin)(parse(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">KM max</label>
              <Input
                className="h-8 text-sm"
                inputMode="numeric"
                placeholder="100.000"
                value={fmt(mileageMax)}
                onChange={(e) => handleFilterChange(setMileageMax)(parse(e.target.value))}
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
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                resetForm()
                setCreateOpen(true)
              }}
            >
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
                    <Link to={`/cars/${car.id}`} className="font-medium hover:underline">
                      {car.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {car.brand} {car.model}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{car.year ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {car.mileage ? `${car.mileage.toLocaleString("tr-TR")}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(statusColors[car.status] ?? "")}>
                      {statusLabels[car.status] ?? car.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatPrice(car.price)}</TableCell>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => openEdit(car)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => {
                          setSelectedCar(car)
                          setDeleteOpen(true)
                        }}
                      >
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
              <span className="font-semibold">{selectedCar?.title}</span> aracı silinecek. Bu işlem
              geri alınamaz.
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
