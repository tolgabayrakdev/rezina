import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { apiClient } from "@/lib/api-client"

interface Props {
  carId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function CarMaintenanceDialog({ carId, open, onOpenChange, onSaved }: Props) {
  const [name, setName] = useState("")
  const [intervalKm, setIntervalKm] = useState("")
  const [lastDoneMileage, setLastDoneMileage] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setName("")
    setIntervalKm("")
    setLastDoneMileage("")
    setNotes("")
  }

  const handleSave = async () => {
    if (!name || !intervalKm) return
    setSaving(true)
    try {
      await apiClient.post(`/api/cars/${carId}/maintenance`, {
        name,
        interval_km: parseInt(intervalKm),
        last_done_mileage: lastDoneMileage ? parseInt(lastDoneMileage) : null,
        notes: notes || null,
      })
      toast.success("Bakım kalemi eklendi")
      reset()
      onOpenChange(false)
      onSaved()
    } catch {
      toast.error("Bakım kalemi eklenemedi")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bakım Kalemi Ekle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Bakım Adı *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Yağ & Filtre Değişimi"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Periyot (km) *</Label>
            <Input
              type="number"
              min={1}
              value={intervalKm}
              onChange={(e) => setIntervalKm(e.target.value)}
              placeholder="10000"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Son Yapıldığı KM</Label>
            <Input
              type="number"
              min={0}
              value={lastDoneMileage}
              onChange={(e) => setLastDoneMileage(e.target.value)}
              placeholder="85000"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Notlar</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ek notlar..."
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              reset()
              onOpenChange(false)
            }}
          >
            İptal
          </Button>
          <Button onClick={handleSave} disabled={saving || !name || !intervalKm}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
