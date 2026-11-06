import { CookingPot } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

type BrandMarkProps = {
  to?: string
  tone?: 'default' | 'inverse'
  compact?: boolean
  subtitle?: string
  className?: string
}

export function BrandMark({
  to = '/menu',
  tone = 'default',
  compact = false,
  subtitle = 'Artisanal Roastery',
  className,
}: BrandMarkProps) {
  return (
    <Link
      to={to}
      aria-label="Beans in a Pot menu"
      className={cn('group flex min-w-0 items-center gap-3', className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:-rotate-6',
          compact ? 'h-9 w-9' : 'h-11 w-11',
          tone === 'inverse'
            ? 'border-secondary/50 bg-secondary text-surface-bright'
            : 'border-outline-variant/60 bg-primary-container text-secondary-fixed',
        )}
      >
        <CookingPot className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={1.7} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            'truncate font-display-lg leading-none tracking-tight',
            compact ? 'text-[18px]' : 'text-[20px]',
            tone === 'inverse' ? 'text-footer-text' : 'text-primary',
          )}
        >
          Beans in a Pot
        </span>
        <span
          className={cn(
            'mt-1 font-label-sm text-[9px] tracking-[0.22em] uppercase',
            tone === 'inverse' ? 'text-footer-muted' : 'text-on-surface-variant',
          )}
        >
          {subtitle}
        </span>
      </span>
    </Link>
  )
}
