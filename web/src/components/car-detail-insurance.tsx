import { useState } from "react"
import { Shield, ClipboardCheck, Pencil, Save, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"

interface Props {
  carId: string
  insuranceDate: string | null
  inspectionDate: string | null
  vehicleType: string | null
  onUpdate: (field: "insurance_date" | "inspection_date", value: string | null) => void
}

function toDateOnly(s: string) {
  return s.split("T")[0]
}

function getExpiryDate(dateStr: string, years: number): Date {
  const d = new Date(toDateOnly(dateStr) + "T12:00:00")
  d.setFullYear(d.getFullYear() + years)
  return d
}

function getDaysRemaining(dateStr: string | null, years: number): number | null {
  if (!dateStr) return null
  const expiry = getExpiryDate(dateStr, years)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000)
}

function formatShortDate(date: string) {
  return new Date(toDateOnly(date) + "T12:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function StatusBadge({ days }: { days: number | null }) {
  if (days === null)
    return <span className="text-muted-foreground/50 text-xs italic">Tarih eklenmemiş</span>
  if (days < 0)
    return (
      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
        {Math.abs(days)} gün geçti
      </span>
    )
  if (days <= 30)
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
        {days} gün kaldı
      </span>
    )
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      {days} gün kaldı
    </span>
  )
}

function DateCard({
  icon,
  title,
  subtitle,
  dateStr,
  years,
  onSave,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  dateStr: string | null
  years: number
  onSave: (value: string | null) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(value || null)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-sm font-medium">{title}</span>
          <span className="text-muted-foreground text-xs">{subtitle}</span>
        </div>
        {!editing ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => {
              setValue(dateStr ? toDateOnly(dateStr) : "")
              setEditing(true)
            }}
          >
            <Pencil className="size-3" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => setEditing(false)}
            >
              <X className="size-3" />
            </Button>
          </div>
        )}
      </div>

      {editing ? (
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-8 w-full rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        />
      ) : dateStr ? (
        <div className="space-y-1.5">
          <div className="text-muted-foreground space-y-0.5 text-xs">
            <div>Yapılma: {formatShortDate(dateStr)}</div>
            <div>
              Bitiş:{" "}
              {getExpiryDate(dateStr, years).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
          <StatusBadge days={getDaysRemaining(dateStr, years)} />
        </div>
      ) : (
        <StatusBadge days={null} />
      )}
    </div>
  )
}

export function CarDetailInsurance({
  carId,
  insuranceDate,
  inspectionDate,
  vehicleType,
  onUpdate,
}: Props) {
  const inspectionYears = vehicleType === "commercial" ? 1 : 2

  const saveInsurance = async (value: string | null) => {
    try {
      await apiClient.patch(`/api/cars/${carId}`, { insurance_date: value })
      onUpdate("insurance_date", value)
      toast.success("Sigorta tarihi güncellendi")
    } catch {
      toast.error("Sigorta tarihi güncellenemedi")
      throw new Error()
    }
  }

  const saveInspection = async (value: string | null) => {
    try {
      await apiClient.patch(`/api/cars/${carId}`, { inspection_date: value })
      onUpdate("inspection_date", value)
      toast.success("Muayene tarihi güncellendi")
    } catch {
      toast.error("Muayene tarihi güncellenemedi")
      throw new Error()
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        Sigorta & Muayene
      </p>
      <div className="space-y-2">
        <DateCard
          icon={<Shield className="text-muted-foreground size-3.5" />}
          title="Sigorta"
          subtitle="(1 yıl)"
          dateStr={insuranceDate}
          years={1}
          onSave={saveInsurance}
        />
        <DateCard
          icon={<ClipboardCheck className="text-muted-foreground size-3.5" />}
          title="Muayene"
          subtitle={`(${inspectionYears} yıl · ${vehicleType === "commercial" ? "ticari" : "otomobil"})`}
          dateStr={inspectionDate}
          years={inspectionYears}
          onSave={saveInspection}
        />
      </div>
    </div>
  )
}
