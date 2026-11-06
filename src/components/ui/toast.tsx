import * as ToastPrimitive from '@radix-ui/react-toast'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

export type ToastTone = 'default' | 'success' | 'error'

type ToastInput = {
  title: string
  description?: string
  tone?: ToastTone
}

type ToastRecord = ToastInput & { id: string }

type ToastContextValue = {
  toast: (input: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneIcon = {
  default: Info,
  success: CheckCircle2,
  error: AlertTriangle,
} as const

const toneClass = {
  default: 'text-secondary',
  success: 'text-[#3f7a34]',
  error: 'text-error',
} as const

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  const remove = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback((input: ToastInput) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
    setToasts((current) => [...current, { ...input, id }])
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((item) => {
          const Icon = toneIcon[item.tone ?? 'default']
          return (
            <ToastPrimitive.Root
              key={item.id}
              open
              duration={4200}
              onOpenChange={(open) => {
                if (!open) remove(item.id)
              }}
              className="flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-[0_14px_40px_-8px_rgba(44,24,16,0.3)] data-[state=closed]:animate-out data-[state=open]:animate-in"
            >
              <Icon
                aria-hidden="true"
                className={cn('mt-0.5 h-5 w-5 shrink-0', toneClass[item.tone ?? 'default'])}
              />
              <div className="min-w-0 flex-1">
                <ToastPrimitive.Title className="font-label-lg text-label-lg text-on-surface">
                  {item.title}
                </ToastPrimitive.Title>
                {item.description ? (
                  <ToastPrimitive.Description className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                    {item.description}
                  </ToastPrimitive.Description>
                ) : null}
              </div>
              <ToastPrimitive.Close
                aria-label="Dismiss notification"
                className="cursor-pointer rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          )
        })}
        <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-[100] flex w-auto max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
