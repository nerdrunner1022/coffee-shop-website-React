import { z } from 'zod'

import {
  dispatchSchema,
  newsletterDraftSchema,
  newsletterOverviewSchema,
  type NewsletterDraft,
  type NewsletterOverview,
} from './schema'

export const newsletterOverview: NewsletterOverview = newsletterOverviewSchema.parse({
  stats: {
    subscribers: '2,840',
    openRate: '68.4%',
    openIndustry: 'industry 22%',
    clickRate: '24.1%',
    clickFootnote: '685 direct cupping reads',
    growth: '+142',
    weeklyGrowth: '+3.8% over 90 days',
    churn: '0.2%',
    churnNote: 'historical low',
    churnDetail: 'High parchment affinity',
  },
  acquisition: [
    {
      label: 'Wk 38',
      total: '118',
      segments: [
        { source: 'Café QR', value: 55, tone: 'warm' },
        { source: 'Website Footer', value: 30, tone: 'dark' },
        { source: 'Cupping Circles', value: 15, tone: 'cream' },
      ],
    },
    {
      label: 'Wk 39',
      total: '132',
      segments: [
        { source: 'Café QR', value: 52, tone: 'warm' },
        { source: 'Website Footer', value: 32, tone: 'dark' },
        { source: 'Cupping Circles', value: 16, tone: 'cream' },
      ],
    },
    {
      label: 'Wk 40',
      total: '141',
      segments: [
        { source: 'Café QR', value: 50, tone: 'warm' },
        { source: 'Website Footer', value: 33, tone: 'dark' },
        { source: 'Cupping Circles', value: 17, tone: 'cream' },
      ],
    },
    {
      label: 'Wk 41',
      total: '156',
      segments: [
        { source: 'Café QR', value: 53, tone: 'warm' },
        { source: 'Website Footer', value: 30, tone: 'dark' },
        { source: 'Cupping Circles', value: 17, tone: 'cream' },
      ],
    },
    {
      label: 'Wk 42',
      total: '163',
      segments: [
        { source: 'Café QR', value: 54, tone: 'warm' },
        { source: 'Website Footer', value: 29, tone: 'dark' },
        { source: 'Cupping Circles', value: 17, tone: 'cream' },
      ],
    },
    {
      label: 'Wk 43',
      total: '171',
      segments: [
        { source: 'Café QR', value: 52, tone: 'warm' },
        { source: 'Website Footer', value: 31, tone: 'dark' },
        { source: 'Cupping Circles', value: 17, tone: 'cream' },
      ],
    },
    {
      label: 'Current',
      total: '184',
      segments: [
        { source: 'Café QR', value: 52, tone: 'warm' },
        { source: 'Website Footer', value: 31, tone: 'dark' },
        { source: 'Cupping Circles', value: 17, tone: 'cream' },
      ],
    },
  ],
  sources: [
    { label: 'Café Bar Counters', value: '52%', note: 'Pottery coaster NFC + QR', tone: 'warm' },
    { label: 'Hearth Web Portal', value: '31%', note: 'Slow journal read opt-ins', tone: 'cream' },
    { label: 'Cupping Circles', value: '17%', note: 'Hands-on tasting classes', tone: 'dark' },
  ],
  archetypes: [
    { label: 'Devout Hearthkeepers', percent: '1,420 (50%)', note: 'Consecutive weekly readers', tone: 'warm' },
    { label: 'Weekend Browsers', percent: '940 (33%)', note: 'Seasonal openers', tone: 'cream' },
    { label: 'Occasional Morning Listeners', percent: '480 (17%)', note: 'Low-frequency readers', tone: 'dark' },
  ],
  dispatches: z.array(dispatchSchema).parse([
    {
      id: 'issue-23',
      issue: 'Issue #23',
      title: 'The Geometry of Natural Processing',
      date: 'Oct 12, 2024 • 07:30 AM',
      recipients: '2,780 patrons',
      opens: '71.2%',
      clicks: '26.8% (745 clicks)',
    },
    {
      id: 'issue-22',
      issue: 'Issue #22',
      title: 'Fire, Clay, and the First Frost',
      date: 'Sep 28, 2024 • 07:30 AM',
      recipients: '2,698 patrons',
      opens: '69.0%',
      clicks: '23.4% (631 clicks)',
    },
    {
      id: 'issue-21',
      issue: 'Issue #21',
      title: 'The Ritual of the Morning Stir',
      date: 'Sep 14, 2024 • 07:30 AM',
      recipients: '2,610 patrons',
      opens: '66.7%',
      clicks: '21.9% (572 clicks)',
    },
    {
      id: 'issue-20',
      issue: 'Issue #20',
      title: 'Fermenting in Earthen Vessels',
      date: 'Aug 31, 2024 • 07:30 AM',
      recipients: '2,544 patrons',
      opens: '67.8%',
      clicks: '25.1% (638 clicks)',
    },
  ]),
})

export const initialNewsletterDraft: NewsletterDraft = newsletterDraftSchema.parse({
  issueTitle: 'Issue #24: The Autumn Terracotta Harvest & Yirgacheffe Sun-Drying',
  subject: 'Clay pots, cold crisp mornings, and the first taste of direct-trade Pink Bourbon.',
  preheader: 'Julian’s terracotta kettle notes, cupping circle seats open for this Saturday.',
  audience: 'all',
  body: `### Autumn Settles Over the Kiln
As the dawn fog lingers over the cobblestones outside the Soho atelier, we have stoked the roasting drum to an unhurried, gentle convection curve.

There is a distinct solace in watching clay vessels heat. When warm water meets freshly fractured beans in porous earthenware, the volatilization of floral esters creates a sensory memory untouched by modern speed.

### Featured Harvest: Direct-Trade Huila Pink Bourbon
Freshly landed from the San Adolfo heights of Huila, Colombia. Fermented anaerobically inside sealed ceramic cylinders for 48 hours, then patio-dried under filtered Andean sun.
* Tasting Notes: Bergamot tea, wild white peach, lingering spun honeycomb.
* Roast Degree: Delicate Medium-Light (Roast Curve #09).

### Roaster’s Secret Hearth Recipe
1. Grind: 22g coarse ground (750μm, sea salt grind)
2. Water: 340ml at 93°C (Mineral balanced: 90ppm)
3. Infusion: 60ml bloom for 45s with unhurried wooden spatula paddle folds
4. Drawdown: Steady circular pour; total contact time 3m 15s.

RSVP below for our candlelight Hearth Circle this Saturday at 19:00.`,
})

export const newsletterAudiences = [
  { value: 'all', label: 'All 2,840 Subscribers', count: '2,840' },
  { value: 'parchment', label: 'Parchment Parcel Members Only', count: '820' },
  { value: 'local', label: 'Local Atelier NYC Regulars', count: '1,150' },
] as const

export const newsletterFeaturedLot = {
  title: 'Direct-Trade Micro-Lot',
  origin: 'Huila, Colombia',
  lot: 'Pink Bourbon Anaerobic',
  notes: ['Bergamot', 'White Peach', 'Honeycomb'],
  ratioTitle: "Roaster's Clay Ratio",
  ratio:
    '22g bean to 340ml soft mineral water. 45s wooden paddle bloom, delicate concentric pour over 3m 15s.',
  eventTitle: 'Hearth Circle: Cupping No. 12',
  eventTime: 'Saturday 19:00 • 8 Seats Remaining',
  image: '/images/admin/admin-18.jpg',
  imageAlt: 'Pink Bourbon coffee cherries and parchment',
  atelier: 'Beans in a Pot Atelier • 142 Mercer Street, New York, NY',
} as const
