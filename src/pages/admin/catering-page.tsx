import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CircleCheck,
  Coffee,
  Flame,
  Leaf,
  Mail,
  MapPin,
  ReceiptText,
  Search,
  Star,
  Truck,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/admin/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { StatusPill } from '@/components/ui/status-pill'
import { useToast } from '@/components/ui/toast'
import { approveBooking, getCatering, queryKeys } from '@/mocks/api'
import type { Booking, BookingStatus, CateringKpi } from '@/mocks/schema'
import { cn } from '@/lib/utils'

const kpiIcons = [ReceiptText, CircleCheck, CalendarDays, Star, Users] as const

const kpiTone = {
  warm: 'bg-secondary-fixed text-on-secondary-fixed',
  dark: 'bg-primary-container text-primary-fixed',
  neutral: 'bg-surface-container text-primary',
  cream: 'bg-[#fff1e3] text-[#733600]',
  green: 'bg-[#dcead7] text-[#244a1f]',
} as const

const bookingTone: Record<BookingStatus, 'paid' | 'deposit' | 'pending' | 'approved'> = {
  paid: 'paid',
  deposit: 'deposit',
  pending: 'pending',
  approved: 'approved',
}

const serviceActions: Record<string, string> = {
  'bespoke-catering': 'Inspect Run Sheet',
  'subscription-roasts': 'Batch Roster',
  'sensory-guild': 'Manage Cohorts',
}

const workstationIcons = {
  roaster: Flame,
  'station-a': Coffee,
  'mobile-cart': Truck,
} as const

type BookingFilter = 'all' | BookingStatus

export function CateringPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingFilter>('all')

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.catering,
    queryFn: getCatering,
  })

  const approveMutation = useMutation({
    mutationFn: approveBooking,
    onSuccess: (booking) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.catering })
      toast({
        title: `${booking.client} approved`,
        description: 'The mock booking now reads Approved. No calendar or email was contacted.',
        tone: 'success',
      })
    },
    onError: () => {
      toast({ title: 'Could not approve the booking', description: 'Try again.', tone: 'error' })
    },
  })

  const bookings = data?.bookings ?? []

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase()
    return bookings.filter((booking) => {
      const statusMatch = statusFilter === 'all' || booking.status === statusFilter
      const queryMatch =
        query.length === 0 ||
        [booking.client, booking.email, booking.type, booking.venue, booking.leadBarista]
          .join(' ')
          .toLowerCase()
          .includes(query)
      return statusMatch && queryMatch
    })
  }, [bookings, search, statusFilter])

  const placeholder = (title: string, description: string) => {
    toast({ title, description })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Private services"
        title="Catering & Workshops"
        description="Registry ledger for private services, external bars, cupping seats, and the kiln equipment that carries them."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                placeholder(
                  'Enquiry export',
                  'Exporting the enquiry ledger is not designed in this prototype.',
                )
              }
            >
              Export ledger
            </Button>
            <Button
              onClick={() =>
                placeholder(
                  'Bespoke session reservation',
                  'A booking and deposit flow is not designed in this prototype.',
                )
              }
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Reserve Bespoke Session
            </Button>
          </>
        }
      />

      {isError ? (
        <div role="alert" className="mb-5 rounded-card bg-error-container p-5 text-on-error-container">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-label-lg text-label-lg">The catering fixture could not be loaded.</p>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-card bg-surface-container-lowest" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-card bg-surface-container-lowest" />
          <div className="h-96 animate-pulse rounded-card bg-surface-container-lowest" />
        </div>
      ) : null}

      {data ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {data.kpis.map((kpi, index) => (
              <KpiCard key={kpi.label} kpi={kpi} index={index} />
            ))}
          </div>

          <section className="mt-5">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary">
                  Service Offerings & Pillar Diagnostics
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Active catalog updated daily per batch roasting output.
                </p>
              </div>
              <Badge variant="success">Active Catalog</Badge>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {data.services.map((service) => (
                <article
                  key={service.id}
                  className="flex flex-col overflow-hidden rounded-card bg-surface-container-lowest shadow-soft"
                >
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    width={512}
                    height={260}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <Badge variant="warm" className="self-start">
                      {service.category}
                    </Badge>
                    <h3 className="mt-2 font-headline-sm text-headline-sm text-primary">
                      {service.title}
                    </h3>
                    <p className="mt-1 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                      {service.description}
                    </p>
                    <div className="mt-4 flex flex-col gap-2 border-t border-outline-variant/25 pt-3">
                      {service.stats.map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between gap-3">
                          <span className="font-body-sm text-[11px] text-on-surface-variant">
                            {stat.label}
                          </span>
                          <span
                            className={cn(
                              'text-right font-label-sm text-label-sm font-bold',
                              stat.tone === 'warm'
                                ? 'text-secondary'
                                : stat.tone === 'dark'
                                  ? 'text-primary'
                                  : 'text-on-surface',
                            )}
                          >
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-outline-variant/25 pt-4">
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          {service.footerLabel}
                        </p>
                        <p className="font-headline-sm text-headline-sm text-primary">
                          {service.footerValue}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          placeholder(
                            serviceActions[service.id] ?? 'Service detail',
                            'The detailed service run sheet is not designed in this prototype.',
                          )
                        }
                      >
                        {serviceActions[service.id] ?? 'View Detail'}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-card bg-surface-container-lowest shadow-soft">
            <div className="flex flex-col gap-3 border-b border-outline-variant/25 p-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary">
                  Upcoming Bookings & Inquiries
                </h2>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Registry ledger for private services, external bars, and cupping seats.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                    aria-hidden="true"
                  />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search client or service…"
                    aria-label="Search catering bookings"
                    className="pl-9 sm:w-64"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as BookingFilter)}
                  aria-label="Filter bookings by status"
                  className="sm:w-40"
                >
                  <option value="all">All statuses</option>
                  <option value="paid">Paid in full</option>
                  <option value="deposit">Deposit received</option>
                  <option value="pending">Pending review</option>
                  <option value="approved">Approved</option>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] border-collapse text-left">
                <caption className="sr-only">Upcoming catering bookings and inquiries</caption>
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container-low/60">
                    {[
                      'Client Name',
                      'Event & Service Type',
                      'Date & Time',
                      'Guests',
                      'Venue Location',
                      'Deposit Status',
                      'Lead Barista',
                      'Actions',
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-4 py-2.5 font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      approving={approveMutation.isPending}
                      onApprove={() => approveMutation.mutate(booking.id)}
                      onPlaceholder={placeholder}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="px-4 py-14 text-center">
                <Search className="mx-auto h-7 w-7 text-outline" aria-hidden="true" />
                <h3 className="mt-2 font-headline-sm text-headline-sm text-primary">
                  No bookings match that search
                </h3>
                <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                  Clear the search or status filter to return to the supplied records.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('all')
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : null}

            <div className="flex flex-col gap-2 border-t border-outline-variant/25 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Showing {filteredBookings.length} supplied{' '}
                {filteredBookings.length === 1 ? 'record' : 'records'} of 9 scheduled encounters.
              </p>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Five records were not supplied and have not been invented.
              </p>
            </div>
          </section>

          <section className="mt-5 rounded-card bg-surface-container-lowest p-5 shadow-soft">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary">Hearth Workstations</h2>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Week 21 · Roaster equipment availability & station reservation matrix.
                </p>
              </div>
              <Badge variant="neutral">3 stations</Badge>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {data.workstations.map((workstation) => {
                const Icon = workstationIcons[workstation.id as keyof typeof workstationIcons] ?? Flame
                return (
                  <div
                    key={workstation.id}
                    className="rounded-card border border-outline-variant/30 bg-surface-container-low p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="font-label-lg text-label-lg font-bold text-primary">
                            {workstation.name}
                          </h3>
                          <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 font-body-sm text-[11px] text-on-surface-variant">
                            {workstation.rows.map((row) => (
                              <span key={row.label}>
                                <strong className="font-semibold text-on-surface">{row.label}:</strong>{' '}
                                {row.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          workstation.statusTone === 'ready'
                            ? 'success'
                            : workstation.statusTone === 'setup'
                              ? 'warm'
                              : 'neutral'
                        }
                      >
                        {workstation.status}
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
                      {workstation.week.map((day) => (
                        <div
                          key={day.day}
                          className={cn(
                            'rounded-card px-1 py-2 text-center',
                            day.tone === 'high'
                              ? 'bg-primary-container text-surface-bright'
                              : day.tone === 'mid'
                                ? 'bg-secondary-fixed text-on-secondary-fixed'
                                : 'bg-surface-container text-on-surface-variant',
                          )}
                        >
                          <div className="font-label-sm text-[9px] tracking-wider uppercase">{day.day}</div>
                          <div className="mt-0.5 font-label-md text-label-md font-bold">{day.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex flex-col gap-3 rounded-card bg-surface-container p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-label-lg text-label-lg text-primary">Need a custom roaster blockout?</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Reserve hearth equipment for experimental runs.
                </p>
              </div>
              <Button
                variant="dark"
                size="sm"
                onClick={() =>
                  placeholder(
                    'Rig reservation',
                    'A hearth equipment booking flow is not designed in this prototype.',
                  )
                }
              >
                Book Rig
              </Button>
            </div>
          </section>

          <section className="mt-5 rounded-card bg-[#244a1f] p-5 text-[#f4f8ef] shadow-soft sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12 text-[#dcead7]">
                  <Leaf className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm">{data.sustainability.title}</h2>
                  <p className="mt-1 max-w-2xl font-body-sm text-body-sm leading-relaxed text-[#d3e3c9]">
                    {data.sustainability.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <span className="rounded-full bg-white/12 px-3 py-1.5 font-label-md text-label-md text-[#e4efdc]">
                  {data.sustainability.value}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  onClick={() =>
                    placeholder(
                      'Waste metrics',
                      'A waste-metrics dashboard is not designed in this prototype.',
                    )
                  }
                >
                  {data.sustainability.action}
                </Button>
              </div>
            </div>
          </section>

          <p className="mt-4 text-center font-body-sm text-[11px] text-on-surface-variant">
            All KPIs, bookings, and workshop counts are sample fixtures from the supplied admin mockup.
          </p>
        </>
      ) : null}
    </div>
  )
}

function KpiCard({ kpi, index }: { kpi: CateringKpi; index: number }) {
  const Icon = kpiIcons[index] ?? ReceiptText
  return (
    <div className="rounded-card bg-surface-container-lowest p-4 shadow-soft">
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full',
          kpiTone[kpi.tone],
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mt-3 font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
        {kpi.label}
      </p>
      <p className="mt-0.5 font-headline-sm text-headline-sm font-bold text-primary">{kpi.value}</p>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{kpi.note}</p>
    </div>
  )
}

function BookingRow({
  booking,
  approving,
  onApprove,
  onPlaceholder,
}: {
  booking: Booking
  approving: boolean
  onApprove: () => void
  onPlaceholder: (title: string, description: string) => void
}) {
  const canApprove = booking.status === 'pending' || booking.status === 'deposit'
  return (
    <tr className="border-b border-outline-variant/20 last:border-0">
      <td className="px-4 py-3">
        <p className="font-label-md text-label-md font-bold text-primary">{booking.client}</p>
        <p className="font-body-sm text-[11px] text-on-surface-variant">{booking.email}</p>
      </td>
      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface">{booking.type}</td>
      <td className="px-4 py-3">
        <p className="font-label-md text-label-md text-primary">{booking.date}</p>
        <p className="font-body-sm text-[11px] text-on-surface-variant">{booking.time}</p>
      </td>
      <td className="px-4 py-3 font-label-md text-label-md text-primary">{booking.guests}</td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface">
          <MapPin className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
          {booking.venue}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusPill tone={bookingTone[booking.status]}>{booking.depositStatus}</StatusPill>
      </td>
      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface">{booking.leadBarista}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Email ${booking.client}`}
            title="Email is not designed in this prototype"
            onClick={() =>
              onPlaceholder(
                'Booking email',
                'Sending email is not designed in this prototype.',
              )
            }
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Reschedule ${booking.client}`}
            title="Rescheduling is not designed in this prototype"
            onClick={() =>
              onPlaceholder(
                'Booking reschedule',
                'A calendar and reschedule flow is not designed in this prototype.',
              )
            }
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
          </Button>
          {canApprove ? (
            <Button
              variant="outline"
              size="sm"
              disabled={approving}
              onClick={onApprove}
              aria-label={`Approve ${booking.client}`}
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Approve
            </Button>
          ) : (
            <Button
              variant="soft"
              size="sm"
              onClick={() =>
                onPlaceholder(
                  'Booking run sheet',
                  'The detailed booking run sheet is not designed in this prototype.',
                )
              }
            >
              Run Sheet
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}
