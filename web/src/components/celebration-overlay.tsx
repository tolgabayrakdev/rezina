import { useEffect, useRef, useState } from "react"
import bengarajLogo from "@/assets/project_icon.svg"
import { cn } from "@/lib/utils"

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#f97316",
  "#14b8a6",
  "#a855f7",
  "#06b6d4",
]

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const particles = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 7 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 2 + Math.random() * 3.5,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.14,
      drift: (Math.random() - 0.5) * 1.8,
      opacity: 1,
    }))

    let animId: number
    let frame = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      let alive = false
      for (const p of particles) {
        p.y += p.speed
        p.x += p.drift
        p.angle += p.spin
        if (frame > 80) p.opacity = Math.max(0, p.opacity - 0.007)
        if (p.opacity > 0) alive = true

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      if (alive) animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[99999]" />
}

interface Props {
  onDone: () => void
}

export function CelebrationOverlay({ onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "visible" | "out">("in")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 50)
    const t2 = setTimeout(() => setPhase("out"), 3000)
    const t3 = setTimeout(() => onDone(), 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onDone])

  return (
    <>
      <Confetti />

      <div
        className={cn(
          "fixed inset-0 z-[99998] flex items-center justify-center transition-opacity duration-500",
          phase === "in" ? "opacity-0" : phase === "visible" ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div
          className={cn(
            "bg-card relative rounded-2xl border px-12 py-10 text-center shadow-2xl transition-all duration-500",
            phase === "in"
              ? "scale-90 opacity-0"
              : phase === "visible"
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
          )}
        >
          <div className="mb-5 flex justify-center">
            <div className="from-primary/20 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br to-violet-500/20">
              <img src={bengarajLogo} alt="BenGaraj" className="h-10 w-auto drop-shadow-md" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Hazırsınız! 🎉</h2>
            <p className="text-muted-foreground text-base">
              BenGaraj'ı kullanmaya başlayabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
