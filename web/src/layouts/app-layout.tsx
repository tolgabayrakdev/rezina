import { useState, useEffect, useCallback } from "react"
import { Outlet, Link, useLocation } from "react-router"
import { useAuthStore } from "@/store/auth-store"
import AuthProvider from "@/providers/auth-provider"
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
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  Monitor,
  Settings,
  ChevronsUpDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import wernaLogo from "@/assets/werna_logo.svg"
import { useTheme } from "@/providers/theme-provider"

const navItems = [
  { to: "/", label: "Ana Sayfa", icon: House },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    onMobileClose()
  }, [location.pathname, onMobileClose])

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??"

  return (
    <>
      <aside
        className={cn(
          "h-screen flex flex-col border-r border-sidebar-border bg-sidebar z-40",
          "fixed inset-y-0 left-0 w-72 transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-0 lg:translate-x-0 lg:transition-[width] lg:duration-300",
          collapsed ? "lg:w-16" : "lg:w-64",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-sidebar-border px-3 shrink-0",
            collapsed ? "lg:justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2 lg:hidden">
            <img src={wernaLogo} alt="Werna" className="h-7 w-auto" />
            <span className="text-lg font-semibold tracking-tight select-none">Werna</span>
          </div>
          {!collapsed && (
            <div className="hidden lg:flex items-center gap-2">
              <img src={wernaLogo} alt="Werna" className="h-7 w-auto" />
              <span className="text-lg font-semibold tracking-tight select-none">Werna</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 hidden lg:flex"
            onClick={onToggle}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 lg:hidden"
            onClick={onMobileClose}
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              asChild
              variant="ghost"
              className={cn(
                "w-full h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive(to) && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-medium",
                collapsed ? "lg:justify-center lg:px-0 justify-start gap-3 px-3" : "justify-start gap-3 px-3"
              )}
              title={collapsed ? label : undefined}
            >
              <Link to={to}>
                <Icon className="size-4 shrink-0" />
                <span className={cn("truncate", collapsed && "lg:hidden")}>{label}</span>
              </Link>
            </Button>
          ))}
        </nav>

        {/* Footer dropdown */}
        <div className="border-t border-sidebar-border p-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {collapsed ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex size-8 mx-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  title={user?.username}
                >
                  <span className="text-xs font-semibold">{initials}</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-10 justify-between px-2 gap-2",
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "lg:flex hidden"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground shrink-0 select-none">
                      {initials}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-medium truncate leading-none">{user?.username}</p>
                      <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </Button>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="start"
              className="w-56"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{user?.username}</span>
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

              <DropdownMenuItem
                variant="destructive"
                onClick={() => setLogoutOpen(true)}
              >
                <LogOut className="size-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile footer (always visible on mobile) */}
          <div className="flex items-center gap-2 px-1 lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-10 justify-between px-2 gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground shrink-0 select-none">
                      {initials}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-medium truncate leading-none">{user?.username}</p>
                      <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{user?.username}</span>
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

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setLogoutOpen(true)}
                >
                  <LogOut className="size-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
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

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleMobileClose = useCallback(() => setMobileOpen(false), [])

  return (
    <AuthProvider>
      <div className="min-h-screen flex">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={handleMobileClose}
          />
        )}

        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={handleMobileClose}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-14 border-b bg-card flex items-center px-4 gap-3 lg:hidden sticky top-0 z-20 shrink-0">
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setMobileOpen(true)}>
              <Menu className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <img src={wernaLogo} alt="Werna" className="h-6 w-auto" />
              <span className="text-base font-semibold tracking-tight">Werna</span>
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
