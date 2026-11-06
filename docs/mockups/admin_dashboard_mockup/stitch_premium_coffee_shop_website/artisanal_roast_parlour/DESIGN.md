---
name: Artisanal Roast & Parlour
colors:
  surface: '#fdf9f4'
  surface-dim: '#ddd9d5'
  surface-bright: '#fdf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ee'
  surface-container: '#f1ede8'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e6e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#504440'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f4f0eb'
  outline: '#827470'
  outline-variant: '#d3c3be'
  surface-tint: '#74584e'
  primary: '#090100'
  on-primary: '#ffffff'
  primary-container: '#2c1810'
  on-primary-container: '#9e7e73'
  inverse-primary: '#e3bfb2'
  secondary: '#994703'
  on-secondary: '#ffffff'
  secondary-container: '#fc934f'
  on-secondary-container: '#6d3000'
  tertiary: '#070100'
  on-tertiary: '#ffffff'
  tertiary-container: '#371100'
  on-tertiary-container: '#c17046'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#e3bfb2'
  on-primary-fixed: '#2a170f'
  on-primary-fixed-variant: '#5a4137'
  secondary-fixed: '#ffdbc9'
  secondary-fixed-dim: '#ffb68c'
  on-secondary-fixed: '#321200'
  on-secondary-fixed-variant: '#753400'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb693'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#75340e'
  background: '#fdf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e6e2dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the sensory intimacy and quiet luxury of an artisanal specialty coffee house. It marries tactile, slow-living rituals with modern digital fluidity. The core personality is warm, refined, hospitable, and deliberate—appealing to discerning coffee connoisseurs, urban creatives, and casual neighborhood conversationalists who seek pause and sensory gratification.

The aesthetic philosophy draws on **Tactile Warmth & Editorial Craft**, synthesizing:
- **Atmospheric Warmth**: Rich dark roasts paired with velvety cream surfaces evocative of steamed milk, linen napkins, and poured espresso.
- **Editorial Poise**: High-contrast, literary serifs counterbalanced by functional, geometric body typography reminiscent of small-batch roaster packaging.
- **Sensory Tactility**: Softly pillowed controls, warm umber drop shadows, and delicate borders inspired by hand-pressed paper and ceramic tableware.

## Colors

The palette references the roasting curve—from raw unbleached parchment to caramelization and deep extraction:

- **Primary (`#2C1810`)**: Deep Espresso Roast. Forms the commanding ink color for headlines, primary structural panels, and dark-roast feature zones.
- **Secondary (`#D97736`)**: Warm Caramel & Amber Crema. Used for key conversion moments, focused interactive states, and active indicators.
- **Tertiary (`#A65A32`)**: Sun-Dried Terracotta. Serves as supporting accenting, badges, secondary tag surfaces, and subtle interactive hovers.
- **Neutral (`#F9F5F0`)**: Unbleached Oatmeal & Steamed Oat Cream. Establishes the default surface canvas, avoiding harsh clinical whites.

### Supporting Tone Tokens
- `surface-container-low`: `#F3ECE2` (soft latte foam for nested cards)
- `surface-container-high`: `#EDE4D8` (structured dividers, input wells, and table borders)
- `espresso-noir`: `#1E110A` (deepest extraction used for night-mode headers and brand marks)
- `text-muted`: `#7A675B` (grounded umber for metadata and supporting copy)

## Typography

Typography balances artisanal elegance with clear transactional hierarchy:
- **Headlines (`Playfair Display`)**: Conveys hospitality, culinary pedigree, and thoughtful conversation. Characterized by transitional serifs and generous proportions. Applied with standard to tight letter tracking (`-0.01em` to `0`).
- **Body & Controls (`DM Sans`)**: Ensures effortless readability across long-form coffee origin notes, tasting descriptors, and mobile ordering menus.
- **Labels & Badges**: Set in `DM Sans` medium or bold, with subtle uppercase tracking (`+0.05em`) for origin stamps, roast level indicators, and bag weights.

## Layout & Spacing

The layout model is anchored on an 8pt spatial baseline to preserve structural rhythm:
- **Desktop (12 Columns)**: 1200px max-width container, 48px canvas margins, and 24px column gutters. Ample negative space ensures menus and artisanal imagery breathe without visual crowding.
- **Tablet (8 Columns)**: 32px canvas margins, 20px gutters. Imagery shifts from side-by-side split layouts to offset stacked blocks.
- **Mobile (4 Columns)**: 20px margins, 16px gutters. Tasting profiles, origin notes, and purchase selectors collapse to full-width stacked sheets.

## Elevation & Depth

Visual hierarchy departs from clinical cold blurs in favor of **warm, tactile amber-tinted shadows** and layered linen surfaces:

- **Level 0 (Flat / Canvas)**: Unbleached cream (`#F9F5F0`) with faint earthen structural borders (`1px solid #EDE4D8`).
- **Level 1 (Menu Cards / Rest State)**: Subtle, warm elevation: `box-shadow: 0 4px 16px -2px rgba(44, 24, 16, 0.05)`.
- **Level 2 (Hover States / Floating Pods)**: Tactile uplift: `box-shadow: 0 10px 28px -4px rgba(44, 24, 16, 0.09)`.
- **Level 3 (Modal / Sticky Checkout Bars)**: Rich ambient cast: `box-shadow: 0 20px 40px -8px rgba(30, 17, 10, 0.16)`.
- **Inverted Surfaces (Espresso Sections)**: Deep dark roast backgrounds (`#2C1810` or `#1E110A`) employ subtle inset borders (`rgba(249, 245, 240, 0.08)`) rather than shadows for depth definition.

## Shapes

The design system employs a **Pill-Shaped (Curved Softness)** visual language to convey warmth, approachability, and the smooth curvature of ceramic cups and roasted beans:
- **Interactive Controls (Buttons, Inputs, Badges)**: Full pill borders (`9999px` or `rounded-full`) provide a soft, tactile touchpoint.
- **Surface Cards & Product Panels**: Moderately curved corners (`rounded-xl` at `1.5rem` / `24px`) to preserve structural stability while avoiding harsh edges.
- **Modal Overlays & Drawers**: Upper radii styled at `2rem` (`32px`) to emulate soft, nested trays.

## Components

### Buttons
- **Primary Pill**: Background `#2C1810`, text `#F9F5F0`, fully rounded (`9999px`), padding `12px 28px`. Hover shifts to `#D97736` with a smooth 200ms transition and ambient warm shadow.
- **Secondary (Caramel Accent)**: Background `#D97736`, text `#FFFFFF`. Hover deepens to `#A65A32`.
- **Tertiary / Ghost**: Transparent fill, bordered with `1.5px solid #2C1810`, text `#2C1810`. Hover receives a soft tint (`#F3ECE2`).

### Chips & Badges
- Compact pill forms (`rounded-full`), padding `6px 14px`.
- Tasting note chips (e.g., *Notes of Bergamot, Brown Sugar*): Set on `#F3ECE2` with `#7A675B` text.
- Roast profile badges: Set in high-contrast terracotta `#A65A32` with crisp `#FFFFFF` typography.

### Input Fields
- Enclosed pill format or softened rectangle (`12px` border radius).
- Background `#FFFFFF` or `#F3ECE2`, border `1px solid #EDE4D8`.
- Focus state activates a subtle double-ring: caramel focus halo (`#D97736` at 25% opacity) and espresso border.

### Product & Story Cards
- Background: `#FFFFFF` or `#F3ECE2`.
- Framing: Soft `1px solid #EDE4D8` border with `Level 1` ambient espresso drop shadow.
- Photography incorporates subtle warm duotone overlays or natural lighting paired with Playfair Display headline groupings and DM Sans pricing elements.

### Tasting Sliders & Selectors
- Custom radio tiles for grind options (Whole Bean, Espresso, Aeropress): Pill-shaped selector buttons with soft inset fills on active state (`#2C1810` background, `#F9F5F0` text).
- Acidity, Body, and Roast scales rendered as segmented pill dots utilizing warm caramel and espresso fills.