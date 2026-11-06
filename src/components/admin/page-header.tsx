import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-4 border-b border-outline-variant/25 pb-5 lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-1 font-label-sm text-label-sm tracking-[0.2em] text-secondary uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">
          {title}
        </h1>
        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
