import { useQueryClient } from '@tanstack/react-query'
import { Bell, LogOut, Menu, MapPin, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { endDemoAdminSession } from '@/lib/demo-admin-auth'

const pageTitles: Record<string, string> = {
  '/admin': 'Overview & Sales Pulse',
  '/admin/menu': 'Pot & Brew Menu Management',
  '/admin/offers': 'Hearth Offers & Promos',
  '/admin/catering': 'Catering & Workshops',
  '/admin/newsletter': 'Hearth Chronicle',
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const title = pageTitles[location.pathname] ?? 'Atelier Portal'

  const placeholder = (label: string, description: string) => {
    toast({ title: `${label} is not designed in this prototype`, description })
  }

  return (
    <div className="admin-canvas min-h-screen bg-surface">
      <aside className="fixed top-0 left-0 z-40 hidden h-full w-72 bg-surface-container-low shadow-float lg:block">
        <AdminSidebar />
      </aside>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="max-w-xs p-0">
          <DialogTitle className="sr-only">Admin navigation</DialogTitle>
          <DialogDescription className="sr-only">
            Navigate between the five supplied admin screens.
          </DialogDescription>
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-3 border-b border-outline-variant/20 bg-surface/85 px-4 backdrop-blur-xl md:px-6">
          <div className="flex min-w-0 items-center gap-2 md:gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Open admin navigation"
              className="rounded-full lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </Button>
            <div className="flex min-w-0 items-center gap-2 rounded-full bg-surface-container px-3 py-2 text-on-surface">
              <MapPin className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
              <span className="truncate font-label-md text-label-md font-bold tracking-wide">
                Atelier Soho • Roaster No. 1
              </span>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 text-on-surface-variant md:flex">
              <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />
              <span className="font-label-sm text-label-sm">Live synced 2m ago</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden max-w-48 truncate font-label-md text-label-md text-on-surface-variant xl:block">
              {title}
            </span>
            <Button
              type="button"
              variant="dark"
              size="sm"
              onClick={() =>
                placeholder(
                  'Roast run logging',
                  'The overview shows the current batch, but no roast-run form was supplied.',
                )
              }
              className="hidden sm:inline-flex"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Log Roast Run
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Refresh mock data"
              title="Refresh mock data"
              onClick={() => {
                void queryClient.invalidateQueries()
                toast({
                  title: 'Mock data refreshed',
                  description: 'The in-browser fixture remains local to this session.',
                  tone: 'success',
                })
              }}
              className="rounded-full"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              title="Notifications are not designed in this prototype"
              onClick={() =>
                placeholder('Notifications', 'No notification centre was supplied in the mockups.')
              }
              className="relative rounded-full"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span
                className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-secondary"
                aria-hidden="true"
              />
            </Button>
            <div className="flex items-center gap-2 pl-1">
              <div className="hidden text-right sm:block">
                <span className="block font-label-md text-label-md leading-tight font-bold text-on-surface">
                  Julian Vance
                </span>
                <span className="block font-label-sm text-label-sm leading-tight text-on-surface-variant">
                  Head Roaster
                </span>
              </div>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display-lg text-xs text-on-primary italic"
              >
                JV
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Sign out of demo admin"
              title="Sign out"
              onClick={() => {
                endDemoAdminSession()
                void navigate('/')
              }}
              className="rounded-full"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </header>

        <main className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
