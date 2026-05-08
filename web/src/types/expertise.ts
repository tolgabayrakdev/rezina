export type PanelStatus = "original" | "local_paint" | "painted" | "changed"
export type Expertise = Partial<Record<string, PanelStatus>>

export const STATUS_FILL: Record<PanelStatus, string> = {
  original: "#e2e8f0",
  local_paint: "#fb923c",
  painted: "#60a5fa",
  changed: "#f87171",
}

export const STATUS_LABEL: Record<PanelStatus, string> = {
  original: "Orijinal",
  local_paint: "Lokal Boyalı",
  painted: "Boyalı",
  changed: "Değişen",
}

export const STATUS_ORDER: PanelStatus[] = ["original", "changed", "painted", "local_paint"]

export const PANEL_LABEL: Record<string, string> = {
  front_bumper: "Ön Tampon",
  hood: "Kaput",
  left_front_fender: "Sol Ön Çamurluk",
  right_front_fender: "Sağ Ön Çamurluk",
  left_front_door: "Sol Ön Kapı",
  right_front_door: "Sağ Ön Kapı",
  left_rear_door: "Sol Arka Kapı",
  right_rear_door: "Sağ Arka Kapı",
  left_rear_fender: "Sol Arka Çamurluk",
  right_rear_fender: "Sağ Arka Çamurluk",
  roof: "Tavan",
  trunk: "Bagaj",
  rear_bumper: "Arka Tampon",
}

export const PANELS = [
  { id: "hood", group: "Ön" },
  { id: "front_bumper", group: "Ön" },
  { id: "left_front_fender", group: "Sol" },
  { id: "left_front_door", group: "Sol" },
  { id: "left_rear_door", group: "Sol" },
  { id: "left_rear_fender", group: "Sol" },
  { id: "roof", group: "Üst" },
  { id: "right_front_fender", group: "Sağ" },
  { id: "right_front_door", group: "Sağ" },
  { id: "right_rear_door", group: "Sağ" },
  { id: "right_rear_fender", group: "Sağ" },
  { id: "trunk", group: "Arka" },
  { id: "rear_bumper", group: "Arka" },
] as const

export const GROUP_ORDER = ["Ön", "Sol", "Üst", "Sağ", "Arka"]

export const STATUS_LABEL_COLOR: Record<PanelStatus, string> = {
  original: "text-slate-600 dark:text-slate-400",
  local_paint: "text-orange-600 dark:text-orange-400",
  painted: "text-blue-600 dark:text-blue-400",
  changed: "text-red-600 dark:text-red-400",
}

export const STATUS_DOT_BG: Record<PanelStatus, string> = {
  original: "bg-slate-400",
  local_paint: "bg-orange-500",
  painted: "bg-blue-500",
  changed: "bg-red-500",
}

export const STATUS_BG: Record<PanelStatus, string> = {
  original: "bg-slate-500/10",
  local_paint: "bg-orange-500/15",
  painted: "bg-blue-500/15",
  changed: "bg-red-500/15",
}
