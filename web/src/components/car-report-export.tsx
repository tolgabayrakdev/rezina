import { PANEL_LABEL, STATUS_LABEL } from "@/types/expertise"
import type { Expertise } from "@/types/expertise"
import { PANELS } from "@/types/expertise"
import type { MaintenanceItem, ServiceRecord } from "@/types/car-detail"

interface CarDetail {
  id: string
  title: string
  brand: string
  model: string
  year: number | null
  mileage: number | null
  price: number | null
  status: string
  description: string | null
  expertise: Expertise | null
  fuel_type: string | null
  transmission: string | null
  body_type: string | null
  engine_power: number | null
  engine_volume: number | null
  drive_type: string | null
  color: string | null
  vehicle_type: string | null
  insurance_date: string | null
  inspection_date: string | null
  created_at: string
  updated_at: string
  images: { id: string; url: string; is_cover: boolean; created_at: string }[]
  links: { id: string; platform: string; url: string; created_at: string }[]
}

const statusLabels: Record<string, string> = {
  in_stock: "Stokta",
  reserved: "Rezerve",
  sold: "Satıldı",
}

const fuelLabels: Record<string, string> = {
  gasoline: "Benzin",
  diesel: "Dizel",
  lpg: "LPG",
  electric: "Elektrik",
  hybrid: "Hibrit",
}

const transmissionLabels: Record<string, string> = {
  automatic: "Otomatik",
  manual: "Manuel",
}

const bodyTypeLabels: Record<string, string> = {
  sedan: "Sedan",
  hatchback: "Hatchback",
  suv: "SUV",
  station_wagon: "Station Wagon",
  pickup: "Pickup",
  truck: "Kamyon",
}

const driveTypeLabels: Record<string, string> = {
  fwd: "Önden Çekiş",
  rwd: "Arkadan İtiş",
  "4wd": "4x4",
  awd: "AWD",
}

const formatPrice = (price: number | string | null) => {
  const num = Number(price)
  if (!num) return "-"
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(num)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getExpertiseRows(expertise: Expertise) {
  return PANELS.map(({ id, group }) => {
    const status = expertise[id] ?? "original"
    return { group, panel: PANEL_LABEL[id] || id, status: STATUS_LABEL[status] }
  })
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

function formatShortDate(dateStr: string) {
  return new Date(toDateOnly(dateStr) + "T12:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function insuranceStatusHtml(days: number | null): string {
  if (days === null) return `<span style="color:#94a3b8;font-style:italic">Tarih eklenmemiş</span>`
  if (days < 0)
    return `<span style="display:inline-block;padding:1px 8px;border-radius:9999px;font-size:10px;font-weight:600;background:#fee2e2;color:#dc2626">${Math.abs(days)} gün geçti</span>`
  if (days <= 30)
    return `<span style="display:inline-block;padding:1px 8px;border-radius:9999px;font-size:10px;font-weight:600;background:#fef3c7;color:#b45309">${days} gün kaldı</span>`
  return `<span style="display:inline-block;padding:1px 8px;border-radius:9999px;font-size:10px;font-weight:600;background:#d1fae5;color:#047857">${days} gün kaldı</span>`
}

function maintenanceBadgeHtml(item: MaintenanceItem, currentMileage: number | null): string {
  if (item.last_done_mileage == null)
    return `<span style="color:#94a3b8;font-style:italic">Henüz yapılmadı</span>`
  const nextDue = item.last_done_mileage + item.interval_km
  const remaining = nextDue - (currentMileage ?? 0)
  const threshold = Math.round(item.interval_km * 0.1)
  if (remaining < 0)
    return `<span style="display:inline-block;padding:1px 8px;border-radius:9999px;font-size:10px;font-weight:600;background:#fee2e2;color:#dc2626">${Math.abs(remaining).toLocaleString("tr-TR")} km geçildi</span>`
  if (remaining <= threshold)
    return `<span style="display:inline-block;padding:1px 8px;border-radius:9999px;font-size:10px;font-weight:600;background:#fef3c7;color:#b45309">${remaining.toLocaleString("tr-TR")} km kaldı</span>`
  return `<span style="display:inline-block;padding:1px 8px;border-radius:9999px;font-size:10px;font-weight:600;background:#d1fae5;color:#047857">${remaining.toLocaleString("tr-TR")} km kaldı</span>`
}

export function exportCarReport(
  car: CarDetail,
  expertise: Expertise,
  maintenanceItems: MaintenanceItem[] = [],
  serviceRecords: ServiceRecord[] = [],
) {
  const expertiseRows = getExpertiseRows(expertise)
  const statusColorMap: Record<string, string> = {
    Orijinal: "#64748b",
    "Lokal Boyalı": "#f97316",
    Boyalı: "#3b82f6",
    Değişen: "#ef4444",
  }

  let currentGroup = ""
  const expertiseHtml = expertiseRows
    .map((row) => {
      const groupHeader =
        row.group !== currentGroup
          ? (() => {
              currentGroup = row.group
              return `<tr><td colspan="2" style="font-weight:700;color:#0f172a;border-bottom:1px solid #e2e8f0;padding-top:16px">${row.group}</td></tr>`
            })()
          : ""
      const color = statusColorMap[row.status] ?? "#64748b"
      return `${groupHeader}<tr><td style="padding-left:20px">${row.panel}</td><td style="color:${color};font-weight:600">${row.status}</td></tr>`
    })
    .join("")

  const linkRows = car.links
    .map(
      (link) =>
        `<tr><td style="font-weight:500">${link.platform}</td><td style="word-break:break-all;color:#2563eb;text-decoration:underline">${link.url}</td></tr>`
    )
    .join("")

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<title>${car.title} - Araç Raporu</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box }
  body { font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,sans-serif; padding:20px 24px; color:#0f172a; background:#fff; line-height:1.4; font-size:12px }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; border-bottom:2px solid #0f172a; padding-bottom:10px }
  .header h1 { font-size:18px; font-weight:800; letter-spacing:-0.3px }
  .header .badge { display:inline-block; padding:2px 10px; border-radius:9999px; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; background:${car.status === "in_stock" ? "#dbeafe" : car.status === "reserved" ? "#fef3c7" : "#d1fae5"}; color:${car.status === "in_stock" ? "#1d4ed8" : car.status === "reserved" ? "#b45309" : "#047857"} }
  .subtitle { color:#64748b; font-size:11px; margin-bottom:16px }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px }
  .section { margin-bottom:14px; page-break-inside:avoid }
  .section-title { font-size:10px; font-weight:700; margin-bottom:6px; padding-bottom:4px; border-bottom:1.5px solid #e2e8f0; text-transform:uppercase; letter-spacing:0.8px; color:#475569 }
  table { width:100%; border-collapse:collapse }
  th, td { padding:5px 8px; text-align:left; border-bottom:1px solid #f1f5f9; font-size:11px }
  th { background:#f8fafc; font-weight:600; width:42%; color:#475569 }
  td { color:#0f172a }
  .expertise-table th, .expertise-table td { padding:2px 8px; font-size:10px; line-height:1.3 }
  .desc { white-space:pre-wrap; line-height:1.5; color:#334155; font-size:11px; background:#f8fafc; padding:8px 10px; border-radius:4px; border-left:2px solid #e2e8f0 }
  .footer { margin-top:20px; padding-top:8px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; color:#94a3b8; font-size:9px }
  .logo { font-size:14px; font-weight:800; color:#0f172a; letter-spacing:-0.3px }
  @media print { body { padding:16px } .section { page-break-inside:avoid } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${car.title}</h1>
      <p class="subtitle" style="margin-bottom:0">${car.brand} ${car.model}${car.year ? ` · ${car.year}` : ""}</p>
    </div>
    <span class="badge">${statusLabels[car.status]}</span>
  </div>
  <p class="subtitle">Rapor Tarihi: ${formatDate(new Date().toISOString())}</p>

  <div class="grid">
    <div class="section">
      <div class="section-title">Genel Bilgiler</div>
      <table>
        <tr><th>Marka</th><td>${car.brand || "-"}</td></tr>
        <tr><th>Model</th><td>${car.model || "-"}</td></tr>
        <tr><th>Yıl</th><td>${car.year?.toString() || "-"}</td></tr>
        <tr><th>Kilometre</th><td>${car.mileage ? `${car.mileage.toLocaleString("tr-TR")} km` : "-"}</td></tr>
        <tr><th>Fiyat</th><td style="font-weight:700;font-size:12px">${formatPrice(car.price)}</td></tr>
        <tr><th>Renk</th><td>${car.color || "-"}</td></tr>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Teknik Özellikler</div>
      <table>
        <tr><th>Yakıt</th><td>${car.fuel_type ? fuelLabels[car.fuel_type] : "-"}</td></tr>
        <tr><th>Vites</th><td>${car.transmission ? transmissionLabels[car.transmission] : "-"}</td></tr>
        <tr><th>Kasa Tipi</th><td>${car.body_type ? bodyTypeLabels[car.body_type] : "-"}</td></tr>
        <tr><th>Çekiş</th><td>${car.drive_type ? driveTypeLabels[car.drive_type] : "-"}</td></tr>
        ${car.engine_power != null ? `<tr><th>Motor Gücü</th><td>${car.engine_power} hp</td></tr>` : ""}
        ${car.engine_volume != null ? `<tr><th>Motor Hacmi</th><td>${car.engine_volume} cc</td></tr>` : ""}
      </table>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Ekspertiz Raporu</div>
    <table class="expertise-table">
      <tr><th style="width:60%">Parça</th><th>Durum</th></tr>
      ${expertiseHtml}
    </table>
  </div>

  <div class="section">
    <div class="section-title">Sigorta & Muayene</div>
    <table>
      <tr>
        <th>Sigorta (1 yıl)</th>
        <td>
          ${
            car.insurance_date
              ? `Yapılma: ${formatShortDate(car.insurance_date)} · Bitiş: ${getExpiryDate(car.insurance_date, 1).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })} &nbsp; ${insuranceStatusHtml(getDaysRemaining(car.insurance_date, 1))}`
              : insuranceStatusHtml(null)
          }
        </td>
      </tr>
      <tr>
        <th>Muayene (${car.vehicle_type === "commercial" ? "1 yıl · ticari" : "2 yıl · otomobil"})</th>
        <td>
          ${
            car.inspection_date
              ? `Yapılma: ${formatShortDate(car.inspection_date)} · Bitiş: ${getExpiryDate(car.inspection_date, car.vehicle_type === "commercial" ? 1 : 2).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })} &nbsp; ${insuranceStatusHtml(getDaysRemaining(car.inspection_date, car.vehicle_type === "commercial" ? 1 : 2))}`
              : insuranceStatusHtml(null)
          }
        </td>
      </tr>
    </table>
  </div>

  ${
    maintenanceItems.length > 0
      ? `
  <div class="section">
    <div class="section-title">Bakım Takibi</div>
    <table>
      <tr>
        <th style="width:30%">Bakım</th>
        <th style="width:20%">Aralık</th>
        <th style="width:20%">Son Yapılan</th>
        <th style="width:20%">Sıradaki</th>
        <th>Durum</th>
      </tr>
      ${maintenanceItems
        .map(
          (item) => `
      <tr>
        <td style="font-weight:500">${item.name}</td>
        <td>${item.interval_km.toLocaleString("tr-TR")} km</td>
        <td>${item.last_done_mileage != null ? `${item.last_done_mileage.toLocaleString("tr-TR")} km` : "-"}</td>
        <td>${item.last_done_mileage != null ? `${(item.last_done_mileage + item.interval_km).toLocaleString("tr-TR")} km` : "-"}</td>
        <td>${maintenanceBadgeHtml(item, car.mileage)}</td>
      </tr>
      ${item.notes ? `<tr><td colspan="5" style="color:#64748b;font-style:italic;font-size:10px;padding-top:2px;padding-bottom:6px">${item.notes}</td></tr>` : ""}
      `,
        )
        .join("")}
    </table>
  </div>`
      : ""
  }

  ${
    serviceRecords.length > 0
      ? `
  <div class="section">
    <div class="section-title">Servis Geçmişi</div>
    <table>
      <tr>
        <th style="width:35%">İşlem</th>
        <th style="width:20%">Tarih</th>
        <th style="width:20%">Kilometre</th>
        <th>Notlar</th>
      </tr>
      ${serviceRecords
        .map(
          (r) => `
      <tr>
        <td style="font-weight:500">${r.title}</td>
        <td>${r.service_date ? formatShortDate(r.service_date) : "-"}</td>
        <td>${r.mileage != null ? `${r.mileage.toLocaleString("tr-TR")} km` : "-"}</td>
        <td style="color:#334155">${r.notes ?? "-"}</td>
      </tr>`,
        )
        .join("")}
    </table>
  </div>`
      : ""
  }

  ${
    car.description
      ? `
  <div class="section">
    <div class="section-title">Açıklama</div>
    <p class="desc">${car.description}</p>
  </div>`
      : ""
  }

  <div class="footer">
    <span class="logo">rezina</span>
    <span>Bu rapor ${formatDate(new Date().toISOString())} tarihinde oluşturulmuştur.</span>
  </div>
</body>
</html>`

  const win = window.open("", "_blank")
  if (win) {
    win.document.write(html)
    win.document.close()
    win.print()
  }
}
