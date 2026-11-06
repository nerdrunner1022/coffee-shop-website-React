# Prototype Brief — Beans in a Pot

Phase 1 contract · 2026-11-05  
Canonical direction: **A** (user decision, 2026-11-05): Beans in a Pot; mockup visual system and section order; `raw.md` service scope; `handcrafted_roastery_hero_fixed` as the home screen; YAML palette plus Playfair Display / DM Sans roles as the proposed design of record.

**Source shorthand:** `raw` = `docs/inbox/raw.md` · `design` = `docs/inbox/DESIGN.md` · `home` = `docs/mockups/beans_in_a_pot_handcrafted_roastery_hero_fixed/code.html`

## 1. What this is, for whom, and the problem

- A marketing/brochure website for **Beans in a Pot**, a physical coffee shop. [Stated raw:4–5]
- Purpose: establish an online presence so customers can learn about the business, its menu and offerings, its availability, and the extra services and spaces it accommodates. [Stated raw:5]
- Primary audience: customers of the shop. The design language additionally targets “discerning coffee connoisseurs, urban creatives, and casual neighborhood conversationalists.” [Stated raw:5; Seen design:133]
- Problem: the shop has no online presence; the site must make the physical place feel warm, premium, hospitable, and worth visiting. [Stated raw:7–8; Seen design:133–138]
- Experience requirement: a storytelling scroll, with sections revealing as they enter the viewport, similar to Apple’s site. [Stated raw:18]
- The prototype is **front-end only**, with mock data. Ordering, booking, accounts, payments, and a real backend are not designed and are out of scope. [Stated raw:18; Inferred from the absence of any designed flow]
- Section order follows the canonical mockup: hero → offers → menu peek → services → testimonials → visit → newsletter/footer. This deliberately differs from the order described in `raw:9`; the user selected the mockup layout in Phase 0. [Seen home; user decision A]
- All copy taken from the mockup — address, hours, testimonials, “Est. 2018,” prices — is **sample content**, not verified fact. [Seen home; Assumed reuse as fixtures]

## 2. Core user journey

1. **Home / hero** — warm welcome, “Beans in a Pot,” two CTAs. [Stated raw:9; Seen home]
2. **Offers of the day** — three specials; demo add/reserve CTA. [Seen home]
3. **Menu peek** — filter categories, view four known items, follow “View Full Menu.” [Seen home; Stated raw:9]
4. **Full menu** — browse the 20 supplied drinks across five categories, then return home. [Stated raw:9; Stated by user 2026-11-05]  
   The supplied menu has no prices and no food/tea items. Prices will be omitted rather than invented; food/tea remains represented only in the services section.
5. **Services & spaces** — bean sales, breakfast/tea, birthday parties, mental cool-down rooms, relaxing services. [Stated raw:9; replaces the mockup’s service copy per decision A]
6. **Testimonials** — sample social proof. [Seen home]
7. **Visit** — address, opening hours, static atmosphere/map image. [Seen home]
8. **Newsletter** — enter email, submit, see success. [Seen home; success state Assumed]
9. **Footer** — contact, hours, locations, legal links. [Seen home]

## 3. Screen list

| Screen | Status | Notes |
|---|---|---|
| Home `/` | **Designed** | Canonical A; six sections plus header/footer. Responsive behaviour must be derived for mobile. |
| Full menu `/menu` | **Partially designed** | No visual mockup exists. Content is now supplied: 20 drinks across five categories, with descriptions. No prices and no food/tea items. The visual design will be derived from Home tokens and logged as a deviation. |
| Reserve / book | **Not designed** | “Pull Up a Chair” and “Book a Hearth Seat” exist, but no flow. Prototype: placeholder dialog. |
| Service enquiry | **Not designed** | Catering/workshop CTAs exist; no form. Prototype: placeholder dialog. |
| Our Story | **Not designed** | Nav item exists; no content or section. Cut from navigation. |
| Search | **Not designed** | Search icon exists; no results design. Prototype: disabled/placeholder. |
| Account / cart / checkout | **Not designed** | BP avatar and “Order…” CTAs imply them; out of scope. |
| Legal pages | **Not designed** | Footer links exist; no copy. Placeholder dialog. |
| 404 | **Not designed** | Simple SPA fallback only. |

## 4. Feature boundaries

### In the prototype

- Responsive Home with the six canonical sections, header, mobile navigation, and footer.
- Full-menu page with the five supplied categories and 20 drinks; prices omitted because none were supplied.
- Client-side category filtering in the menu peek and full menu.
- Newsletter form: inline validation, loading, success, error; simulated submission.
- Loading skeletons, empty states, and error states for data-driven sections.
- Scroll-reveal animation per `raw:18`, with `prefers-reduced-motion` support.
- A reusable “not in this prototype” dialog for out-of-scope CTAs.
- Local copies of fonts and usable images; Netlify-ready SPA routing later.

### Faked with mock data

- One isolated mock layer with typed fixtures and zod schemas; no real API.
- Offer CTAs simulate add/reserve with a toast; no basket or order is created.
- Testimonials, addresses, hours, prices shown in the mockup, and editorial copy are fixtures copied from the mockup.
- Newsletter submission never leaves the browser.
- Empty/error states are triggerable through a dev-only control or query parameter.

### Out of scope — proposed cuts

- Ordering, cart, checkout, payments.
- Reservations and booking.
- Catering/service enquiry forms.
- Search results.
- “Our Story” page.
- Authentication, JWT, user accounts.
- Real newsletter delivery.
- Backend, database, Prisma, NestJS, Neon.
- CMS, analytics, internationalisation, dark mode.
- Live map integration, real-time stock/availability, review submission.
- The earlier drinkware/vessel catalogue: it is not a café menu and is not used anywhere in the product.
- All `parlour_2` metrics and claims: “4.9/5.0,” “1,200+ reviews,” “36+ beverages,” “52 dB,” “15 servings,” “La Marzocco,” “Head Q-Grader.” [Seen, not Stated in raw]

**Additional cuts to keep the demo honest:** remove the “Our Story & Terroir” nav item; make the BP avatar decorative; keep testimonials as clearly sample copy with no submission path; use four service cards from `raw` instead of the mockup’s three service cards, in a 2×2 desktop grid [Assumed].

## 5. Data entities implied by the UI

All endpoint shapes are **[Assumed]**; `raw.md` states no API contract.

| Entity | Fields | Provenance |
|---|---|---|
| `Shop` | id, name, tagline, description, locations[], hours[], socialLinks[] | Name/purpose [Stated raw:4–5]; address/hours/copy [Seen]; shape [Assumed] |
| `Offer` | id, name, description, price, currency, tags[], badge, imageUrl, ctaLabel | [Seen home]; shape [Assumed] |
| `MenuCategory` | id, name, slug | Five categories [Stated by user 2026-11-05]; shape [Assumed] |
| `MenuItem` | id, categoryId, name, description, price?, currency?, tags[], imageUrl?, badge? | 20 drinks [Stated by user 2026-11-05]; optional price [Assumed]; shape [Assumed] |
| `Service` | id, title, description, highlights[], ctaLabel | Service list [Stated raw:9]; shape and card copy [Assumed] |
| `Testimonial` | id, quote, authorName, authorRole, rating | [Seen home]; shape [Assumed] |
| `Location` | id, name, address, hours[] | [Seen home]; shape [Assumed] |
| `NewsletterSubscription` | email | Form [Seen home]; request/response [Assumed] |

Out-of-scope entities implied but not modelled: `BookingRequest`, `ServiceEnquiry`, `Order`, `User`. [Inferred from CTAs/avatar; no design exists]

The earlier drinkware/vessel catalogue is rejected as menu content and is not modelled. The menu source is preserved in `docs/MENU_SOURCE.md`.

## 6. Open questions (ranked)

1. **Menu coverage — resolved, with a residual gap.** The 20 supplied drinks across five categories are the full-menu content. No prices and no food/tea items were supplied. Confirm omission is acceptable, or supply prices and food/tea items before the menu page is built. Recommended: omit prices rather than invent them; keep food/tea represented only in the services section.
2. **Hero asset.** The only local hero reference is `docs/inbox/coffee-mockup.jpg`, which I cannot view and whose EXIF credits Freepik. Use it as a temporary placeholder with attribution pending, or supply a cleared hero image? Recommended: temporary placeholder.
3. **Service layout.** `raw:9` yields four service groups (beans, breakfast/tea, birthday parties, cool-down/relaxing rooms), while the mockup has three cards. Confirm four cards in a 2×2 desktop grid? Recommended: yes.

## 7. Deviations log

**Phase 1 entry.** First entries will record: replacement of the mockup’s service copy with `raw:9` services, 4-card service grid, nav pruning, derived mobile navigation, derived menu page (no visual mockup), and local image substitutions.

---

## 8. Phase 3 scope addendum — menu + admin prototype

Added 2026-11-05 after the menu and admin mockups were audited. This addendum narrows the current build to the public menu and the five supplied admin screens.

### 8.1 Screens in this phase

| Screen | Route | Status | Source |
|---|---|---|---|
| Full menu | `/menu` | **Designed** | `docs/mockups/menu_mockup/menu_code.html` |
| Admin overview & sales pulse | `/admin` | **Designed** | `admin_dashboard_mockup/.../admin_overview_sales_pulse` |
| Pot & brew menu management | `/admin/menu` | **Designed** | `.../pot_brew_menu_management` |
| Hearth offers & promos | `/admin/offers` | **Designed** | `.../hearth_offers_promos` |
| Catering & workshops | `/admin/catering` | **Designed** | `.../catering_workshops_services` |
| Hearth Chronicle newsletter | `/admin/newsletter` | **Designed** | `.../hearth_chronicle_newsletter` |
| Portal settings | — | **Not designed** | Sidebar label only; skipped and labelled in the sidebar. |

The public home screen is implemented with a shared floating navigation pill. Its hero starts on a solid color before the background and centered content appear; the header follows 250ms after the content reveal begins. Alternating section background wipes track viewport entry and exit, reversing as users scroll in either direction, while section content reveals on entry. Menu headings and item groups also reveal as they enter the viewport. Homepage story sections fill at least the viewport height and vertically center their content. The full-width public pages share the navigation Home, Offers, Menu, Services, and About, targeting the matching homepage sections. Story, reservation, service-enquiry, search-results, account, cart, checkout, and legal screens remain outside this phase. `/` is the homepage, `/menu` is the full menu, and the admin prototype is available at `/admin` and its nested screen routes. The admin prototype has no authentication or backend.

### 8.2 Content and data rules

- The public menu uses the canonical 20 drinks from `docs/MENU_SOURCE.md`, in the five supplied categories.
- The menu mockup supplies sample prices for all 20 drinks. They are carried into the fixture as **sample mockup content**, not verified prices, and are shown with a prototype note in the interface. This supersedes the Phase 1 “omit prices” proposal; `MENU_SOURCE.md` is annotated accordingly.
- Admin tables reuse the canonical 20 drinks instead of the mockup’s separate set of eight sample formulations. Admin-only fields (vessel, ratio, origin, dispensed volume, trend) are fixture data mapped onto the canonical items.
- Admin statuses are reconciled as **19 live + 1 sold out (Affogato) + 0 drafts**. The status filter still supports draft records so a newly created draft can be exercised.
- The offers mockup’s “2 scheduled / 7 expired” counts have no supplied records. The interface shows those counts and an explicit “no records supplied” empty state rather than inventing offers.
- The overview mockup’s “latest 5” order stream contains only four records. The UI labels the stream as four.
- All KPIs, charts, bookings, subscribers, rates, and business copy are sample fixtures copied from the admin mockups, not verified business metrics.
- All server data comes from `src/mocks/` through one typed zod-backed adapter. Components do not own fixtures.

### 8.3 Assets, auth, and integrations

- Locally downloaded menu and admin imagery is used; no external image or font request is made at runtime.
- The mockup logo URL resolves to a Google auth page and cannot be used. The brand is rendered as a typographic wordmark plus a lucide icon.
- Authentication, roles, permissions, payments, email delivery, calendars, maps, analytics, and a real database are out of scope. Admin routes are directly reachable prototype screens, not a secure product.
- “Log Roast Run”, “Order Kiln Restock”, “Reserve Bespoke Session”, “Send Test Proof”, and similar controls with no designed destination produce explicit prototype feedback rather than inventing a flow.
- The newsletter, offer, menu, and booking forms use local state and summary toasts only; nothing leaves the browser.

### 8.4 Responsive and accessibility commitments

- Desktop layouts follow the mockups; mobile navigation, stacked tables/cards, and overflow behaviour are derived and logged.
- AA contrast is checked for text/background pairs. Where the mockup’s `outline` tone is too light for small text, the prototype substitutes `on-surface-variant` and records the substitution.
- Dialogs trap focus and restore it on close; icon-only controls have accessible names; form fields have labels; status is not conveyed by colour alone.

### 8.5 Phase 3 deviations to record during build

- Public menu uses mockup sample prices.
- Admin menu uses the canonical 20 items, not the mockup’s 8 formulations.
- Admin status reconciliation is 19 live / 1 sold out / 0 draft.
- Offers scheduled/expired records are not supplied; empty states are used.
- Overview order stream is 4 records, not 5.
- Logo is a wordmark + icon fallback.
- Mobile admin navigation and responsive table adaptations are derived.
- Public navigation destinations that are not built are disabled and labelled.
- Newsletter preview is a simplified local render, not an email-client render.
