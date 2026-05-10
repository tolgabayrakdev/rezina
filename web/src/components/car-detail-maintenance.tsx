import { useState } from "react"
import { Plus, Trash2, Save, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CarMaintenanceDialog } from "@/components/car-maintenance-dialog"
import { apiClient } from "@/lib/api-client"
import type { MaintenanceItem } from "@/types/car-detail"

interface Props {
  carId: string
  items: MaintenanceItem[]
  currentMileage: number | null
  onRefresh: () => void
}

function MaintenanceBadge({
  item,
  currentMileage,
}: {
  item: MaintenanceItem
  currentMileage: number | null
}) {
  if (item.last_done_mileage == null)
    return <span className="text-muted-foreground/50 text-xs italic">Henüz yapılmadı</span>

  const nextDue = item.last_done_mileage + item.interval_km
  const remaining = nextDue - (currentMileage ?? 0)
  const threshold = Math.round(item.interval_km * 0.1)

  if (remaining < 0)
    return (
      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
        {Math.abs(remaining).toLocaleString("tr-TR")} km geçildi
      </span>
    )
  if (remaining <= threshold)
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
        {remaining.toLocaleString("tr-TR")} km kaldı
      </span>
    )
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      {remaining.toLocaleString("tr-TR")} km kaldı
    </span>
  )
}

export function CarDetailMaintenance({ carId, items, currentMileage, onRefresh }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [doneItemId, setDoneItemId] = useState<string | null>(null)
  const [doneKmValue, setDoneKmValue] = useState("")
  const [doneSaving, setDoneSaving] = useState(false)

  const handleMarkDone = async (itemId: string) => {
    if (!doneKmValue) return
    setDoneSaving(true)
    try {
      await apiClient.patch(`/api/cars/${carId}/maintenance/${itemId}`, {
        last_done_mileage: parseInt(doneKmValue),
      })
      toast.success("Bakım güncellendi")
      setDoneItemId(null)
      setDoneKmValue("")
      onRefresh()
    } catch {
      toast.error("Bakım güncellenemedi")
    } finally {
      setDoneSaving(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      await apiClient.delete(`/api/cars/${carId}/maintenance/${itemId}`)
      toast.success("Bakım kalemi silindi")
      onRefresh()
    } catch {
      toast.error("Bakım kalemi silinemedi")
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Bakım Takibi
        </p>
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1.5 size-3.5" />
          Ekle
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground/50 text-sm italic">Henüz bakım kalemi eklenmemiş</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const nextDue =
              item.last_done_mileage != null ? item.last_done_mileage + item.interval_km : null
            return (
              <div key={item.id} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      Her {item.interval_km.toLocaleString("tr-TR")} km
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        setDoneItemId(item.id)
                        setDoneKmValue(currentMileage?.toString() ?? "")
                      }}
                    >
                      Yapıldı
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>

                {doneItemId === item.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={doneKmValue}
                      onChange={(e) => setDoneKmValue(e.target.value)}
                      placeholder="KM giriniz"
                      className="h-7 text-xs"
                    />
                    <Button
                      size="sm"
                      className="h-7 shrink-0 px-2 text-xs"
                      onClick={() => handleMarkDone(item.id)}
                      disabled={doneSaving || !doneKmValue}
                    >
                      <Save className="mr-1 size-3" />
                      Kaydet
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0"
                      onClick={() => {
                        setDoneItemId(null)
                        setDoneKmValue("")
                      }}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-muted-foreground space-y-0.5 text-xs">
                      {item.last_done_mileage != null && (
                        <div>Son: {item.last_done_mileage.toLocaleString("tr-TR")} km</div>
                      )}
                      {nextDue != null && <div>Sıradaki: {nextDue.toLocaleString("tr-TR")} km</div>}
                    </div>
                    <MaintenanceBadge item={item} currentMileage={currentMileage} />
                  </div>
                )}

                {item.notes && (
                  <p className="text-muted-foreground mt-1 border-t pt-1.5 text-xs">{item.notes}</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <CarMaintenanceDialog
        carId={carId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={onRefresh}
      />
    </div>
  )
}
