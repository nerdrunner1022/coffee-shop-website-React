import { slugify } from '@/lib/utils'

import { bookings, cateringKpis, cateringServices, sustainability, workstations } from './catering'
import {
  menuAddOns,
  menuCategories,
  menuImageOptions,
  menuItems,
  menuManagerMeta,
  menuVessels,
} from './menu'
import {
  initialNewsletterDraft,
  newsletterAudiences,
  newsletterFeaturedLot,
  newsletterOverview,
} from './newsletter'
import {
  offerAuditRows,
  offerAnalytics,
  offerChannels,
  offerDiscounts,
  offerStatusCounts,
  offers as offerFixtures,
} from './offers'
import { overview } from './overview'
import type {
  Booking,
  MenuCategorySlug,
  MenuItem,
  MenuStatus,
  NewsletterDraft,
  Offer,
  OfferDraft,
} from './schema'

export type MenuItemDraft = {
  name: string
  category: MenuCategorySlug
  price: number
  badge: string
  description: string
  tags: string[]
  size: string
  status: MenuStatus
  vessel: string
  ratio: string
  origin: string
  image: string
}

export const queryKeys = {
  menu: (includeDrafts: boolean) => ['menu', includeDrafts] as const,
  menuMeta: ['menu', 'meta'] as const,
  offers: ['offers'] as const,
  catering: ['catering'] as const,
  newsletter: ['newsletter'] as const,
  overview: ['overview'] as const,
}

const clone = <T,>(value: T): T => structuredClone(value)
const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms))

let menuStore: MenuItem[] = clone(menuItems)
let offerStore: Offer[] = clone(offerFixtures)
let bookingStore: Booking[] = clone(bookings)
let newsletterDraft: NewsletterDraft = clone(initialNewsletterDraft)

function uniqueSlug(name: string) {
  const base = slugify(name) || 'menu-item'
  let candidate = base
  let suffix = 2
  while (menuStore.some((item) => item.slug === candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  return candidate
}

export async function getMenuItems(includeDrafts: boolean) {
  await delay()
  return clone(menuStore.filter((item) => includeDrafts || item.status !== 'draft'))
}

export async function getMenuCategories() {
  await delay(120)
  return clone(menuCategories)
}

export async function getMenuAddOns() {
  await delay(120)
  return clone(menuAddOns)
}

export async function getMenuManagerMeta() {
  await delay(150)
  return {
    meta: clone(menuManagerMeta),
    images: clone(menuImageOptions),
    vessels: clone(menuVessels),
  }
}

export async function createMenuItem(draft: MenuItemDraft) {
  await delay(360)
  const slug = uniqueSlug(draft.name)
  const item: MenuItem = {
    ...draft,
    id: slug,
    slug,
    imageAlt: `${draft.name} in a handcrafted ceramic vessel`,
    dispensed: 0,
    dispensedUnit: 'servings',
    trend: 0,
    trendLabel: 'New listing',
  }
  menuStore = [item, ...menuStore]
  return clone(item)
}

export async function updateMenuItem(id: string, draft: MenuItemDraft) {
  await delay(360)
  const index = menuStore.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Menu item not found')
  }
  const existing = menuStore[index]
  if (!existing) {
    throw new Error('Menu item not found')
  }
  const item: MenuItem = {
    ...existing,
    ...draft,
    imageAlt: `${draft.name} in a handcrafted ceramic vessel`,
  }
  menuStore = menuStore.map((entry, entryIndex) => (entryIndex === index ? item : entry))
  return clone(item)
}

export async function deleteMenuItem(id: string) {
  await delay(280)
  menuStore = menuStore.filter((item) => item.id !== id)
  return { id }
}

export async function duplicateMenuItem(id: string) {
  await delay(280)
  const source = menuStore.find((item) => item.id === id)
  if (!source) {
    throw new Error('Menu item not found')
  }
  const name = `${source.name} (Copy)`
  const slug = uniqueSlug(name)
  const copy: MenuItem = {
    ...source,
    id: slug,
    slug,
    name,
    status: 'draft',
    dispensed: 0,
    trend: 0,
    trendLabel: 'New listing',
  }
  menuStore = [copy, ...menuStore]
  return clone(copy)
}

export async function getOffers() {
  await delay()
  const pausedCount = offerStore.filter((offer) => offer.status === 'paused').length
  return {
    offers: clone(offerStore),
    counts: {
      active: offerStore.filter((offer) => offer.status === 'active').length,
      scheduled: offerStatusCounts.scheduled,
      expired: offerStatusCounts.expired,
      all: offerStore.length + offerStatusCounts.scheduled + offerStatusCounts.expired,
      paused: pausedCount,
    },
    analytics: clone(offerAnalytics),
    audit: clone(offerAuditRows),
    channels: clone(offerChannels),
    discounts: clone(offerDiscounts),
  }
}

export async function createOffer(draft: OfferDraft) {
  await delay(380)
  let id = slugify(draft.title) || 'offer'
  let suffix = 2
  while (offerStore.some((offer) => offer.id === id)) {
    id = `${slugify(draft.title)}-${suffix}`
    suffix += 1
  }
  const cap = Number.parseInt(draft.totalCap, 10) || 100
  const offer: Offer = {
    id,
    title: draft.title,
    badge: draft.discount,
    description: draft.description,
    code: draft.code,
    discount: draft.discount,
    image: '/images/admin/admin-11.jpg',
    imageAlt: `${draft.title} promotional coffee service`,
    redemptions: 0,
    redemptionsCap: cap,
    validThrough: draft.endDate,
    timeLabel: 'All day',
    channel: draft.channel,
    metricLabel: 'Revenue Generated',
    metricValue: '$0.00',
    status: 'active',
    startDate: draft.startDate,
    endDate: draft.endDate,
    totalCap: draft.totalCap,
    perDayCap: draft.perDayCap,
    terms: draft.terms,
    autoApply: draft.autoApply,
  }
  offerStore = [offer, ...offerStore]
  return clone(offer)
}

export async function updateOffer(id: string, draft: OfferDraft) {
  await delay(360)
  const existing = offerStore.find((offer) => offer.id === id)
  if (!existing) {
    throw new Error('Offer not found')
  }
  const updated: Offer = {
    ...existing,
    title: draft.title,
    badge: draft.discount,
    description: draft.description,
    code: draft.code,
    discount: draft.discount,
    validThrough: draft.endDate,
    channel: draft.channel,
    startDate: draft.startDate,
    endDate: draft.endDate,
    totalCap: draft.totalCap,
    perDayCap: draft.perDayCap,
    terms: draft.terms,
    autoApply: draft.autoApply,
  }
  offerStore = offerStore.map((offer) => (offer.id === id ? updated : offer))
  return clone(updated)
}

export async function toggleOfferStatus(id: string) {
  await delay(240)
  offerStore = offerStore.map((offer) =>
    offer.id === id
      ? { ...offer, status: offer.status === 'active' ? 'paused' : 'active' }
      : offer,
  )
  const updated = offerStore.find((offer) => offer.id === id)
  if (!updated) {
    throw new Error('Offer not found')
  }
  return clone(updated)
}

export async function getCatering() {
  await delay()
  return {
    kpis: clone(cateringKpis),
    services: clone(cateringServices),
    bookings: clone(bookingStore),
    workstations: clone(workstations),
    sustainability: clone(sustainability),
  }
}

export async function approveBooking(id: string) {
  await delay(300)
  bookingStore = bookingStore.map((booking) =>
    booking.id === id
      ? { ...booking, status: 'approved', depositStatus: 'Approved' }
      : booking,
  )
  const updated = bookingStore.find((booking) => booking.id === id)
  if (!updated) {
    throw new Error('Booking not found')
  }
  return clone(updated)
}

export async function getNewsletter() {
  await delay()
  return {
    overview: clone(newsletterOverview),
    draft: clone(newsletterDraft),
    audiences: clone(newsletterAudiences),
    featuredLot: clone(newsletterFeaturedLot),
  }
}

export async function saveNewsletterDraft(draft: NewsletterDraft) {
  await delay(280)
  newsletterDraft = clone(draft)
  return clone(newsletterDraft)
}

export async function publishNewsletter(draft: NewsletterDraft) {
  await delay(420)
  newsletterDraft = clone(draft)
  const audience =
    newsletterAudiences.find((entry) => entry.value === draft.audience) ?? newsletterAudiences[0]
  return {
    issueTitle: draft.issueTitle,
    recipients: audience.count,
  }
}

export async function getOverview() {
  await delay()
  return clone(overview)
}

export async function subscribeToChronicle(email: string) {
  await delay(420)
  return {
    email,
    message: 'Your parchment note is on its way.',
  }
}
