import { AudioLines, Camera, Mail, MapPin, Phone } from 'lucide-react'

import { BrandMark } from '@/components/brand'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { useToast } from '@/components/ui/toast'

const socialActions = [
  { label: 'Roastery Journal', icon: Camera },
  { label: 'Acoustic Tapes', icon: AudioLines },
  { label: 'Pen a letter', icon: Mail },
] as const

export function PublicFooter() {
  const { toast } = useToast()

  const placeholder = (label: string) => {
    toast({
      title: `${label} is not designed in this prototype`,
      description: 'Only the full menu and the five admin screens are in this phase.',
      tone: 'default',
    })
  }

  return (
    <footer className="w-full border-t-4 border-footer-line bg-footer pt-space-xl pb-12 text-footer-text">
      <div className="mx-auto w-full max-w-none px-margin-mobile md:px-16">
        <div className="mb-16 flex flex-col items-center justify-between gap-8 rounded-panel border border-footer-border bg-footer-panel p-8 shadow-md md:p-12 lg:flex-row">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="font-label-sm text-label-sm tracking-widest text-secondary-fixed uppercase">
              Hand-Penned Roast Circular
            </span>
            <h2 className="mt-1 mb-2 font-display-lg text-[30px] leading-tight text-[#fcf8f3] sm:text-[34px]">
              The Hearth Chronicle & Private Pot Drops
            </h2>
            <p className="font-body-md text-[15px] text-footer-muted italic">
              Receive quiet notices when seasonal micro-lots arrive from Yirgacheffe and Huila, plus
              invitations to our solstice cuppings.
            </p>
          </div>
          <NewsletterSignup className="max-w-md flex-1" />
        </div>

        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <BrandMark tone="inverse" />
            <p className="font-body-md text-[14px] leading-relaxed text-footer-muted italic">
              A sanctuary for wood-fired extraction, single-origin botanical terroir, and slow
              companionship. Roasted by hand in unglazed clay.
            </p>
            <div className="flex items-center gap-2 text-secondary-container">
              <span className="font-label-sm text-[10px] tracking-wider text-footer-chip-text uppercase">
                100% Direct Terroir Harvest Treaty
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-label-md text-[13px] font-bold tracking-widest text-[#fcf8f3] uppercase">
              Our Pot Havens
            </h3>
            <ul className="space-y-3 font-body-md text-[14px] text-footer-muted">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-secondary-container"
                  aria-hidden="true"
                />
                <span>Atelier Downtown: 142 Mercer Street, New York</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-secondary-container"
                  aria-hidden="true"
                />
                <span>The Kiln & Roasting House: 88 Franklin Ave, Brooklyn</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-secondary-container"
                  aria-hidden="true"
                />
                <a className="transition-colors hover:text-surface-bright" href="tel:+94760041594">
                  +94 760041594
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-label-md text-[13px] font-bold tracking-widest text-[#fcf8f3] uppercase">
              Slow Living Rhythms
            </h3>
            <ul className="space-y-2 font-body-md text-[14px] text-footer-muted">
              <li>Monday – Friday: 07:00 – 19:00</li>
              <li>Saturday: 08:00 – 20:00</li>
              <li>Sunday & Solstices: 08:30 – 18:00</li>
              <li className="pt-2 font-body-sm text-[13px] text-secondary-fixed italic">
                Ceramic Cupping: Thursdays 16:00 – 18:00
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-label-md text-[13px] font-bold tracking-widest text-[#fcf8f3] uppercase">
              Current Harvest Stocks
            </h3>
            <div className="mb-5 flex flex-wrap gap-2">
              {['Clay Yirgacheffe', 'Sun-dried Panama', 'Huila Pink Bourbon'].map((stock) => (
                <span
                  key={stock}
                  className="rounded border border-footer-chip-border bg-footer-chip px-3 py-1 font-label-sm text-[11px] text-footer-chip-text normal-case"
                >
                  {stock}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {socialActions.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  title="Not designed in this prototype"
                  onClick={() => placeholder(label)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-footer-chip-border bg-footer-chip text-footer-chip-text transition-colors hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-footer-line pt-8 font-body-sm text-[13px] text-[#9c8677] md:flex-row">
          <p>© 2025 Beans in a Pot Artisanal Roastery. Hand-roasted in small clay batches.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['Ethical Direct-Trade Covenant', 'Quiet Privacy', 'Sanctuary Accessibility'].map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => placeholder(label)}
                  title="Not designed in this prototype"
                  className="cursor-pointer transition-colors hover:text-surface-bright"
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>
        <p className="mt-4 text-center font-body-sm text-[11px] text-footer-muted/70 md:text-left">
          Prototype only · menu prices are sample mockup values, not verified pricing.
        </p>
        <p className="mt-2 text-center font-body-sm text-[11px] text-footer-muted/70 md:text-right">
          Designed and Developed By: Neirah Tech
        </p>
      </div>
    </footer>
  )
}
