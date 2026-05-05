import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient, ApiClientError } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CarImageDialogProps {
  carId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function CarImageDialog({ carId, open, onOpenChange, onSaved }: CarImageDialogProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [isCover, setIsCover] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!carId || !imageUrl) return
    setSaving(true)
    try {
      await apiClient.post(`/api/cars/${carId}/images`, { url: imageUrl, is_cover: isCover })
      toast.success("Fotoğraf eklendi")
      onOpenChange(false)
      setImageUrl("")
      setIsCover(false)
      onSaved()
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.data.message : "Fotoğraf eklenemedi"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fotoğraf Ekle</DialogTitle>
          <DialogDescription>Fotoğraf URL'sini girin</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCover"
              className="accent-primary h-4 w-4"
              checked={isCover}
              onChange={(e) => setIsCover(e.target.checked)}
            />
            <Label htmlFor="isCover">Kapak fotoğrafı olarak ayarla</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleAdd} disabled={saving || !imageUrl}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
