import { Car, ClipboardList, Users } from "lucide-react"
import bengarajLogo from "@/assets/project_icon.svg"

const features = [
  {
    icon: Car,
    title: "Detaylı araç stok takibi",
    desc: "Marka, model, yıl, km, renk — tüm araç bilgileri eksiksiz kayıt altında",
  },
  {
    icon: ClipboardList,
    title: "Ekspertiz raporları",
    desc: "Araç başına hasar, boya ve mekanik durumu belgeleyin",
  },
  {
    icon: Users,
    title: "Müşteri ilgilerini kaybetmeyin",
    desc: "Kim hangi araçla ilgileniyor, anında görün",
  },
]

interface AuthLeftPanelProps {
  heading: React.ReactNode
  description: string
}

export function AuthLeftPanel({ heading, description }: AuthLeftPanelProps) {
  return (
    <div
      className="relative hidden flex-col overflow-hidden p-12 text-white select-none lg:flex"
      style={{ background: "linear-gradient(155deg, #060d1f 0%, #0b1a35 60%, #0f2247 100%)" }}
    >
      {/* Blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 size-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 size-[380px] rounded-full bg-blue-800/15 blur-[90px]" />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Big car silhouette — decorative */}
      <div className="pointer-events-none absolute -right-10 -bottom-6 opacity-[0.04]">
        <svg viewBox="0 0 340 160" width="340" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="80" width="320" height="60" rx="14" fill="white" />
          <path d="M50,80 C60,28 280,28 290,80 Z" fill="white" />
          <circle cx="70" cy="140" r="28" fill="white" />
          <circle cx="270" cy="140" r="28" fill="white" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src={bengarajLogo} alt="BenGaraj" className="h-9 w-auto" />
          <span className="text-xl font-semibold tracking-tight">BenGaraj</span>
        </div>

        {/* Main */}
        <div className="flex flex-1 flex-col justify-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-[2.4rem] leading-[1.15] font-bold tracking-tight">{heading}</h2>
            <p className="max-w-[300px] text-base leading-relaxed text-white/55">{description}</p>
          </div>

          {/* Features */}
          <div className="space-y-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/15 backdrop-blur-sm">
                  <Icon className="size-4 text-blue-300" />
                </div>
                <div>
                  <p className="mb-1 text-sm leading-none font-medium">{title}</p>
                  <p className="text-xs leading-relaxed text-white/45">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/25">© 2026 BenGaraj. Tüm hakları saklıdır.</p>
      </div>
    </div>
  )
}
