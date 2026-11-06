import { useEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StoryRevealProps = {
  children: ReactNode
  direction?: 'left' | 'right'
  repeatBackground?: boolean
  className?: string
}

export function StoryReveal({
  children,
  direction = 'left',
  repeatBackground = false,
  className = '',
}: StoryRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === 'undefined')
  const [isInViewport, setIsInViewport] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const element = elementRef.current
    if (!element || typeof IntersectionObserver === 'undefined' || (!repeatBackground && isVisible))
      return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (repeatBackground) {
          setIsInViewport(entry.isIntersecting)
        }

        if (entry.isIntersecting) {
          setIsVisible(true)
          if (!repeatBackground) observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [isVisible, repeatBackground])

  return (
    <div
      ref={elementRef}
      className={cn(
        'story-reveal',
        `story-reveal--${direction}`,
        repeatBackground && 'story-reveal--repeat-background',
        isVisible && 'is-visible',
        isInViewport && 'is-in-viewport',
        className,
      )}
    >
      {children}
    </div>
  )
}
