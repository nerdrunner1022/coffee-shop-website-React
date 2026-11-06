import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select
        className={cn(
          'h-10 w-full cursor-pointer appearance-none rounded-card border border-outline-variant bg-surface-container-low py-0 pr-9 pl-3 font-body-md text-body-md text-on-surface outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/25 disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
      />
    </span>
  )
}
