import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { hasDemoAdminSession } from '@/lib/demo-admin-auth'

export function RequireAdminSession() {
  const location = useLocation()

  if (!hasDemoAdminSession()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
