import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Coffee,
  Flame,
  Loader2,
  Minus,
  NotebookPen,
  PackageOpen,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'

import { PageHeader } from '@/components/admin/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { StatusPill } from '@/components/ui/status-pill'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import {
  createMenuItem,
  deleteMenuItem,
  duplicateMenuItem,
  getMenuCategories,
  getMenuItems,
  getMenuManagerMeta,
  queryKeys,
  updateMenuItem,
  type MenuItemDraft,
} from '@/mocks/api'
import type { MenuCategoryMeta, MenuCategorySlug, MenuItem, MenuStatus } from '@/mocks/schema'
import { cn, formatCurrency } from '@/lib/utils'

const PAGE_SIZE = 8

type StatusFilter = 'all' | MenuStatus
type CategoryFilter = 'all' | MenuCategorySlug
type SortKey = 'popularity' | 'name' | 'price'

const statusLabels: Record<StatusFilter, string> = {
  all: 'All statuses',
  live: 'Live on menu',
  sold_out: 'Sold out',
  draft: 'Drafts',
}

const statusPillTone = {
  live: 'live',
  sold_out: 'sold_out',
  draft: 'draft',
} as const

export function MenuManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortKey>('popularity')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null)

  const menuQuery = useQuery({
    queryKey: queryKeys.menu(true),
    queryFn: () => getMenuItems(true),
  })
  const categoriesQuery = useQuery({
    queryKey: ['menu', 'categories'],
    queryFn: getMenuCategories,
  })
  const metaQuery = useQuery({
    queryKey: queryKeys.menuMeta,
    queryFn: getMenuManagerMeta,
  })

  const items = menuQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const meta = metaQuery.data?.meta
  const images = metaQuery.data?.images ?? []
  const vessels = metaQuery.data?.vessels ?? []

  const invalidateMenu = () => queryClient.invalidateQueries({ queryKey: ['menu'] })

  const createMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: (item) => {
      void invalidateMenu()
      setEditorOpen(false)
      toast({
        title: `${item.name} added`,
        description: 'The mock menu slate and public menu now share this record.',
        tone: 'success',
      })
    },
    onError: () => {
      toast({ title: 'Could not add the brew', description: 'Try again.', tone: 'error' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: MenuItemDraft }) => updateMenuItem(id, draft),
    onSuccess: (item) => {
      void invalidateMenu()
      setEditorOpen(false)
      toast({
        title: `${item.name} updated`,
        description: 'The mock menu slate has been updated.',
        tone: 'success',
      })
    },
    onError: () => {
      toast({ title: 'Could not update the brew', description: 'Try again.', tone: 'error' })
    },
  })

  const duplicateMutation = useMutation({
    mutationFn: duplicateMenuItem,
    onSuccess: (item) => {
      void invalidateMenu()
      setStatus('all')
      setCategory('all')
      setPage(1)
      toast({
        title: `${item.name} created as a draft`,
        description: 'Find it under the Drafts status filter.',
        tone: 'success',
      })
    },
    onError: () => {
      toast({ title: 'Could not duplicate the brew', description: 'Try again.', tone: 'error' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      void invalidateMenu()
      setDeleteTarget(null)
      toast({ title: 'Brew removed', description: 'The mock record was deleted.', tone: 'success' })
    },
    onError: () => {
      toast({ title: 'Could not remove the brew', description: 'Try again.', tone: 'error' })
    },
  })

  const counts = useMemo(() => {
    const byCategory = new Map<string, number>()
    const byStatus = new Map<string, number>()
    items.forEach((item) => {
      byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + 1)
      byStatus.set(item.status, (byStatus.get(item.status) ?? 0) + 1)
    })
    return { byCategory, byStatus }
  }, [items])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = items.filter((item) => {
      const categoryMatch = category === 'all' || item.category === category
      const statusMatch = status === 'all' || item.status === status
      const queryMatch =
        query.length === 0 ||
        [item.name, item.origin, item.vessel, item.ratio, ...item.tags]
          .join(' ')
          .toLowerCase()
          .includes(query)
      return categoryMatch && statusMatch && queryMatch
    })
    return filtered.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'price') return b.price - a.price
      return b.dispensed - a.dispensed
    })
  }, [category, items, search, sort, status])

  useEffect(() => {
    setPage(1)
  }, [category, status, search, sort])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openCreate = () => {
    setEditingItem(null)
    setEditorOpen(true)
  }

  const openEdit = (item: MenuItem) => {
    setEditingItem(item)
    setEditorOpen(true)
  }

  const onSubmitEditor = (draft: MenuItemDraft) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, draft })
    } else {
      createMutation.mutate(draft)
    }
  }

  const clearFilters = () => {
    setCategory('all')
    setStatus('all')
    setSearch('')
    setSort('popularity')
    setPage(1)
  }

  const placeholder = (title: string, description: string) => {
    toast({ title, description })
  }

  const isPending = menuQuery.isPending || categoriesQuery.isPending || metaQuery.isPending
  const isError = menuQuery.isError || categoriesQuery.isError || metaQuery.isError

  return (
    <div>
      <PageHeader
        eyebrow="Atelier catalogue"
        title="Pot & Brew Menu Management"
        description="Real-time status, vessel pairings, and rolling 24-hour consumption metrics for the canonical twenty-drink slate."
        actions={
          <Button onClick={openCreate} size="md">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add New Pot Brew
          </Button>
        }
      />

      {isError ? (
        <div role="alert" className="mb-5 rounded-card bg-error-container p-5 text-on-error-container">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-label-lg text-label-lg">The menu fixtures could not be loaded.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-on-error-container/30 text-on-error-container"
                onClick={() => {
                  void menuQuery.refetch()
                  void categoriesQuery.refetch()
                  void metaQuery.refetch()
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {isPending ? (
        <div className="grid gap-5 xl:grid-cols-12" aria-hidden="true">
          <div className="h-[36rem] animate-pulse rounded-card bg-surface-container-lowest xl:col-span-8" />
          <div className="h-[36rem] animate-pulse rounded-card bg-surface-container-lowest xl:col-span-4" />
        </div>
      ) : null}

      {!isPending && !isError ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <section className="min-w-0 rounded-card bg-surface-container-lowest shadow-soft xl:col-span-8">
            <div className="border-b border-outline-variant/25 p-4 sm:p-5">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  aria-pressed={category === 'all'}
                  className={cn(
                    'shrink-0 cursor-pointer rounded-full px-3 py-1.5 font-label-md text-label-md transition-colors',
                    category === 'all'
                      ? 'bg-primary-container text-surface-bright'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface',
                  )}
                >
                  All ({items.length} Formulations)
                </button>
                {categories.map((entry) => (
                  <button
                    key={entry.slug}
                    type="button"
                    onClick={() => setCategory(entry.slug)}
                    aria-pressed={category === entry.slug}
                    className={cn(
                      'shrink-0 cursor-pointer rounded-full px-3 py-1.5 font-label-md text-label-md transition-colors',
                      category === entry.slug
                        ? 'bg-primary-container text-surface-bright'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface',
                    )}
                  >
                    {entry.shortLabel} ({counts.byCategory.get(entry.slug) ?? 0})
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                    aria-hidden="true"
                  />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search brews, origins, vessels…"
                    aria-label="Search menu formulations"
                    className="pl-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-auto lg:grid-cols-none lg:grid-flow-col">
                  <Select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as StatusFilter)}
                    aria-label="Filter by status"
                    className="min-w-36 text-label-sm"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                  <Select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    aria-label="Sort formulations"
                    className="min-w-44 text-label-sm"
                  >
                    <option value="popularity">Sorted by Popularity (Past 24h)</option>
                    <option value="name">Name A–Z</option>
                    <option value="price">Price high to low</option>
                  </Select>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="success">
                  {counts.byStatus.get('live') ?? 0} live
                </Badge>
                <Badge variant="danger">{counts.byStatus.get('sold_out') ?? 0} sold out</Badge>
                <Badge variant="neutral">{counts.byStatus.get('draft') ?? 0} drafts</Badge>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {meta?.statusNote}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-left">
                <caption className="sr-only">Menu formulations</caption>
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container-low/60">
                    {['Formulation', 'Vessel & Ratio', 'Price', 'Menu Status', '24h Dispensed', 'Actions'].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-4 py-2.5 font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item) => {
                    const categoryMeta = categories.find((entry) => entry.slug === item.category)
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-low/55"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              width={44}
                              height={44}
                              loading="lazy"
                              className="h-11 w-11 shrink-0 rounded-card object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-label-lg text-label-lg font-bold text-primary">
                                {item.name}
                              </p>
                              <p className="truncate font-body-sm text-[11px] text-on-surface-variant">
                                {item.origin} • {categoryMeta?.shortLabel ?? item.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-body-sm text-body-sm text-on-surface">{item.vessel}</p>
                          <p className="font-body-sm text-[11px] text-on-surface-variant">{item.ratio}</p>
                        </td>
                        <td className="px-4 py-3 font-label-lg text-label-lg font-bold text-primary">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill tone={statusPillTone[item.status]}>
                            {item.status === 'live'
                              ? 'Live on Menu'
                              : item.status === 'draft'
                                ? 'Draft Formulation'
                                : 'Sold Out'}
                          </StatusPill>
                          {item.status === 'sold_out' ? (
                            <p className="mt-1 font-body-sm text-[11px] text-on-surface-variant">
                              {item.trendLabel}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-label-md text-label-md text-primary">
                            {item.dispensed} {item.dispensedUnit}
                          </p>
                          <p
                            className={cn(
                              'mt-0.5 flex items-center gap-1 font-body-sm text-[11px]',
                              item.trend > 0
                                ? 'text-[#3f7a34]'
                                : item.trend < 0
                                  ? 'text-error'
                                  : 'text-on-surface-variant',
                            )}
                          >
                            {item.trend > 0 ? (
                              <TrendingUp className="h-3 w-3" aria-hidden="true" />
                            ) : item.trend < 0 ? (
                              <TrendingDown className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <Minus className="h-3 w-3" aria-hidden="true" />
                            )}
                            {item.trend > 0
                              ? `+${item.trend}%`
                              : item.trend < 0
                                ? `${item.trend}%`
                                : item.trendLabel}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Edit ${item.name}`}
                              title="Edit"
                              onClick={() => openEdit(item)}
                            >
                              <Pencil className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Duplicate ${item.name}`}
                              title="Duplicate as draft"
                              disabled={duplicateMutation.isPending}
                              onClick={() => duplicateMutation.mutate(item.id)}
                            >
                              <Copy className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Delete ${item.name}`}
                              title="Delete"
                              className="text-error hover:bg-error-container hover:text-on-error-container"
                              onClick={() => setDeleteTarget(item)}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-16 text-center">
                <Coffee className="h-8 w-8 text-outline" aria-hidden="true" />
                <h2 className="mt-3 font-headline-sm text-headline-sm text-primary">
                  No formulations match those filters
                </h2>
                <p className="mt-1 max-w-sm font-body-md text-body-md text-on-surface-variant">
                  Clear the search or status filter to return to the full twenty-drink slate.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-outline-variant/25 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Displaying {filteredItems.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredItems.length)} of {filteredItems.length} atelier
                recipes
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Previous page"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                    className={cn(
                      'h-8 w-8 cursor-pointer rounded-full font-label-md text-label-md transition-colors',
                      currentPage === pageNumber
                        ? 'bg-primary-container text-surface-bright'
                        : 'text-on-surface-variant hover:bg-surface-container',
                    )}
                  >
                    {pageNumber}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Next page"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-5 xl:col-span-4">
            <section className="rounded-card bg-surface-container-lowest p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                      <Flame className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-primary">Kiln Pottery Inventory</h2>
                      <p className="font-label-sm text-label-sm tracking-wider text-secondary uppercase">
                        Kiln 2 Firing
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant">
                    Handmade vessel reserves: active unglazed clay cups and hand-thrown vessels available
                    for barista service.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                {meta?.vesselStock.map((vessel) => (
                  <div key={vessel.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-label-md text-label-md text-primary">{vessel.name}</p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">{vessel.detail}</p>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 font-label-sm text-label-sm font-bold',
                          vessel.tone === 'error' ? 'text-error' : 'text-secondary',
                        )}
                      >
                        {vessel.capacityLabel}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          vessel.tone === 'error'
                            ? 'bg-error'
                            : vessel.tone === 'resting'
                              ? 'bg-primary-container'
                              : 'bg-secondary',
                        )}
                        style={{ width: `${vessel.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 font-body-sm text-[11px] text-on-surface-variant">{vessel.note}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() =>
                  placeholder(
                    'Clay artisan restock',
                    'A clay artisan restock request is not designed in this prototype.',
                  )
                }
              >
                <PackageOpen className="h-4 w-4" aria-hidden="true" />
                Request Clay Artisan Restock
              </Button>
            </section>

            <section className="rounded-card bg-surface-container-lowest p-5 shadow-soft">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-primary">
                  <NotebookPen className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">Batch Roaster Status</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Single Origin Bean Readiness
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {meta?.beanReadiness.map((bean) => (
                  <div key={bean.id} className="rounded-card bg-surface-container-low p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-label-md text-label-md text-primary">{bean.name}</p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">{bean.detail}</p>
                      </div>
                      <StatusPill tone={bean.tone === 'warm' ? 'live' : bean.tone === 'resting' ? 'scheduled' : 'pending'}>
                        {bean.readiness}
                      </StatusPill>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-outline-variant/25 pt-3 font-label-sm text-label-sm text-on-surface-variant">
                {meta?.roastedOnHand}
              </p>
            </section>

            <section className="rounded-card bg-primary-container p-5 text-surface-bright shadow-soft">
              <div className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-secondary-container" aria-hidden="true" />
                <h2 className="font-headline-sm text-headline-sm">Artisan Extraction Protocol</h2>
              </div>
              <p className="mt-3 font-body-sm text-body-sm leading-relaxed text-outline-variant">
                {meta?.protocol}
              </p>
            </section>
          </aside>
        </div>
      ) : null}

      <MenuEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        item={editingItem}
        categories={categories}
        vessels={vessels}
        images={images}
        pending={createMutation.isPending || updateMutation.isPending}
        onSubmit={onSubmitEditor}
      />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove this brew?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `${deleteTarget.name} will be removed from the in-browser mock slate. This is not a real deletion.`
                : 'This removes the record from the mock slate.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              )}
              Delete brew
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type FormState = {
  name: string
  category: MenuCategorySlug
  price: string
  badge: string
  description: string
  tags: string
  size: string
  status: MenuStatus
  vessel: string
  ratio: string
  origin: string
  image: string
}

const defaultForm: FormState = {
  name: '',
  category: 'espresso',
  price: '5.00',
  badge: 'New Listing',
  description: '',
  tags: '',
  size: '',
  status: 'draft',
  vessel: '',
  ratio: '',
  origin: '',
  image: '/images/menu/menu-01.jpg',
}

function MenuEditorDialog({
  open,
  onOpenChange,
  item,
  categories,
  vessels,
  images,
  pending,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItem | null
  categories: MenuCategoryMeta[]
  vessels: readonly string[]
  images: readonly { value: string; label: string }[]
  pending: boolean
  onSubmit: (draft: MenuItemDraft) => void
}) {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    if (item) {
      setForm({
        name: item.name,
        category: item.category,
        price: item.price.toFixed(2),
        badge: item.badge,
        description: item.description,
        tags: item.tags.join(', '),
        size: item.size,
        status: item.status,
        vessel: item.vessel,
        ratio: item.ratio,
        origin: item.origin,
        image: item.image,
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
  }, [item, open])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    const price = Number(form.price)
    if (form.name.trim().length < 2) nextErrors.name = 'Give the brew a name.'
    if (Number.isNaN(price) || price < 0) nextErrors.price = 'Use a positive sample price.'
    if (form.description.trim().length < 10)
      nextErrors.description = 'Add at least a short tasting description.'
    if (form.tags.trim().length === 0) nextErrors.tags = 'Add at least one tasting accent.'
    if (form.vessel.trim().length === 0) nextErrors.vessel = 'Choose a vessel pairing.'
    if (form.ratio.trim().length === 0) nextErrors.ratio = 'Describe the extraction ratio.'
    if (form.origin.trim().length === 0) nextErrors.origin = 'Add the origin or terroir.'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price,
      badge: form.badge.trim() || 'House Listing',
      description: form.description.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      size: form.size.trim() || 'House Pour',
      status: form.status,
      vessel: form.vessel,
      ratio: form.ratio.trim(),
      origin: form.origin.trim(),
      image: form.image,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit pot brew' : 'Formulate New Brew Offering'}</DialogTitle>
          <DialogDescription>
            Specify extraction physics, clay vessel pairing, and origin notes for the mock slate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-5" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Drink Name" htmlFor="brew-name" error={errors.name} className="sm:col-span-2">
              <Input
                id="brew-name"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="e.g. Hearth Cardamom Cezve"
                aria-invalid={Boolean(errors.name) || undefined}
                aria-describedby={errors.name ? 'brew-name-error' : undefined}
              />
            </Field>
            <Field label="Menu Category" htmlFor="brew-category">
              <Select
                id="brew-category"
                value={form.category}
                onChange={(event) => update('category', event.target.value as MenuCategorySlug)}
              >
                {categories.map((entry) => (
                  <option key={entry.slug} value={entry.slug}>
                    {entry.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Price ($ USD, sample)" htmlFor="brew-price" error={errors.price}>
              <Input
                id="brew-price"
                type="number"
                min="0"
                step="0.25"
                value={form.price}
                onChange={(event) => update('price', event.target.value)}
                aria-invalid={Boolean(errors.price) || undefined}
                aria-describedby={errors.price ? 'brew-price-error' : undefined}
              />
            </Field>
            <Field label="Ratio" htmlFor="brew-ratio" error={errors.ratio}>
              <Input
                id="brew-ratio"
                value={form.ratio}
                onChange={(event) => update('ratio', event.target.value)}
                placeholder="e.g. 1:9 / 60-Mesh Grind"
                aria-invalid={Boolean(errors.ratio) || undefined}
              />
            </Field>
            <Field label="Brew Vessel / Cup Pairing" htmlFor="brew-vessel" error={errors.vessel}>
              <Select
                id="brew-vessel"
                value={form.vessel}
                onChange={(event) => update('vessel', event.target.value)}
              >
                <option value="">Choose a vessel</option>
                {vessels.map((vessel) => (
                  <option key={vessel} value={vessel}>
                    {vessel}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Single Origin / Terroir" htmlFor="brew-origin" error={errors.origin}>
              <Input
                id="brew-origin"
                value={form.origin}
                onChange={(event) => update('origin', event.target.value)}
                placeholder="e.g. Haraz, Yemen"
                aria-invalid={Boolean(errors.origin) || undefined}
              />
            </Field>
            <Field label="Badge / House Label" htmlFor="brew-badge">
              <Input
                id="brew-badge"
                value={form.badge}
                onChange={(event) => update('badge', event.target.value)}
                placeholder="e.g. Signature"
              />
            </Field>
            <Field label="Serve Size" htmlFor="brew-size">
              <Input
                id="brew-size"
                value={form.size}
                onChange={(event) => update('size', event.target.value)}
                placeholder="e.g. 30 ml • 1 oz"
              />
            </Field>
            <Field label="Menu Status" htmlFor="brew-status">
              <Select
                id="brew-status"
                value={form.status}
                onChange={(event) => update('status', event.target.value as MenuStatus)}
              >
                <option value="live">Live on menu</option>
                <option value="draft">Draft formulation</option>
                <option value="sold_out">Sold out</option>
              </Select>
            </Field>
            <Field label="Asset Visual" htmlFor="brew-image" className="sm:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select
                  id="brew-image"
                  value={form.image}
                  onChange={(event) => update('image', event.target.value)}
                  className="flex-1"
                >
                  {images.map((image) => (
                    <option key={image.value} value={image.value}>
                      {image.label}
                    </option>
                  ))}
                </Select>
                <img
                  src={form.image}
                  alt="Selected menu asset preview"
                  width={112}
                  height={72}
                  className="h-[72px] w-28 rounded-card object-cover"
                />
              </div>
            </Field>
            <Field
              label="Tasting Accents & Notes"
              htmlFor="brew-tags"
              error={errors.tags}
              hint="Comma-separated; shown as tasting tags."
              className="sm:col-span-2"
            >
              <Input
                id="brew-tags"
                value={form.tags}
                onChange={(event) => update('tags', event.target.value)}
                placeholder="e.g. Cardamom, Dense Crema, Honeyed"
                aria-invalid={Boolean(errors.tags) || undefined}
                aria-describedby={errors.tags ? 'brew-tags-error' : undefined}
              />
            </Field>
            <Field
              label="Guest-Facing Description"
              htmlFor="brew-description"
              error={errors.description}
              className="sm:col-span-2"
            >
              <Textarea
                id="brew-description"
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
                placeholder="A short tasting description for the public menu."
                aria-invalid={Boolean(errors.description) || undefined}
                aria-describedby={errors.description ? 'brew-description-error' : undefined}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              {item ? 'Save Changes' : 'Save & Cast to Menu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && !error ? (
        <p className="mt-1 font-body-sm text-[11px] text-on-surface-variant">{hint}</p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 font-body-sm text-[11px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
