import * as LabelPrimitive from '@radix-ui/react-label'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export function Label({ className, ...props }: ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'font-label-md text-label-md uppercase tracking-wider text-on-surface-variant',
        className,
      )}
      {...props}
    />
  )
}
