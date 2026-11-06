import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  BadgeCheck,
  Coffee,
  Filter,
  Globe2,
  Leaf,
  Milk,
  Snowflake,
  Soup,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

import { MenuCard } from '@/components/menu-card'
import { PublicFooter } from '@/components/public-footer'
import { PublicHeader } from '@/components/public-header'
import { StoryReveal } from '@/components/story-reveal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { getMenuAddOns, getMenuCategories, getMenuItems, queryKeys } from '@/mocks/api'
import type { MenuCategoryMeta, MenuCategorySlug, MenuItem } from '@/mocks/schema'
import { formatCurrency } from '@/lib/utils'

const categoryIcons = {
  zap: Zap,
  milk: Milk,
  filter: Filter,
  globe: Globe2,
  snowflake: Snowflake,
} as const

const heroMetrics = [
  { label: 'Hearth Flame', value: 'Applewood', note: 'Kiln-cured, low soot' },
  { label: 'Clay Pots', value: 'Unglazed', note: 'High mineral retention' },
  { label: 'Extraction Range', value: '92° – 94°C', note: 'Soft Mountain Spring' },
] as const

export function MenuPage() {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState<'all' | MenuCategorySlug>('all')

  const menuQuery = useQuery({
    queryKey: queryKeys.menu(false),
    queryFn: () => getMenuItems(false),
  })
  const categoriesQuery = useQuery({
    queryKey: ['menu', 'categories'],
    queryFn: getMenuCategories,
  })
  const addOnsQuery = useQuery({
    queryKey: ['menu', 'add-ons'],
    queryFn: getMenuAddOns,
  })

  const items = menuQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const addOns = addOnsQuery.data ?? []

  const groups = categories
    .filter((category) => activeCategory === 'all' || category.slug === activeCategory)
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category.slug),
    }))

  const onBrew = (item: MenuItem) => {
    toast({
      title: `${item.name} selected`,
      description: `${formatCurrency(item.price)} · mock selection only. No order or payment is created.`,
      tone: 'success',
    })
  }

  return (
    <div className="min-h-screen bg-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[120] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-surface"
      >
        Skip to menu
      </a>
      <PublicHeader />
      <main id="main-content" className="pt-24">
        <StoryReveal direction="left">
          <section className="border-b border-outline-variant/30 bg-surface-container-low">
            <div className="mx-auto w-full max-w-none px-margin-mobile py-space-xl md:px-margin">
              <div className="flex flex-col items-start justify-between gap-space-xl xl:flex-row">
                <div className="flex max-w-3xl flex-col" data-story-heading>
                  <div className="mb-space-sm flex items-center gap-space-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary" aria-hidden="true" />
                    <span className="font-label-sm text-label-sm tracking-[0.2em] text-secondary uppercase">
                      Curated Extraction Ledger • Vol. IV
                    </span>
                  </div>
                  <h1 className="mb-space-sm font-display-lg text-display-lg-mobile tracking-tight text-primary md:text-display-lg">
                    Pot & Brew Menu: Handcrafted Roasts & Extractions
                  </h1>
                  <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                    Celebrating single-origin harvests, slow wood-fired roasts, and unhurried
                    earthen pot brewing. Each vessel is weighed, ground upon order, and tempered
                    with wellspring water.
                  </p>
                </div>

                <div
                  className="grid w-full grid-cols-2 gap-space-md rounded-lg bg-surface-container p-space-lg shadow-sm sm:grid-cols-3 xl:w-auto"
                  data-story-item
                >
                  {heroMetrics.map((metric) => (
                    <div key={metric.label} className="flex flex-col">
                      <span className="font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                        {metric.label}
                      </span>
                      <span className="mt-1 font-headline-sm text-headline-sm text-primary">
                        {metric.value}
                      </span>
                      <span className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                        {metric.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-space-xl flex flex-col gap-3" data-story-item>
                <div className="no-scrollbar flex items-center gap-space-xs overflow-x-auto pb-space-xs">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    aria-pressed={activeCategory === 'all'}
                    className={
                      activeCategory === 'all'
                        ? 'flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-primary-container px-5 py-2.5 font-label-md text-label-md text-surface-bright shadow-sm'
                        : 'flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-surface-container-high px-5 py-2.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-secondary-fixed hover:text-on-secondary-fixed'
                    }
                  >
                    <Coffee className="h-4 w-4" aria-hidden="true" />
                    All Brews ({items.length})
                  </button>
                  {categories.map((category) => {
                    const Icon = categoryIcons[category.icon]
                    const count = items.filter((item) => item.category === category.slug).length
                    const active = activeCategory === category.slug
                    return (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() => setActiveCategory(category.slug)}
                        aria-pressed={active}
                        className={
                          active
                            ? 'flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-primary-container px-5 py-2.5 font-label-md text-label-md text-surface-bright shadow-sm'
                            : 'flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-surface-container-high px-5 py-2.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-secondary-fixed hover:text-on-secondary-fixed'
                        }
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {category.shortLabel} ({count})
                      </button>
                    )
                  })}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Prototype note: prices are sample values from the supplied menu mockup, not
                  verified pricing.
                </p>
              </div>
            </div>
          </section>
        </StoryReveal>

        <StoryReveal direction="right">
          <section className="bg-surface px-margin-mobile py-space-md md:px-margin">
            <div
              className="mx-auto flex max-w-none flex-col items-center justify-between gap-space-md rounded-lg bg-surface-container-highest p-space-md shadow-sm sm:p-space-lg md:flex-row"
              data-story-item
            >
              <div className="flex items-center gap-space-md">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                  <Soup className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">
                    The Clay & Ember Custom
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Each cup is brewed fresh into hand-turned terracotta pottery fired in Hudson
                    Valley kilns.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-sm font-label-md text-label-md text-on-surface-variant">
                <BadgeCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
                <span>100% Traceable Micro-Lots</span>
              </div>
            </div>
          </section>
        </StoryReveal>

        <StoryReveal direction="left">
          <div className="w-full bg-surface px-margin-mobile py-space-xl md:px-margin">
            <div className="mx-auto flex max-w-none flex-col gap-space-xl">
              {menuQuery.isPending || categoriesQuery.isPending ? <MenuGridSkeleton /> : null}

              {menuQuery.isError || categoriesQuery.isError ? (
                <div
                  role="alert"
                  className="rounded-lg bg-error-container p-space-xl text-on-error-container"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <div>
                      <h2 className="font-headline-sm text-headline-sm">
                        The menu could not be loaded
                      </h2>
                      <p className="mt-1 font-body-md text-body-md">
                        The isolated mock layer did not return the menu fixture.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 border-on-error-container/30 text-on-error-container hover:bg-white/30"
                        onClick={() => {
                          void menuQuery.refetch()
                          void categoriesQuery.refetch()
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              {!menuQuery.isPending && !menuQuery.isError && groups.length === 0 ? (
                <div className="rounded-lg bg-surface-container-low p-space-xl text-center">
                  <Coffee className="mx-auto h-8 w-8 text-outline" aria-hidden="true" />
                  <h2 className="mt-3 font-headline-sm text-headline-sm text-primary">
                    No brews in this category
                  </h2>
                  <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                    Add a brew in the admin menu manager or choose another category.
                  </p>
                </div>
              ) : null}

              {!menuQuery.isPending && !menuQuery.isError
                ? groups.map(({ category, items: groupItems }, index) => (
                    <StoryReveal key={category.slug} direction={index % 2 === 0 ? 'left' : 'right'}>
                      <MenuSection
                        category={category}
                        items={groupItems}
                        categories={categories}
                        onBrew={onBrew}
                      />
                    </StoryReveal>
                  ))
                : null}
            </div>
          </div>
        </StoryReveal>

        <StoryReveal direction="right">
          <section className="w-full bg-surface-container-low px-margin-mobile py-space-xl md:px-margin">
            <div
              className="mx-auto max-w-none rounded-lg bg-surface-container-lowest p-space-xl shadow-sm"
              data-story-item
            >
              <div className="flex flex-col gap-space-xl xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-md">
                  <div className="mb-space-sm flex items-center gap-space-sm">
                    <Leaf className="h-4 w-4 text-secondary" aria-hidden="true" />
                    <span className="font-label-sm text-label-sm tracking-[0.2em] text-secondary uppercase">
                      The Custom Cup
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">
                    Dietary & Pot Customization
                  </h2>
                  <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Every pour is tailored to your palate. We partner with local dairies and
                    independent botanical gatherers to offer conscious culinary pairings.
                  </p>
                </div>
                <div className="grid w-full grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4 xl:max-w-4xl">
                  {addOnsQuery.isPending
                    ? Array.from({ length: 4 }, (_, index) => (
                        <div
                          key={index}
                          className="h-36 animate-pulse rounded-lg bg-surface-container"
                        />
                      ))
                    : addOns.map((addOn) => (
                        <div
                          key={addOn.id}
                          className="flex flex-col justify-between rounded-lg bg-surface-container p-space-md"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-label-lg text-label-lg text-primary">
                                {addOn.name}
                              </span>
                              <span className="shrink-0 font-label-md text-label-md font-bold text-secondary">
                                +{formatCurrency(addOn.price)}
                              </span>
                            </div>
                            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                              {addOn.description}
                            </p>
                          </div>
                          <span className="mt-space-md font-label-sm text-label-sm text-on-surface-variant">
                            {addOn.label}
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </section>
        </StoryReveal>
      </main>
      <StoryReveal direction="right">
        <PublicFooter />
      </StoryReveal>
    </div>
  )
}

function MenuSection({
  category,
  items,
  categories,
  onBrew,
}: {
  category: MenuCategoryMeta
  items: MenuItem[]
  categories: MenuCategoryMeta[]
  onBrew: (item: MenuItem) => void
}) {
  const number = String(categories.findIndex((entry) => entry.slug === category.slug) + 1).padStart(
    2,
    '0',
  )
  const headingId = `menu-${category.slug}`
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-space-lg">
      <div
        className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between"
        data-story-heading
      >
        <div className="flex items-center gap-space-md">
          <span className="rounded-full bg-secondary-fixed px-3 py-1 font-label-sm text-label-sm tracking-wider text-on-secondary-fixed uppercase">
            {number}
          </span>
          <h2
            id={headingId}
            className="font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg"
          >
            {category.label}
          </h2>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {category.description}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} data-story-item>
            <MenuCard item={item} onBrew={onBrew} />
          </div>
        ))}
      </div>
    </section>
  )
}

function MenuGridSkeleton() {
  return (
    <div className="flex flex-col gap-space-xl" aria-hidden="true">
      {[0, 1].map((section) => (
        <div key={section} className="flex flex-col gap-space-lg">
          <div className="h-8 w-80 max-w-full animate-pulse rounded-full bg-surface-container" />
          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-soft"
              >
                <div className="h-44 animate-pulse bg-surface-container" />
                <div className="space-y-3 p-space-lg">
                  <div className="h-5 w-40 animate-pulse rounded bg-surface-container" />
                  <div className="h-4 w-full animate-pulse rounded bg-surface-container" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-surface-container" />
                  <div className="h-10 w-full animate-pulse rounded-full bg-surface-container" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
