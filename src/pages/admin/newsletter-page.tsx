import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Archive,
  CalendarClock,
  ChartSpline,
  Coffee,
  Copy,
  Loader2,
  MailOpen,
  Monitor,
  MousePointerClick,
  Newspaper,
  Save,
  Send,
  Smartphone,
  UserMinus,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { PageHeader } from '@/components/admin/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import {
  getNewsletter,
  publishNewsletter,
  queryKeys,
  saveNewsletterDraft,
} from '@/mocks/api'
import {
  newsletterDraftSchema,
  type Dispatch,
  type NewsletterDraft,
  type NewsletterOverview,
} from '@/mocks/schema'
import { cn } from '@/lib/utils'

const statTone = {
  warm: 'bg-secondary-fixed text-on-secondary-fixed',
  neutral: 'bg-surface-container text-primary',
  cream: 'bg-[#fff1e3] text-[#733600]',
  green: 'bg-[#dcead7] text-[#244a1f]',
} as const

const segmentTone = {
  warm: 'bg-secondary',
  dark: 'bg-primary-container',
  cream: 'bg-[#e3bfb2]',
} as const

export function NewsletterPage() {
  const { toast } = useToast()
  const [draft, setDraft] = useState<NewsletterDraft | null>(null)
  const [dirty, setDirty] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewMobile, setPreviewMobile] = useState(false)
  const initialized = useRef(false)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.newsletter,
    queryFn: getNewsletter,
  })

  useEffect(() => {
    if (data?.draft && !initialized.current) {
      setDraft(data.draft)
      initialized.current = true
    }
  }, [data])

  const saveMutation = useMutation({
    mutationFn: saveNewsletterDraft,
    onSuccess: () => {
      setDirty(false)
      toast({
        title: 'Draft saved locally',
        description: 'The mock draft is stored in this browser session only.',
        tone: 'success',
      })
    },
    onError: () => {
      toast({ title: 'Could not save the draft', description: 'Try again.', tone: 'error' })
    },
  })

  const publishMutation = useMutation({
    mutationFn: publishNewsletter,
    onSuccess: (result) => {
      setDirty(false)
      toast({
        title: 'Mock issue published',
        description: `${result.recipients} mock recipients selected. Nothing was sent and no list was contacted.`,
        tone: 'success',
      })
    },
    onError: () => {
      toast({ title: 'Could not publish the mock issue', description: 'Try again.', tone: 'error' })
    },
  })

  const update = <K extends keyof NewsletterDraft>(key: K, value: NewsletterDraft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
    setDirty(true)
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const validate = () => {
    if (!draft) return null
    const parsed = newsletterDraftSchema.safeParse(draft)
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      Object.entries(parsed.error.flatten().fieldErrors).forEach(([key, messages]) => {
        nextErrors[key] = messages?.[0] ?? 'Check this field.'
      })
      setErrors(nextErrors)
      toast({
        title: 'The draft needs attention',
        description: 'Complete the highlighted fields before continuing.',
        tone: 'error',
      })
      return null
    }
    setErrors({})
    return parsed.data
  }

  const save = () => {
    const parsed = validate()
    if (parsed) saveMutation.mutate(parsed)
  }

  const sendTest = () => {
    if (!validate() || !draft) return
    toast({
      title: 'Test proof not sent',
      description: 'Email delivery is out of scope. The mock proof passed local validation.',
      tone: 'default',
    })
  }

  const schedule = () => {
    if (!validate() || !draft) return
    toast({
      title: 'Scheduling not connected',
      description: 'No calendar or email provider is connected in this prototype.',
      tone: 'default',
    })
  }

  const publish = () => {
    const parsed = validate()
    if (parsed) publishMutation.mutate(parsed)
  }

  const duplicateDispatch = (dispatch: Dispatch) => {
    toast({
      title: `${dispatch.issue} cannot be duplicated fully`,
      description:
        'The supplied archive includes metrics but not the original body copy, so no content was fabricated.',
      tone: 'default',
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Parchment dispatch"
        title="Hearth Chronicle"
        description="Compose the next Chronicle, inspect the mock preview, and read the subscriber acquisition pulse."
        actions={
          <>
            <Button variant="outline" onClick={sendTest} disabled={!draft}>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send Test Proof
            </Button>
            <Button variant="dark" onClick={schedule} disabled={!draft}>
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              Schedule Publication
            </Button>
          </>
        }
      />

      {isError ? (
        <div role="alert" className="mb-5 rounded-card bg-error-container p-5 text-on-error-container">
          <div className="flex items-start gap-3">
            <Archive className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-label-lg text-label-lg">The Chronicle fixture could not be loaded.</p>
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
        <div className="space-y-5" aria-hidden="true">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-card bg-surface-container-lowest" />
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-12">
            <div className="h-[48rem] animate-pulse rounded-card bg-surface-container-lowest xl:col-span-7" />
            <div className="h-[48rem] animate-pulse rounded-card bg-surface-container-lowest xl:col-span-5" />
          </div>
        </div>
      ) : null}

      {data && draft ? (
        <>
          <NewsletterStats overview={data.overview} />

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <section className="rounded-card bg-surface-container-lowest shadow-soft xl:col-span-7">
              <div className="flex flex-col gap-3 border-b border-outline-variant/25 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                      <Newspaper className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-primary">
                        Newsletter Composer & Dispatch Desk
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Local draft. No dispatch provider is connected.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">Active manuscript draft</Badge>
                  <Badge variant={dirty ? 'warm' : 'success'}>
                    {dirty ? 'Unsaved local changes' : 'Saved locally'}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NewsletterField
                    label="Recipient Sphere"
                    htmlFor="chronicle-audience"
                    className="sm:col-span-2"
                  >
                    <Select
                      id="chronicle-audience"
                      value={draft.audience}
                      onChange={(event) => update('audience', event.target.value)}
                    >
                      {data.audiences.map((audience) => (
                        <option key={audience.value} value={audience.value}>
                          {audience.label} · {audience.count}
                        </option>
                      ))}
                    </Select>
                  </NewsletterField>

                  <NewsletterField
                    label="Chronicle Issue Designation"
                    htmlFor="chronicle-issue"
                    error={errors.issueTitle}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="chronicle-issue"
                      value={draft.issueTitle}
                      onChange={(event) => update('issueTitle', event.target.value)}
                      aria-invalid={Boolean(errors.issueTitle) || undefined}
                      aria-describedby={errors.issueTitle ? 'chronicle-issue-error' : undefined}
                    />
                  </NewsletterField>

                  <NewsletterField
                    label="Email Subject Line"
                    htmlFor="chronicle-subject"
                    error={errors.subject}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="chronicle-subject"
                      value={draft.subject}
                      onChange={(event) => update('subject', event.target.value)}
                      aria-invalid={Boolean(errors.subject) || undefined}
                      aria-describedby={errors.subject ? 'chronicle-subject-error' : undefined}
                    />
                  </NewsletterField>

                  <NewsletterField
                    label="Preheader Sub-text"
                    htmlFor="chronicle-preheader"
                    error={errors.preheader}
                    className="sm:col-span-2"
                    hint="Inbox snippet shown beneath the subject."
                  >
                    <Input
                      id="chronicle-preheader"
                      value={draft.preheader}
                      onChange={(event) => update('preheader', event.target.value)}
                      aria-invalid={Boolean(errors.preheader) || undefined}
                      aria-describedby={errors.preheader ? 'chronicle-preheader-error' : undefined}
                    />
                  </NewsletterField>

                  <NewsletterField
                    label="Editorial Body & Parchment Blocks"
                    htmlFor="chronicle-body"
                    error={errors.body}
                    className="sm:col-span-2"
                    hint="Plain text with ### headings; the preview renders headings and list lines."
                  >
                    <Textarea
                      id="chronicle-body"
                      value={draft.body}
                      onChange={(event) => update('body', event.target.value)}
                      rows={16}
                      className="min-h-72 font-body-md leading-relaxed"
                      aria-invalid={Boolean(errors.body) || undefined}
                      aria-describedby={errors.body ? 'chronicle-body-error' : undefined}
                    />
                  </NewsletterField>
                </div>

                <div className="mt-5 flex flex-col gap-2 border-t border-outline-variant/25 pt-5 sm:flex-row sm:flex-wrap sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={save}
                    disabled={saveMutation.isPending || !dirty}
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Save className="h-4 w-4" aria-hidden="true" />
                    )}
                    Save Draft
                  </Button>
                  <Button variant="secondary" onClick={sendTest}>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Send Test Proof
                  </Button>
                  <Button variant="outline" onClick={schedule}>
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                    Schedule Publication
                  </Button>
                  <Button onClick={publish} disabled={publishMutation.isPending}>
                    {publishMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="h-4 w-4" aria-hidden="true" />
                    )}
                    Publish to Subscribers Now
                  </Button>
                </div>
              </div>
            </section>

            <section className="rounded-card bg-surface-container-lowest shadow-soft xl:col-span-5">
              <div className="flex flex-col gap-3 border-b border-outline-variant/25 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">
                    Live Parchment Preview
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Simplified local render; not an email-client preview.
                  </p>
                </div>
                <div className="flex rounded-full bg-surface-container p-1" role="group" aria-label="Preview width">
                  <button
                    type="button"
                    onClick={() => setPreviewMobile(false)}
                    aria-pressed={!previewMobile}
                    className={cn(
                      'flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-label-sm text-label-sm transition-colors',
                      !previewMobile
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant',
                    )}
                  >
                    <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMobile(true)}
                    aria-pressed={previewMobile}
                    className={cn(
                      'flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-label-sm text-label-sm transition-colors',
                      previewMobile
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant',
                    )}
                  >
                    <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                    Mobile
                  </button>
                </div>
              </div>

              <div className="max-h-[52rem] overflow-y-auto p-4 sm:p-5">
                <div
                  className={cn(
                    'mx-auto overflow-hidden rounded-card border border-outline-variant/40 bg-[#fbf7f1] shadow-soft transition-all',
                    previewMobile ? 'max-w-xs' : 'max-w-lg',
                  )}
                >
                  <div className="bg-primary-container px-5 py-5 text-center text-surface-bright">
                    <div className="flex items-center justify-center gap-2">
                      <Coffee className="h-4 w-4 text-secondary-container" aria-hidden="true" />
                      <span className="font-display-lg text-[18px] text-surface-bright">
                        Beans in a Pot
                      </span>
                    </div>
                    <p className="mt-1 font-label-sm text-[9px] tracking-[0.22em] text-outline-variant uppercase">
                      The Hearth Chronicle
                    </p>
                  </div>
                  <div className="p-5">
                    <p className="font-label-sm text-[10px] tracking-wider text-secondary uppercase">
                      {draft.issueTitle.split(':')[0] ?? draft.issueTitle}
                    </p>
                    <h3 className="mt-1 font-display-lg text-[24px] leading-tight text-primary">
                      {draft.issueTitle.split(':').slice(1).join(':').trim() || draft.issueTitle}
                    </h3>
                    <p className="mt-1 font-body-sm text-[12px] text-on-surface-variant italic">
                      {draft.preheader}
                    </p>
                    <div className="mt-4 border-t border-outline-variant/40 pt-4">
                      <EmailBody body={draft.body} />
                    </div>

                    <div className="mt-5 overflow-hidden rounded-card border border-outline-variant/30 bg-surface-container-low">
                      <img
                        src={data.featuredLot.image}
                        alt={data.featuredLot.imageAlt}
                        width={512}
                        height={260}
                        loading="lazy"
                        className="h-32 w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="font-label-sm text-[9px] tracking-wider text-secondary uppercase">
                          {data.featuredLot.title}
                        </p>
                        <p className="mt-0.5 font-label-lg text-label-lg font-bold text-primary">
                          {data.featuredLot.lot}
                        </p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">
                          {data.featuredLot.origin}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {data.featuredLot.notes.map((note) => (
                            <span
                              key={note}
                              className="rounded-full border border-outline-variant/50 px-2 py-0.5 font-label-sm text-[8px] text-on-surface-variant uppercase"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-card bg-secondary-fixed p-3">
                      <p className="font-label-sm text-[9px] tracking-wider text-on-secondary-fixed uppercase">
                        {data.featuredLot.ratioTitle}
                      </p>
                      <p className="mt-1 font-body-sm text-[11px] leading-relaxed text-on-secondary-fixed">
                        {data.featuredLot.ratio}
                      </p>
                    </div>

                    <div className="mt-4 rounded-card border border-outline-variant/40 p-3">
                      <p className="font-label-lg text-label-lg font-bold text-primary">
                        {data.featuredLot.eventTitle}
                      </p>
                      <p className="mt-0.5 font-body-sm text-[11px] text-on-surface-variant">
                        {data.featuredLot.eventTime}
                      </p>
                      <span className="mt-2 inline-flex rounded-full bg-primary-container px-3 py-1 font-label-sm text-[9px] tracking-wider text-surface-bright uppercase">
                        Reserve RSVP Seat
                      </span>
                    </div>

                    <p className="mt-4 text-center font-body-sm text-[9px] leading-relaxed text-on-surface-variant">
                      {data.featuredLot.atelier}
                      <br />
                      You received this parchment because you are part of our slow roasting ledger.
                      Unsubscribe
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <AcquisitionSection overview={data.overview} />

          <section className="mt-5 rounded-card bg-surface-container-lowest shadow-soft">
            <div className="flex flex-col gap-3 border-b border-outline-variant/25 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary">
                  Previous Parchment Dispatches
                </h2>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Archive rows copied from the supplied newsletter mockup.
                </p>
              </div>
              <Badge variant="neutral">
                <Archive className="h-3 w-3" aria-hidden="true" />
                {data.overview.dispatches.length} supplied issues
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left">
                <caption className="sr-only">Previous Chronicle dispatches</caption>
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container-low/60">
                    {['Issue', 'Dispatch', 'Sent', 'Recipients', 'Opens', 'Clicks', 'Actions'].map(
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
                  {data.overview.dispatches.map((dispatch) => (
                    <tr key={dispatch.id} className="border-b border-outline-variant/20 last:border-0">
                      <td className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant">
                        {dispatch.issue}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-label-md text-label-md font-bold text-primary">
                          {dispatch.title}
                        </p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">
                          {dispatch.date}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                        {dispatch.recipients}
                      </td>
                      <td className="px-4 py-3 font-label-md text-label-md text-primary">
                        {dispatch.opens}
                      </td>
                      <td className="px-4 py-3 font-label-md text-label-md text-primary">
                        {dispatch.clicks}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateDispatch(dispatch)}
                          title="The archive mockup does not include body copy"
                        >
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          Duplicate Draft
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}

function NewsletterStats({ overview }: { overview: NewsletterOverview }) {
  const stats = overview.stats
  const cards = [
    {
      label: 'Circulation Circle',
      value: stats.subscribers,
      note: 'patrons',
      footnote: `${stats.growth} this harvest lunar`,
      icon: Users,
      tone: 'warm' as const,
    },
    {
      label: 'Avg. Hearth Open Rate',
      value: stats.openRate,
      note: stats.openIndustry,
      footnote: stats.weeklyGrowth,
      icon: MailOpen,
      tone: 'neutral' as const,
    },
    {
      label: 'Click-Through Engagement',
      value: stats.clickRate,
      note: 'micro-lot RSVPs',
      footnote: stats.clickFootnote,
      icon: MousePointerClick,
      tone: 'cream' as const,
    },
    {
      label: 'Unsubscribe Churn',
      value: stats.churn,
      note: stats.churnNote,
      footnote: stats.churnDetail,
      icon: UserMinus,
      tone: 'green' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="rounded-card bg-surface-container-lowest p-4 shadow-soft">
            <span
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full',
                statTone[card.tone],
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="mt-3 font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              {card.label}
            </p>
            <p className="mt-0.5 font-headline-sm text-headline-sm font-bold text-primary">
              {card.value}
            </p>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{card.note}</p>
            <p className="mt-2 border-t border-outline-variant/25 pt-2 font-body-sm text-[11px] text-on-surface-variant">
              {card.footnote}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function AcquisitionSection({ overview }: { overview: NewsletterOverview }) {
  const maxTotal = Math.max(
    ...overview.acquisition.map((week) => Number.parseInt(week.total, 10) || 0),
    1,
  )

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
      <section className="rounded-card bg-surface-container-lowest p-5 shadow-soft xl:col-span-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ChartSpline className="h-4 w-4 text-secondary" aria-hidden="true" />
              <h2 className="font-headline-sm text-headline-sm text-primary">Acquisition Pulse</h2>
            </div>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              Subscriber inflow and cohort sources, week over week.
            </p>
          </div>
          <Badge variant="warm">Current week {overview.acquisition.at(-1)?.total}</Badge>
        </div>

        <div className="mt-6 grid h-64 grid-cols-7 items-end gap-2">
          {overview.acquisition.map((week) => {
            const total = Number.parseInt(week.total, 10) || 0
            const totalHeight = Math.max(10, Math.round((total / maxTotal) * 100))
            return (
              <div key={week.label} className="flex h-full min-w-0 flex-col justify-end gap-1">
                <span className="text-center font-label-sm text-[9px] text-on-surface-variant">
                  {week.total}
                </span>
                <div
                  className="relative w-full overflow-hidden rounded-t-card bg-surface-container"
                  style={{ height: `${totalHeight}%` }}
                  title={`${week.label}: ${week.total} new subscribers`}
                >
                  {week.segments.map((segment, index) => {
                    const bottom = week.segments
                      .slice(0, index)
                      .reduce((sum, entry) => sum + entry.value, 0)
                    return (
                      <div
                        key={`${week.label}-${segment.source}`}
                        className={cn('absolute inset-x-0', segmentTone[segment.tone])}
                        style={{ height: `${segment.value}%`, bottom: `${bottom}%` }}
                        title={`${segment.source}: ${segment.value}%`}
                      />
                    )
                  })}
                </div>
                <span className="truncate text-center font-label-sm text-[9px] tracking-wide text-on-surface-variant uppercase">
                  {week.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-outline-variant/25 pt-4">
          {overview.acquisition[0]?.segments.map((segment) => (
            <span key={segment.source} className="flex items-center gap-1.5">
              <span
                className={cn('h-2.5 w-2.5 rounded-full', segmentTone[segment.tone])}
                aria-hidden="true"
              />
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {segment.source}
              </span>
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 xl:col-span-5">
        <div className="rounded-card bg-surface-container-lowest p-5 shadow-soft">
          <h2 className="font-headline-sm text-headline-sm text-primary">Cohort Sources</h2>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Where the current subscriber circle arrived from.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {overview.sources.map((source) => (
              <div
                key={source.label}
                className="flex items-center justify-between gap-3 rounded-card bg-surface-container-low p-3"
              >
                <div>
                  <p className="font-label-md text-label-md text-primary">{source.label}</p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant">{source.note}</p>
                </div>
                <span className="font-headline-sm text-headline-sm font-bold text-secondary">
                  {source.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card bg-surface-container-lowest p-5 shadow-soft">
          <h2 className="font-headline-sm text-headline-sm text-primary">Reader Retention Quality</h2>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Loyalty archetypes segmented by consecutive chronicle reads.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {overview.archetypes.map((archetype) => {
              const match = archetype.percent.match(/\((\d+)%\)/)
              const percent = match ? Number(match[1]) : 0
              return (
                <div key={archetype.label}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-label-md text-label-md text-primary">{archetype.label}</p>
                    <span className="font-label-sm text-label-sm font-bold text-secondary">
                      {archetype.percent}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        archetype.tone === 'warm'
                          ? 'bg-secondary'
                          : archetype.tone === 'dark'
                            ? 'bg-primary-container'
                            : 'bg-[#e3bfb2]',
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-1 font-body-sm text-[11px] text-on-surface-variant">
                    {archetype.note}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

function NewsletterField({
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

function EmailBody({ body }: { body: string }) {
  const lines = body.split('\n')
  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, index) => {
        const trimmed = line.trim()
        if (trimmed.length === 0) return null
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={`${index}-${trimmed}`}
              className="mt-2 font-display-lg text-[18px] leading-tight text-primary"
            >
              {trimmed.slice(4)}
            </h4>
          )
        }
        if (trimmed.startsWith('* ')) {
          return (
            <p key={`${index}-${trimmed}`} className="flex gap-2 font-body-sm text-[12px] leading-relaxed text-on-surface-variant">
              <span className="text-secondary" aria-hidden="true">
                •
              </span>
              <span>{trimmed.slice(2)}</span>
            </p>
          )
        }
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <p
              key={`${index}-${trimmed}`}
              className="pl-3 font-body-sm text-[12px] leading-relaxed text-on-surface-variant"
            >
              {trimmed}
            </p>
          )
        }
        return (
          <p
            key={`${index}-${trimmed}`}
            className="font-body-sm text-[12px] leading-relaxed text-on-surface-variant"
          >
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}
