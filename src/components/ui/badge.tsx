import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label-sm uppercase tracking-wide',
  {
    variants: {
      variant: {
        warm: 'bg-secondary-fixed text-on-secondary-fixed',
        neutral: 'bg-surface-container text-on-surface',
        dark: 'bg-primary-container text-primary-fixed',
        outline: 'border border-outline-variant bg-transparent text-on-surface-variant',
        success: 'bg-[#dcead7] text-[#244a1f]',
        danger: 'bg-error-container text-on-error-container',
        cream: 'bg-[#fff1e3] text-[#733600]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
