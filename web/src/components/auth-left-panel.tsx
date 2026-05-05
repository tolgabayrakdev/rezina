import { Shield, Zap, BarChart3 } from "lucide-react"
import rezinaLogo from "@/assets/project_icon.svg"

const features = [
  {
    icon: Shield,
    title: "Güvenli Altyapı",
    desc: "Verileriniz uçtan uca şifrelenmiş ve güvende",
  },
  {
    icon: Zap,
    title: "Hızlı ve Güvenilir",
    desc: "Kesintisiz hizmet, anında erişim",
  },
  {
    icon: BarChart3,
    title: "Güçlü Analitik",
    desc: "İş süreçlerinizi veriye dayalı optimize edin",
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
      style={{ background: "linear-gradient(145deg, #0d0b20 0%, #130f2e 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="bg-primary/30 pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full blur-[120px]" />
      <div className="bg-primary/15 pointer-events-none absolute -bottom-40 -left-40 size-[420px] rounded-full blur-[100px]" />
      <div className="bg-primary/20 pointer-events-none absolute top-1/2 right-0 size-[200px] -translate-y-1/2 rounded-full blur-[60px]" />

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src={rezinaLogo} alt="Rezina" className="h-9 w-auto" />
          <span className="text-xl font-semibold tracking-tight">Rezina</span>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col justify-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-[2.6rem] leading-[1.15] font-bold tracking-tight">{heading}</h2>
            <p className="max-w-[300px] text-base leading-relaxed text-white/55">{description}</p>
          </div>

          {/* Feature list */}
          <div className="space-y-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3.5">
                <div className="bg-primary/20 border-primary/30 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border backdrop-blur-sm">
                  <Icon className="size-4 text-white/90" />
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
        <p className="text-xs text-white/25">© 2026 Rezina. Tüm hakları saklıdır.</p>
      </div>
    </div>
  )
}
