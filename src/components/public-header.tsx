import { Menu, Search } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { BrandMark } from '@/components/brand'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

const publicNav = [
  { label: 'Home', sectionId: 'hero' },
  { label: 'Offers', sectionId: 'specials' },
  { label: 'Menu', sectionId: 'menu' },
  { label: 'Services', sectionId: 'services' },
  { label: 'About', sectionId: 'visit' },
] as const

export function PublicHeader({ heroEntrance = false }: { heroEntrance?: boolean }) {
  const { toast } = useToast()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        return
      }

      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (!target) return

      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [location.hash, location.pathname])

  useLayoutEffect(() => {
    if (location.pathname !== '/') return

    let frame = 0
    const updateActiveSection = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const probeY = window.innerHeight * 0.4
        let currentSectionId: string | null = null

        for (const item of publicNav) {
          const section = document.getElementById(item.sectionId)
          if (section && section.getBoundingClientRect().top <= probeY) {
            currentSectionId = item.sectionId
          } else {
            break
          }
        }

        setActiveSectionId(currentSectionId ?? publicNav[0].sectionId)
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [location.pathname])

  const currentSectionId = location.pathname === '/' ? activeSectionId : null

  const placeholder = (label: string) => {
    toast({
      title: `${label} is not designed in this prototype`,
      description: 'This phase includes the full menu and five admin screens.',
      tone: 'default',
    })
  }

  return (
    <header
      className={cn('public-header', heroEntrance && 'public-header--hero-entrance')}
      aria-label="Main navigation"
    >
      <BrandMark to="/" subtitle="Artisanal Roastery" className="public-header__brand" />

      <nav aria-label="Primary navigation" className="public-header__links">
        {publicNav.map((item) => (
          <div key={item.label}>
            <Link
              to={`/#${item.sectionId}`}
              aria-current={currentSectionId === item.sectionId ? 'location' : undefined}
              className={cn(
                'public-header__link',
                currentSectionId === item.sectionId && 'is-current',
              )}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="public-header__actions">
        <div className="public-header__hours">
          <span>Daily Hearth</span>
          <strong>07:00 – 19:00</strong>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Search catalogue"
          title="Search is not designed in this prototype"
          onClick={() =>
            toast({
              title: 'Search is not designed in this prototype',
              description: 'Use the category filters to browse all twenty drinks.',
            })
          }
          className="public-header__search"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="dark"
          size="sm"
          onClick={() => placeholder('Reservations')}
          className="public-header__reservation"
        >
          Pull Up a Chair
        </Button>
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Open menu"
              className="public-header__toggle"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Browse the hearth</DialogTitle>
              <DialogDescription>
                Find the full menu, today’s specials, our services, and visit details.
              </DialogDescription>
            </DialogHeader>
            <nav aria-label="Mobile navigation" className="mt-6 flex flex-col gap-1">
              {publicNav.map((item) => (
                <Link
                  key={item.label}
                  to={`/#${item.sectionId}`}
                  onClick={() => setMobileOpen(false)}
                  aria-current={currentSectionId === item.sectionId ? 'location' : undefined}
                  className={cn(
                    'public-header__mobile-link rounded-card px-4 py-3 font-label-lg text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-5 border-t border-outline-variant/40 pt-4">
              <Button className="w-full" onClick={() => placeholder('Reservations')}>
                Pull Up a Chair
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
