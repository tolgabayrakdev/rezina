import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"

interface CustomerFormProps {
  form: { name: string; phone: string }
  setForm: React.Dispatch<React.SetStateAction<CustomerFormProps["form"]>>
  onSubmit: () => void
  onCancel: () => void
  saving: boolean
  isEdit?: boolean
}

export function CustomerForm({ form, setForm, onSubmit, onCancel, saving, isEdit }: CustomerFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Ad Soyad *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Ahmet Yılmaz"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="0555 123 4567"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button onClick={onSubmit} disabled={saving || !form.name}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEdit ? "Güncelle" : "Ekle"}
        </Button>
      </DialogFooter>
    </div>
  )
}
