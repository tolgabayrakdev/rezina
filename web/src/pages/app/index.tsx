import { Users, FolderOpen, CheckCircle2, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Toplam Kullanıcı",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Aktif Projeler",
    value: "42",
    change: "+3",
    icon: FolderOpen,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Tamamlanan Görevler",
    value: "856",
    change: "+48",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
]

export default function AppIndex() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ana Sayfa</h1>
        <p className="text-muted-foreground mt-1 text-sm">Platforma genel bakış</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, change, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card space-y-4 rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              <div className={cn("flex size-9 items-center justify-center rounded-lg", bg)}>
                <Icon className={cn("size-4", color)} />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-semibold tracking-tight">{value}</p>
              <span className="mb-1 flex items-center gap-0.5 text-xs font-medium text-emerald-500">
                <TrendingUp className="size-3" />
                {change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-card rounded-xl border p-6">
          <h2 className="mb-4 text-base font-medium">Son Aktiviteler</h2>
          <div className="space-y-3">
            {[
              "Yeni kullanıcı kaydoldu",
              "Proje güncellendi",
              "Görev tamamlandı",
              "Yorum eklendi",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="bg-primary size-1.5 shrink-0 rounded-full" />
                <span className="text-muted-foreground">{item}</span>
                <span className="text-muted-foreground/60 ml-auto text-xs">{i + 1}s önce</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h2 className="mb-4 text-base font-medium">Hızlı İstatistikler</h2>
          <div className="space-y-3">
            {[
              { label: "Tamamlanma oranı", value: 69, color: "bg-emerald-500" },
              { label: "Aktif kullanıcı oranı", value: 82, color: "bg-blue-500" },
              { label: "Görev ilerleme", value: 54, color: "bg-violet-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}%</span>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className={cn("h-full rounded-full", color)}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
