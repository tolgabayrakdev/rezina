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
  Car,
  Users,
  Handshake,
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
  { to: "/cars", label: "Araçlar", icon: Car },
  { to: "/customers", label: "Müşteriler", icon: Users },
  { to: "/interests", label: "İlgiler", icon: Handshake },
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

  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??"

  useEffect(() => {
    onMobileClose()
  }, [location.pathname, onMobileClose])

  const userDropdownContent = (
    <DropdownMenuContent side="top" align="start" className="w-56">
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link to="/settings" className="flex cursor-pointer items-center gap-2">
          <Settings className="size-4" />
          Ayarlar
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-muted-foreground text-xs font-medium">Tema</span>
        <div className="bg-muted flex items-center gap-0.5 rounded-md p-0.5">
          {(
            [
              { value: "light", icon: Sun, title: "Açık" },
              { value: "dark", icon: Moon, title: "Koyu" },
              { value: "system", icon: Monitor, title: "Sistem" },
            ] as const
          ).map(({ value, icon: Icon, title }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              title={title}
              className={cn(
                "text-muted-foreground hover:text-foreground flex size-6 items-center justify-center rounded transition-colors",
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
    <button className="text-sidebar-foreground hover:bg-sidebar-accent flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors">
      <div className="from-sidebar-primary to-sidebar-primary/60 text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold shadow-sm select-none">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sidebar-foreground truncate text-sm leading-tight font-medium">
          {user?.email}
        </p>
      </div>
      <ChevronsUpDown className="text-sidebar-foreground/30 size-3.5 shrink-0" />
    </button>
  )

  return (
    <>
      <aside
        className={cn(
          "bg-sidebar z-40 flex h-screen flex-col",
          "fixed inset-y-0 left-0 w-[280px] shadow-xl transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-0 lg:translate-x-0 lg:shadow-none lg:transition-[width] lg:duration-300",
          collapsed ? "lg:w-[68px]" : "lg:w-[260px]"
        )}
      >
        <div
          className={cn(
            "border-sidebar-border/60 flex h-14 shrink-0 items-center border-b",
            collapsed ? "lg:justify-center lg:px-2" : "justify-between px-3"
          )}
        >
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent hidden size-8 rounded-lg lg:flex"
              onClick={onToggle}
            >
              <ChevronRight className="size-4" />
            </Button>
          )}

          {!collapsed && (
            <div className="hidden w-full items-center justify-between lg:flex">
              <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
                <div className="ring-sidebar-border/40 size-7 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1">
                  <img src={rezinaLogo} alt="Rezina" className="h-full w-full" />
                </div>
                <span className="text-sidebar-foreground truncate text-[13px] font-bold tracking-tight">
                  Rezina
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent size-7 shrink-0 rounded-lg"
                onClick={onToggle}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
            </div>
          )}

          <div className="flex w-full items-center justify-between lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="ring-sidebar-border/40 size-7 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1">
                <img src={rezinaLogo} alt="Rezina" className="h-full w-full" />
              </div>
              <span className="text-sidebar-foreground text-[13px] font-bold tracking-tight">
                Rezina
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent size-7 rounded-lg"
              onClick={onMobileClose}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2 py-3">
          <p
            className={cn(
              "text-sidebar-foreground/30 px-3 pt-0.5 pb-2.5 text-[10px] font-semibold tracking-widest uppercase",
              collapsed && "lg:hidden"
            )}
          >
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
                    "group flex h-9 items-center gap-3 rounded-lg text-sm transition-all duration-150",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    collapsed ? "lg:mx-auto lg:w-9 lg:justify-center lg:px-0" : "px-3"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span className="hidden truncate lg:block">{label}</span>}
                  <span className="truncate lg:hidden">{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-sidebar-border/60 shrink-0 border-t p-2">
          {collapsed && (
            <div className="hidden justify-center lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="hover:bg-sidebar-accent flex size-9 items-center justify-center rounded-lg transition-colors"
                    title={user?.email}
                  >
                    <div className="from-primary to-primary/60 flex size-8 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white shadow-sm select-none">
                      {initials}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                {userDropdownContent}
              </DropdownMenu>
            </div>
          )}

          {!collapsed && (
            <div className="hidden lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>{userTriggerExpanded}</DropdownMenuTrigger>
                {userDropdownContent}
              </DropdownMenu>
            </div>
          )}

          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>{userTriggerExpanded}</DropdownMenuTrigger>
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
