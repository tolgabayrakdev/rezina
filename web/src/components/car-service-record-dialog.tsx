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

export function CarServiceRecordDialog({ carId, open, onOpenChange, onSaved }: Props) {
  const [title, setTitle] = useState("")
  const [mileage, setMileage] = useState("")
  const [serviceDate, setServiceDate] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setTitle("")
    setMileage("")
    setServiceDate("")
    setNotes("")
  }

  const handleSave = async () => {
    if (!title) return
    setSaving(true)
    try {
      await apiClient.post(`/api/cars/${carId}/service-records`, {
        title,
        mileage: mileage ? parseInt(mileage) : null,
        service_date: serviceDate || null,
        notes: notes || null,
      })
      toast.success("Servis kaydı eklendi")
      reset()
      onOpenChange(false)
      onSaved()
    } catch {
      toast.error("Servis kaydı eklenemedi")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Servis Kaydı Ekle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Başlık *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Yağ soğutucu + zincir-triger seti değişimi"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>KM</Label>
              <Input
                type="number"
                min={0}
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="123000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tarih</Label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notlar</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Hangi parçalar değişti, hangi sorunlar giderildi..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false) }}>
            İptal
          </Button>
          <Button onClick={handleSave} disabled={saving || !title}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
