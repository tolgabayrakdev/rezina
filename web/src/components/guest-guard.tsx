import type { ReactNode } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthStore, useIsAuthenticated, useAuthLoading } from "@/store/auth-store"
import Loading from "@/components/loading"

export default function GuestGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const isAuthenticated = useIsAuthenticated()
  const loading = useAuthLoading()
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/", { replace: true })
    }
  }, [navigate, isAuthenticated, loading])

  if (loading) return <Loading />
  if (isAuthenticated) return null

  return <>{children}</>
}
