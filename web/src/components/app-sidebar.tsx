import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  House,
  ScrollText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Settings,
  ChevronsUpDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import rezinaLogo from "@/assets/project_icon.svg"
import { useTheme } from "@/providers/theme-provider"

const navItems = [
  { to: "/", label: "Ana Sayfa", icon: House },
  { to: "/scripts", label: "Scripts", icon: ScrollText },
]

export interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function AppSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??"

  useEffect(() => {
    onMobileClose()
  }, [location.pathname, onMobileClose])

  const userDropdownContent = (
    <DropdownMenuContent side="top" align="start" className="w-56">
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{user?.username}</span>
          <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
          <Settings className="size-4" />
          Ayarlar
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">Tema</span>
        <div className="flex items-center gap-0.5 rounded-md bg-muted p-0.5">
          {([
            { value: "light", icon: Sun, title: "Açık" },
            { value: "dark", icon: Moon, title: "Koyu" },
            { value: "system", icon: Monitor, title: "Sistem" },
          ] as const).map(({ value, icon: Icon, title }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              title={title}
              className={cn(
                "size-6 flex items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground",
                theme === value && "bg-background text-foreground shadow-sm"
              )}
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onClick={() => setLogoutOpen(true)}>
        <LogOut className="size-4" />
        Çıkış Yap
      </DropdownMenuItem>
    </DropdownMenuContent>
  )

  const userTriggerExpanded = (
    <button className="flex flex-1 min-w-0 items-center gap-2.5 px-2.5 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left">
      <div className="size-8 rounded-full bg-gradient-to-br from-sidebar-primary to-sidebar-primary/60 flex items-center justify-center text-[11px] font-semibold text-sidebar-primary-foreground shrink-0 select-none shadow-sm">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-tight text-sidebar-foreground">{user?.username}</p>
        <p className="text-[11px] text-sidebar-foreground/40 truncate">{user?.email}</p>
      </div>
      <ChevronsUpDown className="size-3.5 shrink-0 text-sidebar-foreground/30" />
    </button>
  )

  return (
    <>
      <aside
        className={cn(
          "h-screen flex flex-col bg-sidebar z-40",
          "fixed inset-y-0 left-0 w-[280px] transition-transform duration-300 ease-in-out shadow-xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:shadow-none lg:sticky lg:top-0 lg:translate-x-0 lg:transition-[width] lg:duration-300",
          collapsed ? "lg:w-[68px]" : "lg:w-[260px]",
        )}
      >
        {/* Header */}
        <div className={cn(
          "h-14 flex items-center shrink-0 border-b border-sidebar-border/60",
          collapsed ? "lg:justify-center lg:px-2" : "px-3 justify-between"
        )}>
          {/* Desktop collapsed: sadece toggle */}
          {collapsed && (
            <Button variant="ghost" size="icon" className="hidden lg:flex size-8 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg" onClick={onToggle}>
              <ChevronRight className="size-4" />
            </Button>
          )}

          {/* Desktop expanded: logo + toggle */}
          {!collapsed && (
            <div className="hidden lg:flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
                <div className="size-7 rounded-lg overflow-hidden shrink-0 shadow-sm ring-1 ring-sidebar-border/40">
                  <img src={rezinaLogo} alt="Rezina" className="h-full w-full" />
                </div>
                <span className="text-[13px] font-bold text-sidebar-foreground tracking-tight truncate">Rezina</span>
              </div>
              <Button variant="ghost" size="icon" className="size-7 shrink-0 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg" onClick={onToggle}>
                <ChevronLeft className="size-3.5" />
              </Button>
            </div>
          )}

          {/* Mobile: logo + close */}
          <div className="flex items-center justify-between w-full lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg overflow-hidden shrink-0 shadow-sm ring-1 ring-sidebar-border/40">
                <img src={rezinaLogo} alt="Rezina" className="h-full w-full" />
              </div>
              <span className="text-[13px] font-bold text-sidebar-foreground tracking-tight">Rezina</span>
            </div>
            <Button variant="ghost" size="icon" className="size-7 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg" onClick={onMobileClose}>
              <ChevronLeft className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
          <p className={cn(
            "text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 px-3 pb-2.5 pt-0.5",
            collapsed && "lg:hidden"
          )}>
            Menü
          </p>
          <div className="space-y-0.5">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = isActive(to)
              return (
                <Link
                  key={to}
                  to={to}
                  title={collapsed ? label : undefined}
                  className={cn(
                    "group flex items-center gap-3 h-9 text-sm rounded-lg transition-all duration-150",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    collapsed ? "lg:justify-center lg:px-0 lg:w-9 lg:mx-auto" : "px-3"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate lg:block hidden">{label}</span>}
                  <span className="truncate lg:hidden">{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-2 shrink-0 border-t border-sidebar-border/60">
          {/* Desktop collapsed */}
          {collapsed && (
            <div className="hidden lg:flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="size-9 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors" title={user?.username}>
                    <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-[11px] font-semibold text-white select-none shadow-sm">
                      {initials}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                {userDropdownContent}
              </DropdownMenu>
            </div>
          )}

          {/* Desktop expanded */}
          {!collapsed && (
            <div className="hidden lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {userTriggerExpanded}
                </DropdownMenuTrigger>
                {userDropdownContent}
              </DropdownMenu>
            </div>
          )}

          {/* Mobile */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {userTriggerExpanded}
              </DropdownMenuTrigger>
              {userDropdownContent}
            </DropdownMenu>
          </div>
        </div>
      </aside>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Çıkış yapmak istiyor musunuz?</AlertDialogTitle>
            <AlertDialogDescription>
              Oturumunuz sonlandırılacak. Tekrar giriş yapmanız gerekecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>Çıkış Yap</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
