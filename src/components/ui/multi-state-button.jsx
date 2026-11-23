import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const defaultTransition = { type: 'spring', stiffness: 450, damping: 35 }

const ButtonContent = forwardRef(function ButtonContent(
  { children, className, onMeasure, reducedMotion, duration },
  ref,
) {
  const contentRef = useRef(null)
  const isPresent = useIsPresent()

  useLayoutEffect(() => {
    if (!isPresent) return
    const node = contentRef.current
    const measure = () => {
      const { width, height } = node.getBoundingClientRect()
      onMeasure(previous => previous?.width === width && previous?.height === height
        ? previous
        : { width, height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [isPresent, onMeasure])

  return (
    <motion.span
      ref={ref}
      aria-hidden={!isPresent || undefined}
      className="inline-flex"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -5 }}
      transition={{ duration: reducedMotion ? 0 : duration }}
    >
      <span ref={contentRef} className={cn('inline-flex w-max items-center justify-center gap-2', className)}>
        {children}
      </span>
    </motion.span>
  )
})

/** Controlled states: { content, className?, style?, variant?, size?, disabled?, busy? }. */
function MultiStateButton({
  state,
  states,
  children,
  className,
  contentClassName,
  style,
  variant = 'default',
  size = 'default',
  disabled = false,
  transition = defaultTransition,
  contentDuration = 0.15,
  ref,
  ...props
}) {
  const current = states?.[state] ?? {}
  const reducedMotion = useReducedMotion()
  const [dimensions, setDimensions] = useState(null)

  return (
    <Button
      type="button"
      {...props}
      ref={ref}
      data-state={state}
      variant={current.variant ?? variant}
      size={current.size ?? size}
      disabled={disabled || current.disabled || current.busy}
      aria-busy={current.busy || props['aria-busy'] || undefined}
      className={cn(
        'transition-[background-color,color,border-color,box-shadow,padding,border-radius,width,height] duration-200 motion-reduce:transition-none',
        className,
        current.className,
      )}
      style={{ ...style, ...current.style }}
    >
      <motion.span
        className="relative inline-flex shrink-0 items-center justify-center overflow-hidden align-middle"
        initial={false}
        animate={dimensions ?? {}}
        transition={reducedMotion ? { duration: 0 } : transition}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <ButtonContent
            key={state}
            className={cn(contentClassName, current.contentClassName)}
            onMeasure={setDimensions}
            reducedMotion={reducedMotion}
            duration={contentDuration}
          >
            {current.content ?? children}
          </ButtonContent>
        </AnimatePresence>
      </motion.span>
    </Button>
  )
}

export { MultiStateButton }
