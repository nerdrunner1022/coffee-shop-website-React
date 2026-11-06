import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MenuItem } from '@/mocks/schema'
import { formatCurrency } from '@/lib/utils'

export function MenuCard({ item, onBrew }: { item: MenuItem; onBrew: (item: MenuItem) => void }) {
  const soldOut = item.status === 'sold_out'

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft transition-all duration-300 hover:shadow-float">
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.image}
          alt={item.imageAlt}
          width={512}
          height={382}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-primary/10" aria-hidden="true" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="warm" className="bg-surface-container-lowest/95 backdrop-blur-sm">
            {item.badge}
          </Badge>
          {soldOut ? <Badge variant="danger">Sold out</Badge> : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-space-lg">
        <div className="flex items-start justify-between gap-space-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary transition-colors group-hover:text-secondary">
            {item.name}
          </h3>
          <span className="shrink-0 font-headline-sm text-headline-sm font-bold text-primary">
            {formatCurrency(item.price)}
          </span>
        </div>
        <p className="mt-space-sm line-clamp-3 font-body-md text-body-md leading-relaxed text-on-surface-variant">
          {item.description}
        </p>
        <div className="mt-space-md flex flex-wrap gap-1.5">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-outline-variant/50 px-2 py-0.5 font-label-sm text-[9px] tracking-wide text-on-surface-variant uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-3 border-t border-outline-variant/30 pt-space-md sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate font-label-sm text-label-sm text-on-surface-variant">{item.size}</p>
            <p className="mt-0.5 truncate font-body-sm text-[11px] text-outline">{item.origin}</p>
          </div>
          <Button
            size="sm"
            variant={soldOut ? 'soft' : 'dark'}
            disabled={soldOut}
            onClick={() => onBrew(item)}
            className="shrink-0"
          >
            {soldOut ? 'Sold Out' : 'Brew This'}
            {!soldOut ? <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
          </Button>
        </div>
      </div>
    </article>
  )
}
