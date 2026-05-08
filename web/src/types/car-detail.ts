export interface CarImage {
  id: string
  url: string
  is_cover: boolean
  created_at: string
}

export interface CarLink {
  id: string
  platform: string
  url: string
  created_at: string
}

export interface MaintenanceItem {
  id: string
  name: string
  interval_km: number
  last_done_mileage: number | null
  notes: string | null
  created_at: string
}

export interface ServiceRecord {
  id: string
  title: string
  mileage: number | null
  service_date: string | null
  notes: string | null
  created_at: string
}
