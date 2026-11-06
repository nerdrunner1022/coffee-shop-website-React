import {
  Coffee,
  Flame,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { BrandMark } from '@/components/brand'
import { cn } from '@/lib/utils'

const adminNav = [
  { label: 'Overview & Sales Pulse', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Pot & Brew Menu', to: '/admin/menu', icon: Coffee, end: false },
  { label: 'Hearth Offers & Promos', to: '/admin/offers', icon: Flame, end: false },
  { label: 'Catering & Workshops', to: '/admin/catering', icon: Users, end: false },
  { label: 'Hearth Chronicle', to: '/admin/newsletter', icon: Newspaper, end: false },
] as const

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between gap-space-lg p-gutter">
      <div className="flex flex-col gap-space-lg">
        <div className="px-space-xs">
          <BrandMark to="/admin" compact subtitle="Atelier Roastery Portal" />
        </div>
        <div className="h-px w-full bg-outline-variant/30" aria-hidden="true" />
        <nav aria-label="Admin navigation" className="flex flex-col gap-space-xs">
          {adminNav.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-space-sm rounded-card px-space-md py-space-sm font-label-lg text-label-lg transition-colors',
                  isActive
                    ? 'bg-primary-container font-semibold text-surface-bright shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-space-sm border-t border-outline-variant/30 pt-space-md">
        <div className="flex items-center justify-between rounded-card bg-surface-container p-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-container" aria-hidden="true" />
            <span className="font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              Batch Roasting Mode
            </span>
          </div>
          <span className="font-label-sm text-label-sm font-bold text-secondary">Active</span>
        </div>
        <button
          type="button"
          disabled
          title="Portal Settings is not designed in the supplied mockups"
          className="flex cursor-not-allowed items-center gap-space-sm rounded-card px-space-md py-space-xs text-left font-label-lg text-label-lg text-on-surface-variant/60"
        >
          <Settings className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Portal Settings</span>
          <span className="ml-auto font-label-sm text-[9px] tracking-wider uppercase">Not designed</span>
        </button>
      </div>
    </div>
  )
}
