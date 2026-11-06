import { z } from 'zod'

export const menuCategorySlugs = ['espresso', 'milk', 'filter', 'cultural', 'cold'] as const
export const menuCategorySlugSchema = z.enum(menuCategorySlugs)
export type MenuCategorySlug = z.infer<typeof menuCategorySlugSchema>

export const menuStatusSchema = z.enum(['live', 'draft', 'sold_out'])
export type MenuStatus = z.infer<typeof menuStatusSchema>

export const menuCategoryMetaSchema = z.object({
  slug: menuCategorySlugSchema,
  label: z.string(),
  shortLabel: z.string(),
  description: z.string(),
  icon: z.enum(['zap', 'milk', 'filter', 'globe', 'snowflake']),
})
export type MenuCategoryMeta = z.infer<typeof menuCategoryMetaSchema>

export const menuItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  category: menuCategorySlugSchema,
  name: z.string().min(1),
  price: z.number().nonnegative(),
  badge: z.string(),
  description: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  tags: z.array(z.string()),
  size: z.string(),
  status: menuStatusSchema,
  vessel: z.string(),
  ratio: z.string(),
  origin: z.string(),
  dispensed: z.number().int().nonnegative(),
  dispensedUnit: z.string(),
  trend: z.number().int(),
  trendLabel: z.string(),
})
export type MenuItem = z.infer<typeof menuItemSchema>

export const offerStatusSchema = z.enum(['active', 'scheduled', 'expired', 'paused'])
export type OfferStatus = z.infer<typeof offerStatusSchema>

export const offerSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  badge: z.string(),
  description: z.string(),
  code: z.string(),
  discount: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  redemptions: z.number().int().nonnegative(),
  redemptionsCap: z.number().int().positive(),
  validThrough: z.string(),
  timeLabel: z.string(),
  channel: z.string(),
  metricLabel: z.string(),
  metricValue: z.string(),
  status: offerStatusSchema,
  startDate: z.string(),
  endDate: z.string(),
  totalCap: z.string(),
  perDayCap: z.string(),
  terms: z.string(),
  autoApply: z.boolean(),
})
export type Offer = z.infer<typeof offerSchema>

export const offerDraftSchema = z.object({
  title: z.string().min(2, 'Give the promotion a title.'),
  code: z
    .string()
    .min(3, 'Use at least three characters.')
    .regex(/^[A-Z0-9-]+$/, 'Use uppercase letters, numbers, or hyphens.'),
  discount: z.string().min(1, 'Describe the incentive.'),
  description: z.string().min(10, 'Add a short guest-facing description.'),
  startDate: z.string().min(1, 'Choose a start date.'),
  endDate: z.string().min(1, 'Choose an end date.'),
  totalCap: z.string().min(1, 'Set a total redemption cap.'),
  perDayCap: z.string().min(1, 'Set a per-day cap.'),
  channel: z.string().min(1, 'Choose a channel.'),
  terms: z.string().min(1, 'Add the fine print.'),
  autoApply: z.boolean(),
})
export type OfferDraft = z.infer<typeof offerDraftSchema>

export const bookingStatusSchema = z.enum(['paid', 'deposit', 'pending', 'approved'])
export type BookingStatus = z.infer<typeof bookingStatusSchema>

export const serviceOfferingSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  footerLabel: z.string(),
  footerValue: z.string(),
  stats: z.array(z.object({ label: z.string(), value: z.string(), tone: z.enum(['default', 'warm', 'dark']) })),
})
export type ServiceOffering = z.infer<typeof serviceOfferingSchema>

export const bookingSchema = z.object({
  id: z.string(),
  client: z.string(),
  email: z.string().email(),
  type: z.string(),
  date: z.string(),
  time: z.string(),
  guests: z.number().int().positive(),
  venue: z.string(),
  depositStatus: z.string(),
  leadBarista: z.string(),
  status: bookingStatusSchema,
})
export type Booking = z.infer<typeof bookingSchema>

export const workstationSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  statusTone: z.enum(['ready', 'setup', 'resting']),
  rows: z.array(z.object({ label: z.string(), value: z.string() })),
  week: z.array(z.object({ day: z.string(), value: z.string(), tone: z.enum(['high', 'mid', 'low']) })),
})
export type Workstation = z.infer<typeof workstationSchema>

export const dispatchSchema = z.object({
  id: z.string(),
  issue: z.string(),
  title: z.string(),
  date: z.string(),
  recipients: z.string(),
  opens: z.string(),
  clicks: z.string(),
})
export type Dispatch = z.infer<typeof dispatchSchema>

export const newsletterDraftSchema = z.object({
  issueTitle: z.string().min(1),
  subject: z.string().min(1),
  preheader: z.string().min(1),
  audience: z.string().min(1),
  body: z.string().min(1),
})
export type NewsletterDraft = z.infer<typeof newsletterDraftSchema>

export const kpiSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  detail: z.string(),
  footnote: z.string(),
  tone: z.enum(['warm', 'cool', 'neutral', 'dark', 'green']),
  icon: z.enum(['receipt', 'coins', 'chart', 'flame', 'leaf']),
  progress: z.number().min(0).max(100).optional(),
})
export type Kpi = z.infer<typeof kpiSchema>

export const chartPointSchema = z.object({
  label: z.string(),
  value: z.number().nonnegative(),
})
export type ChartPoint = z.infer<typeof chartPointSchema>

export const chartSeriesSchema = z.object({
  id: z.string(),
  label: z.string(),
  range: z.string(),
  points: z.array(chartPointSchema),
  peak: z.string(),
})
export type ChartSeries = z.infer<typeof chartSeriesSchema>

export const topBrewSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  units: z.string(),
  margin: z.string(),
  inventory: z.string(),
  revenue: z.string(),
  origin: z.string(),
  tone: z.enum(['dark', 'warm', 'cream']),
})
export type TopBrew = z.infer<typeof topBrewSchema>

export const orderSchema = z.object({
  id: z.string(),
  items: z.array(z.string()),
  guest: z.string(),
  guestNote: z.string(),
  amount: z.number(),
  payment: z.enum(['prepaid', 'hearth-tab']),
  status: z.string(),
  time: z.string(),
})
export type Order = z.infer<typeof orderSchema>

export const vesselSchema = z.object({
  id: z.string(),
  name: z.string(),
  detail: z.string(),
  remaining: z.number().min(0).max(100),
  remainingLabel: z.string(),
  note: z.string(),
  tone: z.enum(['warm', 'resting', 'error']),
})
export type Vessel = z.infer<typeof vesselSchema>

export const overviewSchema = z.object({
  kpis: z.array(kpiSchema),
  chartSeries: z.array(chartSeriesSchema),
  topBrews: z.array(topBrewSchema),
  orders: z.array(orderSchema),
  vessels: z.array(vesselSchema),
  station: z.object({
    name: z.string(),
    temperature: z.string(),
    description: z.string(),
    nextRake: z.string(),
    progress: z.number().min(0).max(100),
  }),
  roastRun: z.object({
    batch: z.string(),
    origin: z.string(),
    profile: z.string(),
    progress: z.number().min(0).max(100),
    elapsed: z.string(),
    temp: z.string(),
    yield: z.string(),
    note: z.string(),
  }),
  microLot: z.object({
    title: z.string(),
    origin: z.string(),
    description: z.string(),
    notes: z.array(z.string()),
    price: z.string(),
    image: z.string(),
    imageAlt: z.string(),
  }),
  metrics: z.array(z.object({ label: z.string(), value: z.string(), note: z.string() })),
})
export type Overview = z.infer<typeof overviewSchema>

export const cateringKpiSchema = z.object({
  label: z.string(),
  value: z.string(),
  note: z.string(),
  tone: z.enum(['warm', 'dark', 'neutral', 'cream', 'green']),
})
export type CateringKpi = z.infer<typeof cateringKpiSchema>

export const newsletterStatsSchema = z.object({
  subscribers: z.string(),
  openRate: z.string(),
  openIndustry: z.string(),
  clickRate: z.string(),
  clickFootnote: z.string(),
  growth: z.string(),
  weeklyGrowth: z.string(),
  churn: z.string(),
  churnNote: z.string(),
  churnDetail: z.string(),
})
export type NewsletterStats = z.infer<typeof newsletterStatsSchema>

export const newsletterOverviewSchema = z.object({
  stats: newsletterStatsSchema,
  acquisition: z.array(
    z.object({
      label: z.string(),
      total: z.string(),
      segments: z.array(z.object({ source: z.string(), value: z.number().min(0).max(100), tone: z.enum(['warm', 'dark', 'cream']) })),
    }),
  ),
  sources: z.array(z.object({ label: z.string(), value: z.string(), note: z.string(), tone: z.enum(['warm', 'cream', 'dark']) })),
  archetypes: z.array(z.object({ label: z.string(), percent: z.string(), note: z.string(), tone: z.enum(['warm', 'cream', 'dark']) })),
  dispatches: z.array(dispatchSchema),
})
export type NewsletterOverview = z.infer<typeof newsletterOverviewSchema>
