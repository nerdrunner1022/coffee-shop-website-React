import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full resize-y rounded-card border border-outline-variant bg-surface-container-low px-3 py-2.5 font-body-md text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/25 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
