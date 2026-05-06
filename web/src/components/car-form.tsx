import { Loader2 } from "lucide-react"

const fmt = (val: string) => {
  const n = parseInt(val.replace(/\D/g, ""), 10)
  return isNaN(n) ? "" : n.toLocaleString("tr-TR")
}
const parse = (val: string) => val.replace(/[^\d]/g, "")
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CarFormProps {
  form: {
    title: string
    brand: string
    model: string
    year: string
    mileage: string
    price: string
    status: string
    description: string
  }
  setForm: React.Dispatch<React.SetStateAction<CarFormProps["form"]>>
  onSubmit: () => void
  onCancel: () => void
  saving: boolean
  isEdit?: boolean
}

export function CarForm({ form, setForm, onSubmit, onCancel, saving, isEdit }: CarFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Araç Başlığı *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Örn: 2020 BMW 3.20i M Sport"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Marka</Label>
          <Input
            id="brand"
            value={form.brand}
            onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
            placeholder="BMW"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={form.model}
            onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
            placeholder="3.20i M Sport"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Yıl</Label>
          <Input
            id="year"
            type="number"
            value={form.year}
            onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
            placeholder="2020"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">Kilometre</Label>
          <Input
            id="mileage"
            inputMode="numeric"
            value={fmt(form.mileage)}
            onChange={(e) => setForm((p) => ({ ...p, mileage: parse(e.target.value) }))}
            placeholder="38.000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Fiyat (₺)</Label>
          <Input
            id="price"
            inputMode="numeric"
            value={fmt(form.price)}
            onChange={(e) => setForm((p) => ({ ...p, price: parse(e.target.value) }))}
            placeholder="2.000.000"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Durum</Label>
        <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_stock">Stokta</SelectItem>
            <SelectItem value="reserved">Rezerve</SelectItem>
            <SelectItem value="sold">Satıldı</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Araç hakkında detaylar..."
          rows={3}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button onClick={onSubmit} disabled={saving || !form.title}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEdit ? "Güncelle" : "Ekle"}
        </Button>
      </DialogFooter>
    </div>
  )
}
