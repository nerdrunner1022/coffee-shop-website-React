import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { z } from 'zod'

import { useToast } from '@/components/ui/toast'
import { subscribeToChronicle } from '@/mocks/api'
import { cn } from '@/lib/utils'

const emailSchema = z.string().trim().email('Enter a valid email address.')

export function NewsletterSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: subscribeToChronicle,
    onSuccess: (result) => {
      toast({
        title: 'Gathered into the Chronicle',
        description: `${result.email} is on the mock parchment list. No email will be sent.`,
        tone: 'success',
      })
      setEmail('')
    },
    onError: () => {
      toast({
        title: 'Could not complete the mock signup',
        description: 'Please try again.',
        tone: 'error',
      })
    },
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = emailSchema.safeParse(email)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a valid email address.')
      return
    }
    setError(null)
    mutation.mutate(parsed.data)
  }

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)} noValidate>
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="footer-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (error) setError(null)
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'footer-email-error' : undefined}
          placeholder="Your handwritten email address"
          className="h-12 w-full rounded-card border border-footer-input-border bg-footer-input px-5 font-body-md text-[14px] text-surface-bright outline-none transition-colors placeholder:text-[#a08a7b] focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/25"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-card border border-[#b85807] bg-secondary px-6 font-label-lg text-label-lg text-[#fff6ee] transition-colors hover:bg-[#b85807] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Gather with Us
        </button>
      </div>
      {error ? (
        <p id="footer-email-error" className="mt-2 font-body-sm text-body-sm text-[#ffb4ab]">
          {error}
        </p>
      ) : null}
      {mutation.isSuccess ? (
        <p className="mt-2 font-body-sm text-body-sm text-secondary-fixed" role="status">
          You are on the mock parchment list.
        </p>
      ) : null}
    </form>
  )
}
