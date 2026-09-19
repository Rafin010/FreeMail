'use client'

import { useState, useEffect } from 'react'
import { LogoIcon } from '@/components/shared/logo'

export function GlobalLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for full animation to finish
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center flex-col font-sans">
        <div className="animate-pulse flex flex-col items-center">
          <LogoIcon size="lg" />
        </div>
        <h2 className="text-foreground font-semibold text-xl mt-8 tracking-widest flex items-baseline">
          LOADING
          <span className="inline-flex ml-1 w-6">
            <span className="animate-[bounce_1.4s_infinite] [animation-delay:-0.32s] text-primary">.</span>
            <span className="animate-[bounce_1.4s_infinite] [animation-delay:-0.16s] text-primary">.</span>
            <span className="animate-[bounce_1.4s_infinite] text-primary">.</span>
          </span>
        </h2>
      </div>
    )
  }

  return <>{children}</>
}
