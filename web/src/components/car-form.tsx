import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { CarFormState } from "@/pages/app/cars/use-cars"

const fmt = (val: string) => {
  const n = parseInt(val.replace(/\D/g, ""), 10)
  return isNaN(n) ? "" : n.toLocaleString("tr-TR")
}
const parse = (val: string) => val.replace(/[^\d]/g, "")

const STATUS_OPTIONS = [
  {
    value: "in_stock",
    label: "Stokta",
    active: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    value: "reserved",
    label: "Rezerve",
    active: "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    value: "sold",
    label: "Satıldı",
    active: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
]

interface CarFormProps {
  form: CarFormState
  setForm: React.Dispatch<React.SetStateAction<CarFormState>>
  onSubmit: () => void
  onCancel: () => void
  saving: boolean
  isEdit?: boolean
}

export function CarForm({ form, setForm, onSubmit, onCancel, saving, isEdit }: CarFormProps) {
  const set =
    <K extends keyof CarFormState>(key: K) =>
    (val: CarFormState[K]) =>
      setForm((p) => ({ ...p, [key]: val }))

  return (
    <div className="flex flex-col">
      <ScrollArea className="max-h-[68vh] pr-3">
        <div className="space-y-5 pb-1">
          {/* Başlık */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Araç Başlığı *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
              placeholder="Örn: 2020 BMW 3.20i M Sport"
            />
          </div>

          {/* Marka / Model */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Marka</Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(e) => set("brand")(e.target.value)}
                placeholder="BMW"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={form.model}
                onChange={(e) => set("model")(e.target.value)}
                placeholder="320i M Sport"
              />
            </div>
          </div>

          {/* Yıl / KM / Fiyat */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="year">Yıl</Label>
              <Input
                id="year"
                type="number"
                value={form.year}
                onChange={(e) => set("year")(e.target.value)}
                placeholder="2020"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mileage">Kilometre</Label>
              <Input
                id="mileage"
                inputMode="numeric"
                value={fmt(form.mileage)}
                onChange={(e) => set("mileage")(parse(e.target.value))}
                placeholder="38.000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Fiyat (₺)</Label>
              <Input
                id="price"
                inputMode="numeric"
                value={fmt(form.price)}
                onChange={(e) => set("price")(parse(e.target.value))}
                placeholder="2.000.000"
              />
            </div>
          </div>

          {/* Durum — toggle group */}
          <div className="space-y-1.5">
            <Label>Durum</Label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("status")(s.value)}
                  className={cn(
                    "flex-1 rounded-md border py-1.5 text-sm font-medium transition-colors",
                    form.status === s.value ? s.active : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bölüm ayırıcı */}
          <div className="flex items-center gap-3 pt-1">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
              Teknik Özellikler
            </span>
            <div className="bg-border h-px flex-1" />
          </div>

          {/* Yakıt / Vites */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Yakıt Tipi</Label>
              <Select value={form.fuel_type} onValueChange={set("fuel_type")}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Benzin</SelectItem>
                  <SelectItem value="diesel">Dizel</SelectItem>
                  <SelectItem value="lpg">LPG</SelectItem>
                  <SelectItem value="electric">Elektrik</SelectItem>
                  <SelectItem value="hybrid">Hibrit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Vites</Label>
              <Select value={form.transmission} onValueChange={set("transmission")}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Otomatik</SelectItem>
                  <SelectItem value="manual">Manuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Kasa / Çekiş */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Kasa Tipi</Label>
              <Select value={form.body_type} onValueChange={set("body_type")}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="hatchback">Hatchback</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="station_wagon">Station Wagon</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="truck">Kamyon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Çekiş</Label>
              <Select value={form.drive_type} onValueChange={set("drive_type")}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fwd">Önden Çekiş</SelectItem>
                  <SelectItem value="rwd">Arkadan İtiş</SelectItem>
                  <SelectItem value="4wd">4x4</SelectItem>
                  <SelectItem value="awd">AWD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Motor Gücü / Motor Hacmi / Renk */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="engine_power">Güç (hp)</Label>
              <Input
                id="engine_power"
                type="number"
                min={1}
                value={form.engine_power}
                onChange={(e) => set("engine_power")(e.target.value)}
                placeholder="275"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="engine_volume">Hacim (cc)</Label>
              <Input
                id="engine_volume"
                type="number"
                min={1}
                value={form.engine_volume}
                onChange={(e) => set("engine_volume")(e.target.value)}
                placeholder="1998"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Renk</Label>
              <Input
                id="color"
                value={form.color}
                onChange={(e) => set("color")(e.target.value)}
                placeholder="Siyah"
                maxLength={50}
              />
            </div>
          </div>

          {/* Bölüm ayırıcı */}
          <div className="flex items-center gap-3 pt-1">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
              Açıklama
            </span>
            <div className="bg-border h-px flex-1" />
          </div>

          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
            placeholder="Araç hakkında detaylar, ekipmanlar, notlar..."
            rows={3}
          />
        </div>
      </ScrollArea>

      <DialogFooter className="mt-5 border-t pt-4">
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button onClick={onSubmit} disabled={saving || !form.title}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEdit ? "Güncelle" : "Araç Ekle"}
        </Button>
      </DialogFooter>
    </div>
  )
}
