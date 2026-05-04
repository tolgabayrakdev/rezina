import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import rezinaLogo from "@/assets/project_icon.svg"

const CONFETTI_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#f97316", "#14b8a6",
]

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 150,
      w: 6 + Math.random() * 7,
      h: 3 + Math.random() * 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      speed: 1.5 + Math.random() * 2.5,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.12,
      drift: (Math.random() - 0.5) * 1.2,
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
        if (frame > 60) p.opacity = Math.max(0, p.opacity - 0.01)
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
    return () => cancelAnimationFrame(animId)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

const STEPS = ["Hesabınız hazırlanıyor", "Ayarlar yükleniyor", "Her şey hazır"]

export function OnboardingModal() {
  const user = useAuthStore((s) => s.user)
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      const t = setTimeout(() => setVisible(true), 400)
      return () => clearTimeout(t)
    }
  }, [user])

  const handleStart = async () => {
    setLoading(true)
    setStepIndex(0)

    await new Promise<void>((resolve) => {
      let i = 0
      const tick = () => {
        i++
        setStepIndex(i)
        if (i < STEPS.length - 1) setTimeout(tick, 1000)
        else setTimeout(resolve, 1000)
      }
      setTimeout(tick, 1000)
    })

    await completeOnboarding()
    setClosing(true)
    setTimeout(() => setVisible(false), 400)
  }

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-400 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className={`relative w-full max-w-sm bg-card border rounded-2xl shadow-2xl overflow-hidden transition-all duration-400 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Confetti + header */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/15 to-violet-500/10">
          <ConfettiCanvas />
          <div className="absolute inset-0 flex items-center justify-center gap-3">
            <img src={rezinaLogo} alt="Rezina" className="h-10 w-auto drop-shadow" />
            <span className="text-2xl font-semibold tracking-tight">Rezina</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7 space-y-6 text-center">
          {!loading ? (
            <>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  Hoş geldiniz, {user?.username}!
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rezina'ya katıldığınız için teşekkürler.<br />
                  Her şey sizi bekliyor.
                </p>
              </div>

              <Button className="w-full h-11" onClick={handleStart}>
                Başlayalım
              </Button>
            </>
          ) : (
            <div className="py-2 space-y-4">
              <div className="flex justify-center">
                <svg
                  className="size-8 animate-spin text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
              <p
                key={stepIndex}
                className="text-sm text-muted-foreground animate-in fade-in duration-300"
              >
                {STEPS[stepIndex]}…
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
