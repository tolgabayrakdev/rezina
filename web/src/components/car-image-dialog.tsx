import { useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { apiClient, ApiClientError } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
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
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isCover, setIsCover] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith("image/")) handleFile(f)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const handleRemove = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleClose = (open: boolean) => {
    if (!open) handleRemove()
    setIsCover(false)
    onOpenChange(open)
  }

  const handleAdd = async () => {
    if (!file) return
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("is_cover", String(isCover))
      await apiClient.postForm(`/api/cars/${carId}/images`, formData)
      toast.success("Fotoğraf eklendi")
      handleClose(false)
      onSaved()
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.data.message : "Fotoğraf eklenemedi"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fotoğraf Ekle</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {preview ? (
            <div className="relative overflow-hidden rounded-lg border">
              <img src={preview} alt="" className="aspect-[4/3] w-full object-cover" />
              <button
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                onClick={handleRemove}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 transition-colors ${dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <ImagePlus className="text-muted-foreground mb-3 size-9" />
              <p className="text-sm font-medium">Resim seçmek için tıklayın</p>
              <p className="text-muted-foreground mt-1 text-xs">veya sürükleyip bırakın</p>
              <p className="text-muted-foreground mt-3 text-[11px]">PNG, JPG, WEBP · Maks. 10 MB</p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />

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
          <Button variant="outline" onClick={() => handleClose(false)}>
            İptal
          </Button>
          <Button onClick={handleAdd} disabled={saving || !file}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving ? "Yükleniyor..." : "Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
