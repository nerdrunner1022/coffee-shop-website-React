import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const toneStyles = {
  live: 'bg-[#dcead7] text-[#244a1f]',
  draft: 'bg-[#eee6d8] text-[#5f4b31]',
  sold_out: 'bg-error-container text-on-error-container',
  active: 'bg-[#dcead7] text-[#244a1f]',
  scheduled: 'bg-secondary-fixed text-on-secondary-fixed',
  expired: 'bg-surface-container text-on-surface-variant',
  paused: 'bg-[#eee6d8] text-[#5f4b31]',
  paid: 'bg-[#dcead7] text-[#244a1f]',
  deposit: 'bg-secondary-fixed text-on-secondary-fixed',
  pending: 'bg-[#fff1e3] text-[#733600]',
  approved: 'bg-[#dbe8f6] text-[#1d3e63]',
  neutral: 'bg-surface-container text-on-surface-variant',
} as const

export type StatusTone = keyof typeof toneStyles

export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: StatusTone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label-sm text-label-sm font-bold whitespace-nowrap',
        toneStyles[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {children}
    </span>
  )
}
