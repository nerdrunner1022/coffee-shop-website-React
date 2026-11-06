import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-card border border-outline-variant bg-surface-container-low px-3 font-body-md text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/25 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
