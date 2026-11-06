import { z } from 'zod'

import {
  bookingSchema,
  type Booking,
  serviceOfferingSchema,
  type CateringKpi,
  type ServiceOffering,
  workstationSchema,
  type Workstation,
} from './schema'

export const cateringKpis: CateringKpi[] = [
  {
    label: 'Monthly Revenue',
    value: '$8,450',
    note: '+18.4%',
    tone: 'warm',
  },
  {
    label: 'Completed Encounters',
    value: '14',
    note: '100% attendance across cohorts',
    tone: 'dark',
  },
  {
    label: 'Upcoming Booked',
    value: '9',
    note: 'Next: Tomorrow at 10:00 AM',
    tone: 'neutral',
  },
  {
    label: 'Guest Satisfaction',
    value: '4.95 / 5.0',
    note: 'Based on 68 post-cupping cards',
    tone: 'cream',
  },
  {
    label: 'Avg. Party Size',
    value: '8',
    note: 'Max hearth cap: 14',
    tone: 'green',
  },
]

export const cateringServices: ServiceOffering[] = z.array(serviceOfferingSchema).parse([
  {
    id: 'bespoke-catering',
    category: 'Bespoke Catering',
    title: 'Slow Pot Catering & Fireside Bar',
    description:
      'Full sensory hearth pop-up for weddings, secluded woodland retreats, and architectural studio launch salons. Includes brass siphon rigs and unglazed clay pots.',
    image: '/images/admin/admin-15.jpg',
    imageAlt: 'Outdoor fireside coffee catering setup',
    footerLabel: 'Upcoming Confirmed Bookings',
    footerValue: '6 Events',
    stats: [
      { label: 'Average Engagement Value', value: '$866 / session', tone: 'default' },
      { label: 'Hearth Dispatch Crew', value: '3 Baristas Allocated', tone: 'default' },
      { label: 'Deposit Locked', value: '100%', tone: 'warm' },
    ],
  },
  {
    id: 'subscription-roasts',
    category: 'Subscription Roasts',
    title: 'Parchment Parcels & Studio Delivery',
    description:
      'Hand-packaged bi-weekly roasted batches delivered to local creative agencies, design ateliers, and dedicated home enthusiasts with origin parchment notes.',
    image: '/images/admin/admin-16.jpg',
    imageAlt: 'Parchment parcels of freshly roasted coffee',
    footerLabel: 'Next Drop',
    footerValue: 'Friday Morning',
    stats: [
      { label: 'Recurring Active Members', value: '184 Roasters Guild', tone: 'default' },
      { label: 'Monthly Bean Output', value: '460 kg Roasted', tone: 'default' },
      { label: 'Delivery Cycle Retention', value: '96.8% Renewal', tone: 'warm' },
    ],
  },
  {
    id: 'sensory-guild',
    category: 'Sensory Guild',
    title: 'Clay Pot Cupping & Hearth Circles',
    description:
      'Intimate guided weekend masterclasses exploring micro-terroirs, fermentation curves, and slow tactile extraction in our terracotta atelier round-table.',
    image: '/images/admin/admin-17.jpg',
    imageAlt: 'Clay pot cupping circle around a wooden table',
    footerLabel: 'Master Certification Unit',
    footerValue: 'Manage Cohorts',
    stats: [
      { label: '3-Week Seat Occupancy', value: 'Fully Reserved (42/42)', tone: 'default' },
      { label: 'Waitlist Queue', value: '19 Patrons', tone: 'default' },
      { label: 'Workshop Host Lead', value: 'Julian Vance', tone: 'warm' },
    ],
  },
])

export const bookings: Booking[] = z.array(bookingSchema).parse([
  {
    id: 'booking-1',
    client: 'Eleanor Davenport',
    email: 'eleanor@davenport.studio',
    type: 'Slow Pot Catering / Architectural Launch',
    date: 'May 18, 2025',
    time: '14:00 - 18:30',
    guests: 18,
    venue: 'On-Site Woodland',
    depositStatus: 'Paid in Full',
    leadBarista: 'Julian Vance',
    status: 'paid',
  },
  {
    id: 'booking-2',
    client: 'Marcus Sterling & Co.',
    email: 'events@sterling.design',
    type: 'Fireside Bar & Pour / Design Biennial Reception',
    date: 'May 21, 2025',
    time: '18:00 - 22:00',
    guests: 32,
    venue: 'In-Atelier Soho',
    depositStatus: 'Deposit Received',
    leadBarista: 'Maya Lin',
    status: 'deposit',
  },
  {
    id: 'booking-3',
    client: 'Aria Thorne',
    email: 'aria.thorne@icloud.com',
    type: 'Hearth Circle Session / Fermentation Cupping',
    date: 'May 24, 2025',
    time: '10:00 - 12:30',
    guests: 6,
    venue: 'In-Atelier Soho',
    depositStatus: 'Pending Review',
    leadBarista: 'Kaito Tanaka',
    status: 'pending',
  },
  {
    id: 'booking-4',
    client: 'Soren Lindqvist',
    email: 'soren@nordicwood.se',
    type: 'Slow Pot Catering / Private Cabin Gathering',
    date: 'May 29, 2025',
    time: '11:00 - 16:00',
    guests: 12,
    venue: 'On-Site Woodland',
    depositStatus: 'Paid in Full',
    leadBarista: 'Julian Vance',
    status: 'paid',
  },
])

export const workstations: Workstation[] = z.array(workstationSchema).parse([
  {
    id: 'roaster',
    name: 'Giesen W6A Roaster Unit',
    status: '82% Booked',
    statusTone: 'ready',
    rows: [
      { label: 'Batch window', value: '06:00 – 14:00' },
      { label: 'Operator', value: 'Julian Vance' },
    ],
    week: [
      { day: 'MON', value: '8h', tone: 'mid' },
      { day: 'TUE', value: '6h', tone: 'mid' },
      { day: 'WED', value: 'Full', tone: 'high' },
      { day: 'THU', value: '7h', tone: 'mid' },
      { day: 'FRI', value: 'Full', tone: 'high' },
      { day: 'SAT', value: 'Maint', tone: 'low' },
      { day: 'SUN', value: 'Off', tone: 'low' },
    ],
  },
  {
    id: 'station-a',
    name: 'Terracotta Tasting Table (Station A)',
    status: 'Sold Out',
    statusTone: 'setup',
    rows: [
      { label: 'Saturday cohort', value: '10:00 - 13:00 · 14 / 14' },
      { label: 'Sunday cohort', value: '14:00 - 17:00 · 14 / 14' },
    ],
    week: [
      { day: 'MON', value: 'Open', tone: 'low' },
      { day: 'TUE', value: 'Open', tone: 'low' },
      { day: 'WED', value: '3h', tone: 'mid' },
      { day: 'THU', value: '2h', tone: 'mid' },
      { day: 'FRI', value: 'Full', tone: 'high' },
      { day: 'SAT', value: 'Full', tone: 'high' },
      { day: 'SUN', value: 'Full', tone: 'high' },
    ],
  },
  {
    id: 'mobile-cart',
    name: 'Mobile Hearth Cart • Rig No. 2',
    status: 'Available Sun',
    statusTone: 'resting',
    rows: [
      { label: 'Current dispatch', value: 'Woodland wedding · Friday' },
      { label: 'Next open window', value: 'Sunday from 12:00' },
    ],
    week: [
      { day: 'MON', value: 'Prep', tone: 'low' },
      { day: 'TUE', value: 'Prep', tone: 'low' },
      { day: 'WED', value: 'Clean', tone: 'low' },
      { day: 'THU', value: 'Pack', tone: 'mid' },
      { day: 'FRI', value: 'Booked', tone: 'high' },
      { day: 'SAT', value: 'Booked', tone: 'high' },
      { day: 'SUN', value: 'Open', tone: 'mid' },
    ],
  },
])

export const sustainability = {
  title: 'Sustainable Hearth Certification Standard',
  description:
    'All communal catering events offset spent grounds into local urban composting gardens. Zero single-use paper cups tolerated.',
  value: '2.4 Tons Diverted YTD',
  action: 'View Waste Metrics',
} as const
