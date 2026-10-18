import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { homePathFor } from '@/lib/routes'
import type { Role } from '@/types/auth'

interface ProtectedRouteProps {
  allowedRoles: Role[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Logged in but wrong role (e.g. a customer opening /admin) → send to their own home.
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={homePathFor(user.role)} replace />
  }

  return <Outlet />
}
