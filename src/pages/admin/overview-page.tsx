import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowUpRight,
  ChartSpline,
  Coins,
  Flame,
  Leaf,
  ReceiptText,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { HearthChart } from '@/components/admin/hearth-chart'
import { PageHeader } from '@/components/admin/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { StatusPill, type StatusTone } from '@/components/ui/status-pill'
import { useToast } from '@/components/ui/toast'
import { getOverview, queryKeys } from '@/mocks/api'
import type { Kpi } from '@/mocks/schema'
import { formatCurrency } from '@/lib/utils'

const kpiIcon = {
  receipt: ReceiptText,
  coins: Coins,
  chart: ChartSpline,
  flame: Flame,
  leaf: Leaf,
} as const

const kpiTone = {
  warm: 'bg-secondary-fixed text-on-secondary-fixed',
  cool: 'bg-[#dbe8f6] text-[#1d3e63]',
  neutral: 'bg-surface-container text-primary',
  dark: 'bg-primary-container text-primary-fixed',
  green: 'bg-[#dcead7] text-[#244a1f]',
} as const

const orderTone: Record<string, StatusTone> = {
  Brewing: 'pending',
  Poured: 'deposit',
  Completed: 'paid',
}

type SortKey = 'volume' | 'revenue' | 'margin'

export function OverviewPage() {
  const { toast } = useToast()
  const [chartTab, setChartTab] = useState('today')
  const [sortKey, setSortKey] = useState<SortKey>('volume')

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.overview,
    queryFn: getOverview,
  })

  const chart = data?.chartSeries.find((series) => series.id === chartTab) ?? data?.chartSeries[0]

  const sortedBrews = useMemo(() => {
    const brews = [...(data?.topBrews ?? [])]
    return brews.sort((a, b) => {
      if (sortKey === 'margin') {
        return Number.parseFloat(b.margin) - Number.parseFloat(a.margin)
      }
      if (sortKey === 'revenue') {
        return (
          Number.parseFloat(b.revenue.replace(/[$,]/g, '')) -
          Number.parseFloat(a.revenue.replace(/[$,]/g, ''))
        )
      }
      return Number.parseInt(b.units, 10) - Number.parseInt(a.units, 10)
    })
  }, [data?.topBrews, sortKey])

  const placeholder = (title: string, description: string) => {
    toast({ title, description, tone: 'default' })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Atelier operations · Tuesday"
        title="Overview & Sales Pulse"
        description="A live-feeling snapshot of the hearth: extraction velocity, top brews, vessel health, and the next roast run."
        actions={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => placeholder('Pulse export', 'Exporting a CSV is not designed in this prototype.')}
            >
              Export pulse
            </Button>
            <Button asChild variant="dark" size="md">
              <Link to="/admin/newsletter">
                Draft Chronicle #42
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </>
        }
      />

      {isError ? (
        <div role="alert" className="mb-6 rounded-card bg-error-container p-5 text-on-error-container">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-label-lg text-label-lg">The overview fixture could not be loaded.</p>
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

      {isPending ? <OverviewSkeleton /> : null}

      {data ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {data.kpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <section className="rounded-card bg-surface-container-lowest p-4 shadow-soft sm:p-6 xl:col-span-8">
              <div className="mb-4 flex flex-wrap gap-1 rounded-full bg-surface-container p-1">
                {data.chartSeries.map((series) => (
                  <button
                    key={series.id}
                    type="button"
                    onClick={() => setChartTab(series.id)}
                    aria-pressed={chartTab === series.id}
                    className={
                      chartTab === series.id
                        ? 'cursor-pointer rounded-full bg-surface-container-lowest px-3 py-1.5 font-label-md text-label-md font-bold text-primary shadow-sm'
                        : 'cursor-pointer rounded-full px-3 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary'
                    }
                  >
                    {series.label}
                  </button>
                ))}
              </div>
              {chart ? <HearthChart series={chart} metrics={data.metrics} /> : null}
            </section>

            <div className="flex flex-col gap-5 xl:col-span-4">
              <section className="rounded-card bg-surface-container-lowest p-5 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                      <Flame className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-primary">{data.station.name}</h2>
                      <p className="font-label-sm text-label-sm tracking-wider text-secondary uppercase">
                        {data.station.temperature}
                      </p>
                    </div>
                  </div>
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-secondary" aria-hidden="true" />
                </div>
                <p className="mt-4 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                  {data.station.description}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-secondary"
                    style={{ width: `${data.station.progress}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Next sand raking: <strong className="text-primary">{data.station.nextRake}</strong>
                  </span>
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() =>
                      placeholder('Station log', 'Station history is not designed in this prototype.')
                    }
                  >
                    Station log
                  </Button>
                </div>
              </section>

              <section className="rounded-card bg-surface-container-lowest p-5 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary">Clay Vessel Health</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Atelier handmade cookware ceramics
                    </p>
                  </div>
                  <span className="rounded-full bg-surface-container px-2.5 py-1 font-label-sm text-label-sm text-on-surface-variant">
                    {data.vessels.length} lots
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  {data.vessels.map((vessel) => (
                    <div key={vessel.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-label-lg text-label-lg text-primary">
                            {vessel.id} · {vessel.name}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{vessel.detail}</p>
                        </div>
                        <span
                          className={
                            vessel.tone === 'error'
                              ? 'font-label-sm text-label-sm font-bold text-error'
                              : 'font-label-sm text-label-sm font-bold text-secondary'
                          }
                        >
                          {vessel.remainingLabel}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container">
                        <div
                          className={
                            vessel.tone === 'error'
                              ? 'h-full rounded-full bg-error'
                              : vessel.tone === 'resting'
                                ? 'h-full rounded-full bg-primary-container'
                                : 'h-full rounded-full bg-secondary'
                          }
                          style={{ width: `${vessel.remaining}%` }}
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
                      'Kiln restock',
                      'Purchasing and inventory restock are not designed in this prototype.',
                    )
                  }
                >
                  Order Kiln Restock
                </Button>
              </section>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <section className="rounded-card bg-surface-container-lowest p-4 shadow-soft sm:p-6 xl:col-span-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">
                    Top Performing Brews & Hearth Pairings
                  </h2>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    Ranked by volume extracted today, gross margins, and bean varietals consumed.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="brew-sort" className="font-label-sm text-label-sm text-on-surface-variant">
                    Sort by
                  </label>
                  <Select
                    id="brew-sort"
                    value={sortKey}
                    onChange={(event) => setSortKey(event.target.value as SortKey)}
                    className="h-9 min-w-44 text-label-sm"
                  >
                    <option value="volume">Gross Volume (Units)</option>
                    <option value="revenue">Total Revenue ($)</option>
                    <option value="margin">Highest Margin (%)</option>
                  </Select>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <caption className="sr-only">Top performing brews today</caption>
                  <thead>
                    <tr className="border-b border-outline-variant/30">
                      {['Brew & Signature Pairing', 'Origin Lot', 'Price / Unit', 'Pots Sold', 'Margin', 'Inventory Burn', 'Day Revenue'].map(
                        (heading) => (
                          <th
                            key={heading}
                            scope="col"
                            className="px-2 py-2 font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase"
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBrews.map((brew, index) => (
                      <tr key={brew.id} className="border-b border-outline-variant/20 last:border-0">
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container font-label-sm text-label-sm font-bold text-secondary">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <p className="font-label-lg text-label-lg text-primary">{brew.name}</p>
                              <p className="font-body-sm text-[11px] text-on-surface-variant">
                                {brew.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3 font-body-sm text-body-sm text-on-surface-variant">
                          {brew.origin}
                        </td>
                        <td className="px-2 py-3 font-label-md text-label-md font-bold text-primary">
                          {formatCurrency(brew.price)}
                        </td>
                        <td className="px-2 py-3 font-label-md text-label-md text-primary">{brew.units}</td>
                        <td className="px-2 py-3 font-label-md text-label-md text-primary">{brew.margin}</td>
                        <td className="px-2 py-3 font-body-sm text-body-sm text-on-surface-variant">
                          {brew.inventory}
                        </td>
                        <td className="px-2 py-3 font-label-md text-label-md font-bold text-primary">
                          {brew.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-card bg-surface-container-lowest p-4 shadow-soft sm:p-6 xl:col-span-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-70" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      Recent Orders & Hearth Tab Stream
                    </h2>
                  </div>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    Showing the latest {data.orders.length} atelier tickets
                  </p>
                </div>
                <Badge variant="neutral">Live synced</Badge>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {data.orders.map((order) => (
                  <div key={order.id} className="rounded-card bg-surface-container-low p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-headline-sm text-headline-sm font-bold text-primary">
                          {order.id}
                        </span>
                        <span className="ml-2 font-body-sm text-[11px] text-on-surface-variant">
                          {order.time}
                        </span>
                      </div>
                      <StatusPill tone={orderTone[order.status] ?? 'neutral'}>{order.status}</StatusPill>
                    </div>
                    <div className="mt-1 flex flex-col gap-0.5">
                      {order.items.map((item) => (
                        <span key={item} className="font-label-md text-label-md text-on-surface">
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 font-body-sm text-[11px] text-on-surface-variant">{order.guestNote}</p>
                    <div className="mt-2 flex items-center justify-between gap-2 border-t border-outline-variant/25 pt-2">
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        {order.payment === 'prepaid' ? 'Prepaid' : 'Hearth tab'}
                      </span>
                      <span className="font-label-lg text-label-lg font-bold text-primary">
                        {formatCurrency(order.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="soft"
                size="sm"
                className="mt-3 w-full"
                onClick={() =>
                  placeholder(
                    'Transaction ledger',
                    'The full transaction ledger is not designed in this prototype.',
                  )
                }
              >
                View all 184 transactions
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </section>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <section className="rounded-card bg-surface-container-lowest p-4 shadow-soft sm:p-6 xl:col-span-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-label-sm text-label-sm tracking-wider text-secondary uppercase">
                    Micro-Lot Showcase
                  </p>
                  <h2 className="mt-1 font-headline-sm text-headline-sm text-primary">{data.microLot.title}</h2>
                </div>
                <Badge variant="warm">{data.microLot.price}</Badge>
              </div>
              <div className="mt-4 overflow-hidden rounded-card">
                <img
                  src={data.microLot.image}
                  alt={data.microLot.imageAlt}
                  width={512}
                  height={279}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
              </div>
              <p className="mt-3 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                {data.microLot.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.microLot.notes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-outline-variant/50 px-2.5 py-1 font-label-sm text-label-sm text-on-surface-variant"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-card bg-primary-container p-4 text-surface-bright shadow-soft sm:p-6 xl:col-span-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-label-sm text-label-sm tracking-wider text-secondary-fixed uppercase">
                    {data.roastRun.batch} · Cooling Bin
                  </p>
                  <h2 className="mt-1 font-headline-sm text-headline-sm text-surface-bright">
                    {data.roastRun.origin}
                  </h2>
                  <p className="mt-2 max-w-lg font-body-sm text-body-sm leading-relaxed text-outline-variant">
                    {data.roastRun.note}
                  </p>
                </div>
                <Badge variant="dark">{data.roastRun.progress}% cooled</Badge>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-secondary-container"
                  style={{ width: `${data.roastRun.progress}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                {[
                  { label: 'First Crack', value: data.roastRun.elapsed },
                  { label: 'Temperature', value: data.roastRun.temp },
                  { label: 'Development', value: data.roastRun.profile },
                  { label: 'Batch Yield', value: data.roastRun.yield },
                ].map((item) => (
                  <div key={item.label} className="rounded-card bg-tertiary-container/70 p-3">
                    <div className="font-label-sm text-label-sm text-surface-variant uppercase">{item.label}</div>
                    <div className="mt-1 font-label-lg text-label-lg font-bold text-secondary-container">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="cream"
                  size="sm"
                  onClick={() =>
                    placeholder(
                      'Cupping sheet approval',
                      'A cupping-sheet approval flow is not designed in this prototype.',
                    )
                  }
                >
                  Approve Cupping Sheet
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/25 text-surface-bright hover:bg-white/10 hover:text-surface-bright"
                  onClick={() => placeholder('Roast log', 'The roast log is not designed in this prototype.')}
                >
                  Roast Log
                </Button>
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  )
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpiIcon[kpi.icon]
  return (
    <div className="rounded-card bg-surface-container-lowest p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${kpiTone[kpi.tone]}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        {kpi.progress ? (
          <span className="font-label-sm text-label-sm text-on-surface-variant">{kpi.progress}%</span>
        ) : null}
      </div>
      <p className="mt-3 font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
        {kpi.label}
      </p>
      <p className="mt-0.5 font-headline-sm text-headline-sm font-bold text-primary">{kpi.value}</p>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{kpi.detail}</p>
      <p className="mt-2 border-t border-outline-variant/25 pt-2 font-body-sm text-[11px] text-on-surface-variant">
        {kpi.footnote}
      </p>
      {kpi.progress ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container">
          <div className="h-full rounded-full bg-secondary" style={{ width: `${kpi.progress}%` }} />
        </div>
      ) : null}
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-44 animate-pulse rounded-card bg-surface-container-lowest" />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="h-96 animate-pulse rounded-card bg-surface-container-lowest xl:col-span-8" />
        <div className="h-96 animate-pulse rounded-card bg-surface-container-lowest xl:col-span-4" />
      </div>
    </div>
  )
}
