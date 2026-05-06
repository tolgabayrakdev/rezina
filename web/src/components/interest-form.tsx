import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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

interface CarOption {
  id: string
  title: string
  brand: string
  model: string
}

interface CustomerOption {
  id: string
  name: string
  phone: string | null
}

interface InterestFormProps {
  form: { car_id: string; customer_id: string; status: string; note: string }
  setForm: React.Dispatch<React.SetStateAction<InterestFormProps["form"]>>
  cars: CarOption[]
  customers: CustomerOption[]
  onSubmit: () => void
  onCancel: () => void
  saving: boolean
  isEdit?: boolean
}

export function InterestForm({
  form,
  setForm,
  cars,
  customers,
  onSubmit,
  onCancel,
  saving,
  isEdit,
}: InterestFormProps) {
  return (
    <div className="space-y-4">
      {!isEdit && (
        <>
          <div className="space-y-2">
            <Label htmlFor="car">Araç *</Label>
            <Select
              value={form.car_id}
              onValueChange={(v) => setForm((p) => ({ ...p, car_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Araç seçin" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.brand} {car.model} - {car.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer">Müşteri *</Label>
            <Select
              value={form.customer_id}
              onValueChange={(v) => setForm((p) => ({ ...p, customer_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Müşteri seçin" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="status">Durum</Label>
        <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="interested">İlgili</SelectItem>
            <SelectItem value="test_drive">Test Sürüşü</SelectItem>
            <SelectItem value="negotiating">Pazarlık</SelectItem>
            <SelectItem value="sold">Satıldı</SelectItem>
            <SelectItem value="lost">Kayıp</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Not</Label>
        <Textarea
          id="note"
          value={form.note}
          onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
          placeholder="İlgi hakkında notlar..."
          rows={3}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button
          onClick={onSubmit}
          disabled={saving || (!isEdit && (!form.car_id || !form.customer_id))}
        >
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEdit ? "Güncelle" : "Ekle"}
        </Button>
      </DialogFooter>
    </div>
  )
}
