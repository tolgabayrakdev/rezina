import { Car, Users, Handshake } from "lucide-react";

const navItems = [
  { label: "Ana Sayfa", active: false },
  { label: "Araçlar", active: true },
  { label: "Müşteriler", active: false },
  { label: "İlgiler", active: false },
];

const statItems = [
  { label: "Stokta", value: "34", color: "text-blue-400" },
  { label: "Rezerve", value: "15", color: "text-amber-400" },
  { label: "Satıldı", value: "16", color: "text-emerald-400" },
];

const cars = [
  { title: "2023 Mercedes EQB 350 AMG", sub: "Mercedes EQB 350 · 2023", status: "Stokta", sCls: "text-blue-400 bg-blue-400/10", price: "₺3.100.000" },
  { title: "2022 Porsche Macan S", sub: "Porsche Macan S · 2022", status: "Stokta", sCls: "text-blue-400 bg-blue-400/10", price: "₺3.800.000" },
  { title: "2021 Land Rover Defender 110", sub: "Land Rover Def. 110 · 2021", status: "Rezerve", sCls: "text-amber-400 bg-amber-400/10", price: "₺4.200.000" },
  { title: "2023 BMW M3 Competition", sub: "BMW M3 Competition · 2023", status: "Stokta", sCls: "text-blue-400 bg-blue-400/10", price: "₺5.500.000" },
  { title: "2020 Mercedes GLE 350d", sub: "Mercedes GLE 350d · 2020", status: "Satıldı", sCls: "text-emerald-400 bg-emerald-400/10", price: "₺2.800.000" },
];

export function MockDashboard() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl"
      aria-hidden="true"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/5 bg-gray-800/60 px-4 py-3">
        <div className="size-3 rounded-full bg-red-500/60" />
        <div className="size-3 rounded-full bg-yellow-500/60" />
        <div className="size-3 rounded-full bg-green-500/60" />
        <div className="mx-3 flex h-5 flex-1 items-center justify-center rounded bg-gray-700/60 text-[10px] text-gray-500">
          app.bengaraj.com
        </div>
      </div>

      <div className="flex h-[370px]">
        {/* Sidebar */}
        <div className="flex w-44 shrink-0 flex-col gap-0.5 border-r border-white/5 bg-gray-800/20 p-2.5">
          <div className="mb-2 flex items-center gap-2 px-2 py-1">
            <div className="flex size-5 shrink-0 items-center justify-center rounded bg-brand-600 text-[8px] font-bold text-white">
              BG
            </div>
            <span className="text-[11px] font-bold text-white">BenGaraj</span>
          </div>
          <p className="px-2 pb-1 text-[9px] font-semibold tracking-widest text-gray-600 uppercase">Menü</p>
          {navItems.map(({ label, active }) => (
            <div
              key={label}
              className={`rounded-md px-2.5 py-1.5 text-[11px] ${
                active ? "bg-brand-600 font-medium text-white" : "text-gray-500"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 overflow-hidden p-4">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-white">Araçlar</p>
              <p className="text-[10px] text-gray-500">60 araç</p>
            </div>
            <div className="rounded-md bg-brand-600 px-2.5 py-1 text-[10px] font-medium text-white">
              + Yeni Araç
            </div>
          </div>

          {/* Mini stats */}
          <div className="mb-3 grid grid-cols-3 gap-1.5">
            {statItems.map(({ label, value, color }) => (
              <div key={label} className="rounded-lg bg-gray-800/50 p-2">
                <p className={`text-base font-bold leading-none ${color}`}>{value}</p>
                <p className="mt-0.5 text-[10px] text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Table header */}
          <div className="mb-1 grid grid-cols-[1fr_auto_auto] gap-x-3 px-2 py-1 text-[9px] font-semibold tracking-wide text-gray-600 uppercase">
            <span>Araç</span>
            <span>Durum</span>
            <span className="text-right">Fiyat</span>
          </div>

          {/* Car rows */}
          <div className="space-y-1">
            {cars.map((car) => (
              <div
                key={car.title}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 rounded-lg bg-gray-800/30 px-2 py-1.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-white">{car.title}</p>
                  <p className="text-[9px] text-gray-600">{car.sub}</p>
                </div>
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${car.sCls}`}>
                  {car.status}
                </span>
                <span className="text-right text-[10px] font-medium text-gray-300 whitespace-nowrap">
                  {car.price}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center gap-4 border-t border-white/5 pt-2.5 text-[9px] text-gray-600">
            <span className="flex items-center gap-1"><Car className="size-3" /> 60 araç</span>
            <span className="flex items-center gap-1"><Users className="size-3" /> 60 müşteri</span>
            <span className="flex items-center gap-1"><Handshake className="size-3" /> 60 ilgi kaydı</span>
          </div>
        </div>
      </div>
    </div>
  );
}
