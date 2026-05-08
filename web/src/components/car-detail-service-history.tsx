import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CarServiceRecordDialog } from "@/components/car-service-record-dialog"
import { apiClient } from "@/lib/api-client"
import type { ServiceRecord } from "@/types/car-detail"

interface Props {
  carId: string
  records: ServiceRecord[]
  onRefresh: () => void
}

function formatShortDate(date: string) {
  return new Date(date.split("T")[0] + "T12:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function CarDetailServiceHistory({ carId, records, onRefresh }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDelete = async (recordId: string) => {
    try {
      await apiClient.delete(`/api/cars/${carId}/service-records/${recordId}`)
      toast.success("Servis kaydı silindi")
      onRefresh()
    } catch {
      toast.error("Servis kaydı silinemedi")
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Servis Geçmişi
        </p>
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1.5 size-3.5" />
          Ekle
        </Button>
      </div>

      {records.length === 0 ? (
        <p className="text-muted-foreground/50 text-sm italic">Henüz servis kaydı eklenmemiş</p>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <div key={record.id} className="rounded-lg border p-3 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{record.title}</p>
                  <div className="text-muted-foreground text-xs flex items-center gap-2 mt-0.5">
                    {record.mileage != null && (
                      <span>{record.mileage.toLocaleString("tr-TR")} km</span>
                    )}
                    {record.service_date && (
                      <span>{formatShortDate(record.service_date)}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0"
                  onClick={() => handleDelete(record.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
              {record.notes && (
                <p className="text-muted-foreground text-xs border-t pt-1.5">{record.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <CarServiceRecordDialog
        carId={carId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={onRefresh}
      />
    </div>
  )
}
