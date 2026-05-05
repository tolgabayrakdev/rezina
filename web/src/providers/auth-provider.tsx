import type { ReactNode } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthStore, useIsAuthenticated, useAuthLoading } from "@/store/auth-store"
import Loading from "@/components/loading"
import SessionExpiredDialog from "@/components/session-expired-dialog"

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const isAuthenticated = useIsAuthenticated()
  const loading = useAuthLoading()
  const sessionExpired = useAuthStore((state) => state.sessionExpired)
  const rateLimited = useAuthStore((state) => state.rateLimited)
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const setSessionExpired = useAuthStore((state) => state.setSessionExpired)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    const handler = () => {
      const { isAuthenticated } = useAuthStore.getState()
      const hadSession = !!localStorage.getItem("ks_had_session")
      if (isAuthenticated || hadSession) {
        setSessionExpired(true)
      }
    }
    window.addEventListener("auth:session-expired", handler)
    return () => window.removeEventListener("auth:session-expired", handler)
  }, [setSessionExpired])

  useEffect(() => {
    if (!isAuthenticated && !loading && !sessionExpired && !rateLimited) {
      navigate("/sign-in", { replace: true })
    }
  }, [navigate, isAuthenticated, loading, sessionExpired, rateLimited])

  if (loading) {
    return <Loading />
  }

  if (rateLimited && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-sm space-y-4 text-center">
          <h2 className="text-xl font-semibold">Çok Fazla İstek</h2>
          <p className="text-muted-foreground text-sm">
            Sunucuya çok fazla istek gönderildi. Lütfen bir süre bekleyin ve tekrar deneyin.
          </p>
          <button
            onClick={() => {
              useAuthStore.setState({ rateLimited: false })
              checkAuth()
            }}
            className="text-primary text-sm hover:underline"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SessionExpiredDialog />
      {(isAuthenticated || sessionExpired) && children}
    </>
  )
}
