import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-label-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        primary:
          'border border-secondary bg-secondary text-surface-bright shadow-[0_4px_14px_rgba(153,71,3,0.18)] hover:border-primary-container hover:bg-primary-container',
        dark: 'button-variant-dark bg-primary-container hover:bg-secondary',
        secondary: 'bg-secondary text-on-secondary hover:bg-primary-container',
        outline:
          'border border-outline-variant bg-transparent text-on-surface hover:border-outline hover:bg-surface-container',
        ghost: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
        soft: 'bg-surface-container text-on-surface hover:bg-surface-container-high',
        cream: 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-container',
        danger: 'bg-error text-on-error hover:bg-on-error-container',
      },
      size: {
        sm: 'h-8 px-3 text-label-sm',
        md: 'h-10 px-4 text-label-md',
        lg: 'h-12 px-6 text-label-lg',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      type={asChild ? undefined : type}
      {...props}
    />
  )
}

export { buttonVariants }
