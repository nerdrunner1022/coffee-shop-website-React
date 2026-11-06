import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  CalendarDays,
  ChartSpline,
  Download,
  Info,
  Loader2,
  Megaphone,
  Pause,
  Pencil,
  Play,
  Plus,
  ReceiptText,
  RotateCcw,
  Save,
  Tag,
} from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'

import { PageHeader } from '@/components/admin/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { StatusPill } from '@/components/ui/status-pill'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import {
  createOffer,
  getOffers,
  queryKeys,
  toggleOfferStatus,
  updateOffer,
} from '@/mocks/api'
import { offerDraftSchema, type Offer, type OfferDraft } from '@/mocks/schema'
import { cn } from '@/lib/utils'

type OfferTab = 'all' | 'active' | 'scheduled' | 'expired'

const tabLabels: Record<OfferTab, string> = {
  all: 'All Records',
  active: 'Active',
  scheduled: 'Scheduled',
  expired: 'Expired',
}

const analyticsIcons = {
  payments: ReceiptText,
  auto_graph: ChartSpline,
  cloud_download: Download,
} as const

const today = new Date().toISOString().slice(0, 10)
const inThirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

const defaultDraft: OfferDraft = {
  title: '',
  code: '',
  discount: 'Percentage Off (% discount on category)',
  description: '',
  startDate: today,
  endDate: inThirtyDays,
  totalCap: '200',
  perDayCap: '25',
  channel: 'Dine-in Hearth',
  terms: 'One redemption per guest, per visit. Cannot be combined with other hearth offers.',
  autoApply: true,
}

export function OffersPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<OfferTab>('active')
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [builderKey, setBuilderKey] = useState(0)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.offers,
    queryFn: getOffers,
  })

  const invalidateOffers = () => queryClient.invalidateQueries({ queryKey: queryKeys.offers })

  const createMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: (offer) => {
      void invalidateOffers()
      setBuilderKey((value) => value + 1)
      toast({
        title: `${offer.title} launched`,
        description: 'The mock campaign is active and visible in the offer ledger.',
        tone: 'success',
      })
    },
    onError: () => {
      toast({ title: 'Could not launch the offer', description: 'Try again.', tone: 'error' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: OfferDraft }) => updateOffer(id, draft),
    onSuccess: (offer) => {
      void invalidateOffers()
      setEditingOffer(null)
      toast({
        title: `${offer.title} updated`,
        description: 'The mock campaign record has been updated.',
        tone: 'success',
      })
    },
    onError: () => {
      toast({ title: 'Could not update the offer', description: 'Try again.', tone: 'error' })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: toggleOfferStatus,
    onSuccess: (offer) => {
      void invalidateOffers()
      toast({
        title: offer.status === 'paused' ? `${offer.title} paused` : `${offer.title} resumed`,
        description:
          offer.status === 'paused'
            ? 'Find paused campaigns under All Records.'
            : 'The campaign is active again in the mock ledger.',
        tone: 'success',
      })
    },
    onError: () => {
      toast({ title: 'Could not change the offer status', description: 'Try again.', tone: 'error' })
    },
  })

  const counts = data?.counts
  const offers = data?.offers ?? []

  const tabOffers =
    tab === 'all'
      ? offers
      : tab === 'active'
        ? offers.filter((offer) => offer.status === 'active')
        : []

  const tabCount =
    tab === 'all'
      ? counts?.all
      : tab === 'active'
        ? counts?.active
        : tab === 'scheduled'
          ? counts?.scheduled
          : counts?.expired

  const placeholder = (title: string, description: string) => {
    toast({ title, description })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Promotional hearth"
        title="Hearth Offers & Promos"
        description="Compose tiered tasting promotions, bundle terracotta wares, and follow redemption velocity across the atelier."
        actions={
          <Button onClick={() => setBuilderKey((value) => value + 1)} variant="outline">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset Builder Draft
          </Button>
        }
      />

      {isError ? (
        <div role="alert" className="mb-5 rounded-card bg-error-container p-5 text-on-error-container">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-label-lg text-label-lg">The offer fixture could not be loaded.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-on-error-container/30 text-on-error-container"
                onClick={() => void refetch()}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {isPending ? (
        <div className="grid gap-5 xl:grid-cols-12" aria-hidden="true">
          <div className="h-[42rem] animate-pulse rounded-card bg-surface-container-lowest xl:col-span-5" />
          <div className="h-[42rem] animate-pulse rounded-card bg-surface-container-lowest xl:col-span-7" />
        </div>
      ) : null}

      {data ? (
        <>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {data.analytics.map((stat) => {
              const Icon = analyticsIcons[stat.icon]
              return (
                <div key={stat.id} className="rounded-card bg-surface-container-lowest p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <Badge variant="warm">{stat.trend}</Badge>
                  </div>
                  <p className="mt-3 font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 font-headline-sm text-headline-sm font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{stat.note}</p>
                  <p className="mt-2 border-t border-outline-variant/25 pt-2 font-body-sm text-[11px] text-on-surface-variant">
                    {stat.detail}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <section className="rounded-card bg-surface-container-lowest shadow-soft xl:col-span-5">
              <div className="border-b border-outline-variant/25 p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                    <Megaphone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      Seasonal Offer Builder
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Compose a new mock campaign for the atelier slate.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <OfferFormPanel
                  key={`builder-${builderKey}`}
                  initialDraft={defaultDraft}
                  discounts={data.discounts}
                  channels={data.channels}
                  pending={createMutation.isPending}
                  mode="create"
                  onSubmit={(draft) => createMutation.mutate(draft)}
                />
              </div>
            </section>

            <section className="min-w-0 rounded-card bg-surface-container-lowest shadow-soft xl:col-span-7">
              <div className="border-b border-outline-variant/25 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      Live Roastery Campaigns
                    </h2>
                    <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                      Redemptions synchronize across atelier counter terminals in real time.
                    </p>
                  </div>
                  <Badge variant="success">{counts?.active ?? 0} active promotions</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-1 rounded-full bg-surface-container p-1">
                  {(Object.keys(tabLabels) as OfferTab[]).map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => setTab(entry)}
                      aria-pressed={tab === entry}
                      className={cn(
                        'cursor-pointer rounded-full px-3 py-1.5 font-label-md text-label-md transition-colors',
                        tab === entry
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-primary',
                      )}
                    >
                      {tabLabels[entry]} ({entry === 'all' ? (counts?.all ?? 0) : (counts?.[entry] ?? 0)})
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5">
                {tab === 'scheduled' || tab === 'expired' ? (
                  <div className="flex flex-col items-center rounded-card bg-surface-container-low px-4 py-16 text-center">
                    <Info className="h-8 w-8 text-outline" aria-hidden="true" />
                    <h3 className="mt-3 font-headline-sm text-headline-sm text-primary">
                      {tabCount ?? 0} {tab === 'scheduled' ? 'scheduled' : 'expired'} offers counted
                    </h3>
                    <p className="mt-1 max-w-md font-body-md text-body-md text-on-surface-variant">
                      The supplied mockup reports this count, but no {tab} records were supplied. None
                      have been invented for this prototype.
                    </p>
                  </div>
                ) : tabOffers.length === 0 ? (
                  <div className="flex flex-col items-center rounded-card bg-surface-container-low px-4 py-16 text-center">
                    <Tag className="h-8 w-8 text-outline" aria-hidden="true" />
                    <h3 className="mt-3 font-headline-sm text-headline-sm text-primary">
                      No active campaigns
                    </h3>
                    <p className="mt-1 max-w-md font-body-md text-body-md text-on-surface-variant">
                      All current records are paused. Open All Records to resume one.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {tabOffers.map((offer) => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        onEdit={() => setEditingOffer(offer)}
                        onToggle={() => toggleMutation.mutate(offer.id)}
                        toggling={toggleMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-card bg-surface-container-lowest shadow-soft">
            <div className="flex flex-col gap-3 border-b border-outline-variant/25 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary">
                  Live POS Redemption Audit Log
                </h2>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Mock terminal rows copied from the supplied offers mockup.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  placeholder(
                    'CSV ledger export',
                    'Exporting the audit ledger is not designed in this prototype.',
                  )
                }
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export Full Ledger (.CSV)
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[940px] border-collapse text-left">
                <caption className="sr-only">Redemption audit log</caption>
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container-low/60">
                    {['Timestamp', 'Campaign', 'Terminal / Station', 'Channel', 'Discount', 'Net Ticket', 'Status'].map(
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
                  {data.audit.map((row) => (
                    <tr key={row.id} className="border-b border-outline-variant/20 last:border-0">
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                        {row.timestamp}
                      </td>
                      <td className="px-4 py-3 font-label-md text-label-md font-bold text-primary">
                        {row.campaign}
                      </td>
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                        {row.station}
                      </td>
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                        {row.channel}
                      </td>
                      <td className="px-4 py-3 font-label-md text-label-md text-secondary">{row.discount}</td>
                      <td className="px-4 py-3 font-label-md text-label-md font-bold text-primary">
                        {row.net}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill tone={row.status === 'Applied' ? 'paid' : 'deposit'}>
                          {row.status}
                        </StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      <Dialog open={Boolean(editingOffer)} onOpenChange={(open) => !open && setEditingOffer(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit hearth offer</DialogTitle>
            <DialogDescription>
              Update the mock campaign. Redemptions and revenue attribution remain unchanged.
            </DialogDescription>
          </DialogHeader>
          {editingOffer && data ? (
            <div className="mt-5">
              <OfferFormPanel
                key={editingOffer.id}
                initialDraft={offerToDraft(editingOffer)}
                discounts={data.discounts}
                channels={data.channels}
                pending={updateMutation.isPending}
                mode="edit"
                onSubmit={(draft) => updateMutation.mutate({ id: editingOffer.id, draft })}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OfferCard({
  offer,
  onEdit,
  onToggle,
  toggling,
}: {
  offer: Offer
  onEdit: () => void
  onToggle: () => void
  toggling: boolean
}) {
  const percent = Math.min(100, Math.round((offer.redemptions / offer.redemptionsCap) * 100))
  return (
    <article className="overflow-hidden rounded-card border border-outline-variant/30 bg-surface-container-low">
      <div className="flex flex-col gap-3 p-4 sm:flex-row">
        <img
          src={offer.image}
          alt={offer.imageAlt}
          width={96}
          height={96}
          loading="lazy"
          className="h-24 w-full shrink-0 rounded-card object-cover sm:w-24"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="warm">{offer.badge}</Badge>
                <StatusPill tone={offer.status === 'active' ? 'active' : 'paused'}>
                  {offer.status === 'active' ? 'Active' : 'Paused'}
                </StatusPill>
              </div>
              <h3 className="mt-1.5 font-headline-sm text-headline-sm text-primary">{offer.title}</h3>
            </div>
            <span className="font-label-md text-label-md font-bold text-primary">
              {offer.metricValue}
            </span>
          </div>
          <p className="mt-1 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            {offer.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-body-sm text-[11px] text-on-surface-variant">
            <span className="font-label-sm text-label-sm text-secondary">Code: {offer.code}</span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              Valid through {offer.validThrough}
            </span>
            <span>{offer.timeLabel}</span>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2 font-body-sm text-[11px] text-on-surface-variant">
              <span>
                {offer.redemptions} redeemed this week · {percent}% cap ({offer.redemptionsCap} max)
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {offer.metricLabel}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
              <div
                className={cn('h-full rounded-full', percent >= 90 ? 'bg-error' : 'bg-secondary')}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Edit Offer
            </Button>
            <Button
              variant="soft"
              size="sm"
              onClick={onToggle}
              disabled={toggling}
              aria-label={`${offer.status === 'active' ? 'Pause' : 'Resume'} ${offer.title}`}
            >
              {offer.status === 'active' ? (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {offer.status === 'active' ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

function OfferFormPanel({
  initialDraft,
  discounts,
  channels,
  pending,
  mode,
  onSubmit,
}: {
  initialDraft: OfferDraft
  discounts: readonly string[]
  channels: readonly string[]
  pending: boolean
  mode: 'create' | 'edit'
  onSubmit: (draft: OfferDraft) => void
}) {
  const [draft, setDraft] = useState<OfferDraft>(initialDraft)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = <K extends keyof OfferDraft>(key: K, value: OfferDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = offerDraftSchema.safeParse(draft)
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      Object.entries(parsed.error.flatten().fieldErrors).forEach(([key, messages]) => {
        nextErrors[key] = messages?.[0] ?? 'Check this field.'
      })
      setErrors(nextErrors)
      return
    }
    setErrors({})
    onSubmit(parsed.data)
  }

  const reset = () => {
    setDraft(initialDraft)
    setErrors({})
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <OfferField
          label="Offer Campaign Title"
          htmlFor="offer-title"
          error={errors.title}
          className="sm:col-span-2"
        >
          <Input
            id="offer-title"
            value={draft.title}
            onChange={(event) => update('title', event.target.value)}
            placeholder="e.g. First Frost Cupping Flight"
            aria-invalid={Boolean(errors.title) || undefined}
            aria-describedby={errors.title ? 'offer-title-error' : undefined}
          />
        </OfferField>

        <OfferField label="Redemption Code" htmlFor="offer-code" error={errors.code}>
          <Input
            id="offer-code"
            value={draft.code}
            onChange={(event) => update('code', event.target.value.toUpperCase())}
            placeholder="e.g. FROSTPAIR"
            aria-invalid={Boolean(errors.code) || undefined}
            aria-describedby={errors.code ? 'offer-code-error' : undefined}
          />
        </OfferField>

        <OfferField label="Discount Mechanism" htmlFor="offer-discount">
          <Select
            id="offer-discount"
            value={draft.discount}
            onChange={(event) => update('discount', event.target.value)}
          >
            {discounts.map((discount) => (
              <option key={discount} value={discount}>
                {discount}
              </option>
            ))}
          </Select>
        </OfferField>

        <OfferField label="Channel & Guest Scope" htmlFor="offer-channel" className="sm:col-span-2">
          <Select
            id="offer-channel"
            value={draft.channel}
            onChange={(event) => update('channel', event.target.value)}
          >
            {channels.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </Select>
        </OfferField>

        <OfferField label="Active Schedule Window" htmlFor="offer-start" error={errors.startDate}>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="offer-start"
              type="date"
              value={draft.startDate}
              onChange={(event) => update('startDate', event.target.value)}
              aria-label="Offer start date"
            />
            <Input
              type="date"
              value={draft.endDate}
              onChange={(event) => update('endDate', event.target.value)}
              aria-label="Offer end date"
            />
          </div>
        </OfferField>

        <OfferField label="Cap Allocation / Cap per Guest" htmlFor="offer-total-cap" error={errors.totalCap}>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="offer-total-cap"
              type="number"
              min="1"
              value={draft.totalCap}
              onChange={(event) => update('totalCap', event.target.value)}
              aria-label="Total redemption cap"
            />
            <Input
              type="number"
              min="1"
              value={draft.perDayCap}
              onChange={(event) => update('perDayCap', event.target.value)}
              aria-label="Per-day redemption cap"
            />
          </div>
        </OfferField>

        <OfferField
          label="Guest-Facing Tasting Note & Terms"
          htmlFor="offer-description"
          error={errors.description}
          className="sm:col-span-2"
        >
          <Textarea
            id="offer-description"
            value={draft.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="A short, guest-facing description of the offer."
            aria-invalid={Boolean(errors.description) || undefined}
            aria-describedby={errors.description ? 'offer-description-error' : undefined}
          />
        </OfferField>

        <OfferField label="Fine Print" htmlFor="offer-terms" error={errors.terms} className="sm:col-span-2">
          <Textarea
            id="offer-terms"
            value={draft.terms}
            onChange={(event) => update('terms', event.target.value)}
            className="min-h-20"
            aria-invalid={Boolean(errors.terms) || undefined}
            aria-describedby={errors.terms ? 'offer-terms-error' : undefined}
          />
        </OfferField>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-card bg-surface-container-low p-3">
        <div>
          <p className="font-label-md text-label-md text-primary">Auto-apply at POS Register</p>
          <p className="font-body-sm text-[11px] text-on-surface-variant">
            Local prototype switch only. No terminal is connected.
          </p>
        </div>
        <Switch
          checked={draft.autoApply}
          onCheckedChange={(checked) => update('autoApply', checked)}
          aria-label="Auto-apply offer at the mock POS register"
        />
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {mode === 'create' ? (
          <Button type="button" variant="outline" onClick={reset}>
            Reset Draft
          </Button>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : mode === 'create' ? (
            <Plus className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          {mode === 'create' ? 'Launch Seasonal Offer' : 'Save Offer Changes'}
        </Button>
      </div>
    </form>
  )
}

function OfferField({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 font-body-sm text-[11px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function offerToDraft(offer: Offer): OfferDraft {
  return {
    title: offer.title,
    code: offer.code,
    discount: offer.discount,
    description: offer.description,
    startDate: offer.startDate,
    endDate: offer.endDate,
    totalCap: offer.totalCap,
    perDayCap: offer.perDayCap,
    channel: offer.channel,
    terms: offer.terms,
    autoApply: offer.autoApply,
  }
}
