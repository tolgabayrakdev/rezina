import { useState, useCallback } from "react"
import { Outlet } from "react-router"
import AuthProvider from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import bengarajLogo from "@/assets/project_icon.svg"
import { AppSidebar } from "@/components/app-sidebar"
import { useOnboardingTour } from "@/hooks/use-onboarding-tour"
import { CelebrationOverlay } from "@/components/celebration-overlay"

function AppLayoutInner() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleMobileClose = useCallback(() => setMobileOpen(false), [])

  const { showCelebration, onCelebrationDone } = useOnboardingTour()

  return (
    <>
      {showCelebration && <CelebrationOverlay onDone={onCelebrationDone} />}
      <div className="flex min-h-screen">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={handleMobileClose}
          />
        )}

        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={handleMobileClose}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="bg-card/80 border-border/50 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-lg lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-lg"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <img src={bengarajLogo} alt="BenGaraj" className="h-6 w-auto" />
              <span className="text-sm font-semibold tracking-tight">BenGaraj</span>
            </div>
          </header>

          <main className="bg-background flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default function AppLayout() {
  return (
    <AuthProvider>
      <AppLayoutInner />
    </AuthProvider>
  )
}
