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

interface CarLinkDialogProps {
  carId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function CarLinkDialog({ carId, open, onOpenChange, onSaved }: CarLinkDialogProps) {
  const [linkPlatform, setLinkPlatform] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!carId || !linkPlatform || !linkUrl) return
    setSaving(true)
    try {
      await apiClient.post(`/api/cars/${carId}/links`, { platform: linkPlatform, url: linkUrl })
      toast.success("Link eklendi")
      onOpenChange(false)
      setLinkPlatform("")
      setLinkUrl("")
      onSaved()
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.data.message : "Link eklenemedi"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>İlan Linki Ekle</DialogTitle>
          <DialogDescription>Platform ve URL bilgilerini girin</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={linkPlatform}
              onChange={(e) => setLinkPlatform(e.target.value)}
              placeholder="sahibinden, arabam.com..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkUrl">URL</Label>
            <Input
              id="linkUrl"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleAdd} disabled={saving || !linkPlatform || !linkUrl}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
