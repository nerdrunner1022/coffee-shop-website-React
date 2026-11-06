import { useQuery } from '@tanstack/react-query'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Coffee,
  Heart,
  Leaf,
  Pause,
  PartyPopper,
  Play,
} from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import { PublicFooter } from '@/components/public-footer'
import { PublicHeader } from '@/components/public-header'
import { StoryReveal } from '@/components/story-reveal'
import { getMenuCategories, getMenuItems, queryKeys } from '@/mocks/api'
import type { MenuCategorySlug } from '@/mocks/schema'

const serviceCards = [
  {
    icon: Coffee,
    title: 'Beans for your own hearth',
    description:
      'Take home carefully chosen beans and blends, roasted for slow mornings and curious cups.',
    note: 'Whole beans & blends',
  },
  {
    icon: Leaf,
    title: 'A little something with your cup',
    description:
      'Settle in for a gentle breakfast, an afternoon tea, or something warm from the kitchen.',
    note: 'Breakfast & tea time',
  },
  {
    icon: PartyPopper,
    title: 'Gather around the table',
    description:
      'Make room for a birthday, a small celebration, or an unhurried get-together with your people.',
    note: 'Small gatherings',
  },
  {
    icon: Heart,
    title: 'Space to slow down',
    description:
      'Find a quieter corner to breathe, reset, read, and take the day one warm sip at a time.',
    note: 'A calm corner',
  },
] as const

const testimonials = [
  {
    quote:
      'Beans in a Pot feels like stepping into a peaceful monastery for sensory craft. The smoked honey pot has ruined all standard coffees for me forever.',
    byline: 'Ceramicist & neighbor',
  },
  {
    quote:
      'No harsh machines shouting over you, no hurried takeaway rush. Just warm wood surfaces, the crackle of flame, and honest coffee poured with immense care.',
    byline: 'Writer & reader',
  },
  {
    quote:
      'Attended their Saturday pot roasting circle. Understanding the patience behind roasting green seeds completely altered my relationship with morning rituals.',
    byline: 'Botanical illustrator',
  },
  {
    quote:
      'The first place I’ve found where a coffee break actually feels like a break. I always leave a little more settled than when I came in.',
    byline: 'Local teacher',
  },
  {
    quote:
      'They take the craft seriously without making it feel intimidating. Someone helped me find a roast I now look forward to every morning.',
    byline: 'Curious regular',
  },
  {
    quote:
      'A beautiful corner to meet a friend, share something warm, and let a conversation take as long as it needs.',
    byline: 'Neighborhood artist',
  },
  {
    quote:
      'The care in every cup is easy to taste. Even on a busy day, the welcome feels personal and unhurried.',
    byline: 'Weekend visitor',
  },
  {
    quote:
      'I came in for one coffee and found my new favorite reading spot. The quiet atmosphere is every bit as lovely as the brew.',
    byline: 'Reader & regular',
  },
] as const

const dailySpecials = [
  {
    name: 'Velvet Pot & Cardamom Brioche',
    description:
      'A clay-filtered double ristretto with unhomogenized farm milk, alongside warm brioche and wild cardamom.',
    image: '/images/menu/menu-01.jpg',
    imageAlt: 'A handmade ceramic cup of coffee on a wooden table',
    label: 'Morning comfort',
  },
  {
    name: 'Stone Tower Kyoto Drip',
    description:
      'A patient, drop-by-drop brew through mountain spring ice, finished with a little vanilla cream.',
    image: '/images/menu/menu-04.jpg',
    imageAlt: 'Slow pour-over coffee in a bright roastery',
    label: 'Slow brewed',
  },
  {
    name: 'Terracotta Geisha Flight',
    description:
      'Three small clay pots invite you to linger over distinct origins, aromas, and the pleasure of tasting.',
    image: '/images/menu/menu-06.jpg',
    imageAlt: 'Coffee prepared for a careful tasting',
    label: 'A tasting ritual',
  },
] as const

const visitHours = [
  ['Monday – Friday', '07:00 – 19:00'],
  ['Saturday & Sunday', '08:00 – 20:00'],
] as const

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<'all' | MenuCategorySlug>('all')
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [isCarouselInteracting, setIsCarouselInteracting] = useState(false)
  const menuQuery = useQuery({
    queryKey: queryKeys.menu(false),
    queryFn: () => getMenuItems(false),
  })
  const categoriesQuery = useQuery({
    queryKey: ['menu', 'categories'],
    queryFn: getMenuCategories,
  })

  const menuItems = menuQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const visibleItems = menuItems
    .filter((item) => activeCategory === 'all' || item.category === activeCategory)
    .slice(0, 4)
  const currentTestimonial = testimonials[activeTestimonial]

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setIsCarouselPaused(event.matches)
    }

    motionPreference.addEventListener('change', updateMotionPreference)
    return () => motionPreference.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    if (isCarouselPaused || isCarouselInteracting) return

    const intervalId = window.setInterval(() => {
      setActiveTestimonial((index) => (index + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [isCarouselInteracting, isCarouselPaused])

  const showTestimonial = (offset: number) => {
    setActiveTestimonial((index) => (index + offset + testimonials.length) % testimonials.length)
  }

  return (
    <div className="home-page">
      <a className="home-skip-link" href="#home-main">
        Skip to content
      </a>
      <PublicHeader heroEntrance />

      <main id="home-main">
        <section id="hero" className="home-hero" aria-labelledby="home-title">
          <div className="home-hero__photo" aria-hidden="true">
            <img src="/images/menu/menu-01.jpg" alt="" fetchPriority="high" />
          </div>
          <div className="home-hero__shade" aria-hidden="true" />
          <div className="home-hero__steam home-hero__steam--one" aria-hidden="true" />
          <div className="home-hero__steam home-hero__steam--two" aria-hidden="true" />

          <div className="home-hero__content home-hero__central-reveal">
            <h1 id="home-title" className="home-hero__title">
              Come in. Let the day <em>steep.</em>
            </h1>
            <p className="home-hero__copy">
              Where wood-fired roasting meets ceramic-pot brewing. A warm cup, a quiet corner, and
              time enough to enjoy both.
            </p>
            <div className="home-hero__actions">
              <a className="home-button home-button--light" href="#visit">
                Find your way here <ArrowUpRight aria-hidden="true" size={16} />
              </a>
              <a className="home-button home-button--quiet" href="#specials">
                Take a little look
              </a>
            </div>
          </div>
          <a className="home-hero__scroll" href="#specials" aria-label="Scroll to today's specials">
            <span>Scroll to wander</span>
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </section>

        <StoryReveal direction="left" repeatBackground>
          <section
            id="specials"
            className="home-section home-specials"
            aria-labelledby="specials-title"
          >
            <div className="home-container">
              <SectionHeading
                eyebrow="A small ritual for today"
                title="Today’s Hearth & Pot Specials"
                description="Freshly cracked beans, a patient pour, and something lovely to linger over."
                id="specials-title"
              />
              <div className="home-specials__grid">
                {dailySpecials.map((special, index) => (
                  <article
                    className="home-special-card"
                    key={special.name}
                    style={{ '--story-delay': `${index * 90}ms` } as CSSProperties}
                    data-story-item
                  >
                    <div className="home-special-card__image">
                      <img src={special.image} alt={special.imageAlt} loading="lazy" />
                      <span className="home-image-label">{special.label}</span>
                    </div>
                    <div className="home-special-card__body">
                      <span className="home-card-number">0{index + 1} / TODAY</span>
                      <h3>{special.name}</h3>
                      <p>{special.description}</p>
                      <Link to="/menu" className="home-text-link">
                        Explore the menu <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </StoryReveal>

        <StoryReveal direction="right" repeatBackground>
          <section id="menu" className="home-section home-menu" aria-labelledby="menu-title">
            <div className="home-container">
              <div className="home-menu__intro">
                <SectionHeading
                  eyebrow="From the slow-roast shelf"
                  title="A glimpse into our menu"
                  description="Every cup has its own pace. Find a familiar favorite or follow a new aroma."
                  id="menu-title"
                />
                <Link to="/menu" className="home-button home-button--dark">
                  See the full menu <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <div className="home-menu__filters" aria-label="Filter menu preview">
                <button
                  type="button"
                  className={activeCategory === 'all' ? 'is-active' : ''}
                  aria-pressed={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                >
                  All brews
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    className={activeCategory === category.slug ? 'is-active' : ''}
                    aria-pressed={activeCategory === category.slug}
                    onClick={() => setActiveCategory(category.slug)}
                  >
                    {category.shortLabel}
                  </button>
                ))}
              </div>

              {menuQuery.isError || categoriesQuery.isError ? (
                <div className="home-menu__message" role="alert">
                  <p>We couldn’t bring the menu forward just now.</p>
                  <button
                    type="button"
                    onClick={() => {
                      void menuQuery.refetch()
                      void categoriesQuery.refetch()
                    }}
                  >
                    Try again
                  </button>
                </div>
              ) : menuQuery.isPending || categoriesQuery.isPending ? (
                <div className="home-menu__grid" aria-label="Loading menu" aria-busy="true">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div className="home-menu-skeleton" key={index} />
                  ))}
                </div>
              ) : visibleItems.length > 0 ? (
                <div className="home-menu__grid">
                  {visibleItems.map((item, index) => (
                    <article
                      className="home-menu-card"
                      key={item.id}
                      style={{ '--story-delay': `${index * 90}ms` } as CSSProperties}
                      data-story-item
                    >
                      <div className="home-menu-card__image">
                        <img src={item.image} alt={item.imageAlt} loading="lazy" />
                      </div>
                      <div className="home-menu-card__copy">
                        <span>{item.badge}</span>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <div className="home-menu-card__tags">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="home-menu__message" role="status">
                  No brews in this part of the menu just yet.
                </p>
              )}
              <p className="home-prototype-note">
                Menu prices shown on the full menu are sample mockup content.
              </p>
            </div>
          </section>
        </StoryReveal>

        <StoryReveal direction="left" repeatBackground>
          <section
            id="services"
            className="home-section home-services"
            aria-labelledby="services-title"
          >
            <div className="home-container">
              <SectionHeading
                eyebrow="More than a cup"
                title="A hearth for all kinds of days"
                description="Come for the beans, stay for a birthday, a pot of tea, or a moment to breathe."
                id="services-title"
                tone="light"
              />
              <div className="home-services__grid">
                {serviceCards.map(({ icon: Icon, title, description, note }, index) => (
                  <article
                    className="home-service-card"
                    key={title}
                    style={{ '--story-delay': `${index * 90}ms` } as CSSProperties}
                    data-story-item
                  >
                    <span className="home-service-card__icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="home-service-card__note">{note}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <a className="home-service-card__link" href="#visit">
                      Come say hello <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </StoryReveal>

        <StoryReveal direction="right" repeatBackground>
          <section
            id="kind-words"
            className="home-section home-kind-words"
            aria-labelledby="kind-words-title"
          >
            <div className="home-container">
              <SectionHeading
                eyebrow="Notes from the neighborhood"
                title="Warm words around the hearth"
                description="A few kind words from people who have found a moment of calm here."
                id="kind-words-title"
              />
              <div
                className="home-testimonials__carousel"
                role="region"
                aria-roledescription="carousel"
                aria-label="Guest reviews"
                onPointerEnter={() => setIsCarouselInteracting(true)}
                onPointerLeave={() => setIsCarouselInteracting(false)}
                onFocusCapture={() => setIsCarouselInteracting(true)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsCarouselInteracting(false)
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft') {
                    event.preventDefault()
                    showTestimonial(-1)
                  } else if (event.key === 'ArrowRight') {
                    event.preventDefault()
                    showTestimonial(1)
                  }
                }}
              >
                <div className="home-testimonials__grid" aria-live="off">
                  <figure
                    className="home-testimonial"
                    key={currentTestimonial.byline}
                    style={{ '--story-delay': '0ms' } as CSSProperties}
                    data-story-item
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${activeTestimonial + 1} of ${testimonials.length}`}
                  >
                    <div className="home-testimonial__stars" aria-label="Sample testimonial">
                      <span aria-hidden="true">✳ ✳ ✳ ✳ ✳</span>
                    </div>
                    <blockquote>“{currentTestimonial.quote}”</blockquote>
                    <figcaption>
                      <span className="home-testimonial__avatar" aria-hidden="true">
                        {currentTestimonial.byline.charAt(0)}
                      </span>
                      <span>{currentTestimonial.byline}</span>
                    </figcaption>
                  </figure>
                </div>
                <div className="home-testimonials__controls" data-story-item>
                  <div className="home-testimonials__navigation">
                    <button
                      type="button"
                      className="home-testimonials__arrow"
                      aria-label="Previous review"
                      onClick={() => showTestimonial(-1)}
                    >
                      <ArrowLeft size={17} aria-hidden="true" />
                    </button>
                    <div className="home-testimonials__indicators" aria-label="Choose a review">
                      {testimonials.map((testimonial, index) => (
                        <button
                          key={testimonial.byline}
                          type="button"
                          className="home-testimonials__indicator"
                          aria-label={`Show review ${index + 1}`}
                          aria-current={index === activeTestimonial ? 'true' : undefined}
                          onClick={() => setActiveTestimonial(index)}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="home-testimonials__arrow"
                      aria-label="Next review"
                      onClick={() => showTestimonial(1)}
                    >
                      <ArrowRight size={17} aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="home-testimonials__rotation"
                    aria-label={
                      isCarouselPaused ? 'Play automatic reviews' : 'Pause automatic reviews'
                    }
                    onClick={() => setIsCarouselPaused((paused) => !paused)}
                  >
                    {isCarouselPaused ? (
                      <Play size={13} aria-hidden="true" />
                    ) : (
                      <Pause size={13} aria-hidden="true" />
                    )}
                    <span>{isCarouselPaused ? 'Play' : 'Pause'}</span>
                  </button>
                </div>
              </div>
              <p className="home-prototype-note">Guest notes are sample prototype content.</p>
            </div>
          </section>
        </StoryReveal>

        <StoryReveal direction="left" repeatBackground>
          <section id="visit" className="home-section home-visit" aria-labelledby="visit-title">
            <div className="home-container">
              <div className="home-visit__panel">
                <div className="home-visit__copy">
                  <p className="home-eyebrow">Leave a little room in your day</p>
                  <h2 id="visit-title">Step into the hearth.</h2>
                  <p className="home-visit__intro">
                    Whether you’re looking for a worn paperback kind of afternoon or a quiet
                    conversation across the table, there’s room by the pot.
                  </p>
                  <div className="home-visit__details">
                    <div>
                      <span className="home-detail-label">Find us</span>
                      <address>
                        142 Mercer Street, Soho
                        <br />
                        New York, NY 10012
                      </address>
                    </div>
                    <div>
                      <span className="home-detail-label">A good time to come by</span>
                      <ul>
                        {visitHours.map(([day, hours]) => (
                          <li key={day}>
                            <span>{day}</span>
                            <span>{hours}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="home-visit__sample-note">
                    Address and hours are sample prototype content.
                  </p>
                  <Link to="/menu" className="home-button home-button--light">
                    Browse the menu <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
                <div className="home-visit__image">
                  <img
                    src="/images/menu/menu-04.jpg"
                    alt="A slow pour-over coffee being made in the morning light"
                    loading="lazy"
                  />
                  <span className="home-visit__image-caption">
                    <span>142 Mercer Street</span>
                    <span>New York · Sample location</span>
                  </span>
                </div>
              </div>
            </div>
          </section>
        </StoryReveal>
      </main>

      <StoryReveal direction="right">
        <PublicFooter />
      </StoryReveal>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  tone = 'dark',
}: {
  eyebrow: string
  title: string
  description: string
  id: string
  tone?: 'dark' | 'light'
}) {
  return (
    <div className={`home-section-heading home-section-heading--${tone}`} data-story-heading>
      <p className="home-eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <p className="home-section-heading__description">{description}</p>
    </div>
  )
}
