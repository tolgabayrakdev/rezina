import { useState, useCallback } from "react"
import { Outlet } from "react-router"
import AuthProvider from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import rezinaLogo from "@/assets/project_icon.svg"
import { OnboardingModal } from "@/components/onboarding-modal"
import { AppSidebar } from "@/components/app-sidebar"

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleMobileClose = useCallback(() => setMobileOpen(false), [])

  return (
    <AuthProvider>
      <OnboardingModal />
      <div className="min-h-screen flex">
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

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-14 flex items-center px-4 gap-3 lg:hidden sticky top-0 z-20 shrink-0 bg-card/80 backdrop-blur-lg border-b border-border/50">
            <Button variant="ghost" size="icon" className="size-9 rounded-lg" onClick={() => setMobileOpen(true)}>
              <Menu className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <img src={rezinaLogo} alt="Rezina" className="h-6 w-auto" />
              <span className="text-sm font-semibold tracking-tight">Rezina</span>
            </div>
          </header>

          <main className="flex-1 bg-background overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
