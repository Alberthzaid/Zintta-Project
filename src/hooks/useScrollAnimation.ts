import { useRef, useEffect } from 'react'
import anime from 'animejs'

export function useScrollAnimation(options?: {
  translateY?: [number, number]
  opacity?: [number, number]
  duration?: number
  stagger?: number
  childSelector?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  const opts = {
    translateY: [40, 0] as [number, number],
    opacity: [0, 1] as [number, number],
    duration: 700,
    stagger: 100,
    childSelector: undefined as string | undefined,
    ...options,
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true
            const targets = opts.childSelector
              ? el.querySelectorAll(opts.childSelector)
              : el

            anime({
              targets,
              translateY: opts.translateY,
              opacity: opts.opacity,
              duration: opts.duration,
              easing: 'easeOutExpo',
              delay: opts.childSelector ? anime.stagger(opts.stagger) : 0,
            })
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [opts.childSelector, opts.duration, opts.opacity, opts.stagger, opts.translateY])

  return ref
}
