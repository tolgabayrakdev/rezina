import { useState } from "react"
import { Pencil, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { apiClient } from "@/lib/api-client"

interface Props {
  carId: string
  description: string | null
  onSaved: (value: string) => void
}

export function CarDetailDescription({ carId, description, onSaved }: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState("")
  const [saving, setSaving] = useState(false)

  const handleEdit = () => {
    setValue(description ?? "")
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await apiClient.patch(`/api/cars/${carId}`, { description: value })
      onSaved(value)
      toast.success("Açıklama güncellendi")
      setEditing(false)
    } catch {
      toast.error("Açıklama güncellenemedi")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Açıklama
        </p>
        {!editing && (
          <Button variant="ghost" size="icon" className="size-7" onClick={handleEdit}>
            <Pencil className="size-3.5" />
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Araç hakkında açıklama yazın..."
            className="min-h-[120px] resize-none text-sm"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={saving}>
              İptal
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="mr-1.5 size-3.5" />
              Kaydet
            </Button>
          </div>
        </div>
      ) : description ? (
        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      ) : (
        <p className="text-muted-foreground/50 text-sm italic">Açıklama eklenmemiş</p>
      )}
    </div>
  )
}
