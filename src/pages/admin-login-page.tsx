import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { BrandMark } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authenticateDemoAdmin, hasDemoAdminSession } from '@/lib/demo-admin-auth'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const requestedPath = getAdminDestination(location.state)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!authenticateDemoAdmin(username, password)) {
      setError('Those demo credentials do not match. Please try again.')
      return
    }

    setError('')
    void navigate(requestedPath, { replace: true })
  }

  if (hasDemoAdminSession()) {
    return <Navigate to="/admin" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-container-low px-4 py-12">
      <div className="w-full max-w-md rounded-panel border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-float sm:p-8">
        <BrandMark to="/" subtitle="Admin access" />
        <h1 className="mt-8 font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">
          Welcome back
        </h1>
        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
          Sign in to open the Beans in a Pot admin dashboard.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-username" className="font-label-md text-label-md text-on-surface">
              Username
            </label>
            <Input
              id="admin-username"
              type="email"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => {
                setUsername(event.target.value)
                setError('')
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="font-label-md text-label-md text-on-surface">
              Password
            </label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
            />
          </div>
          {error ? (
            <p id="admin-login-error" role="alert" className="font-body-sm text-error">
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="dark" className="mt-1 w-full">
            Continue to dashboard
          </Button>
        </form>

        <Link
          to="/"
          className="mt-4 inline-flex font-label-md text-label-md text-secondary underline-offset-4 hover:underline"
        >
          Return to the public site
        </Link>
      </div>
    </main>
  )
}

function getAdminDestination(state: unknown) {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'object' &&
    state.from !== null &&
    'pathname' in state.from &&
    typeof state.from.pathname === 'string' &&
    (state.from.pathname === '/admin' || state.from.pathname.startsWith('/admin/'))
  ) {
    return state.from.pathname
  }

  return '/admin'
}
