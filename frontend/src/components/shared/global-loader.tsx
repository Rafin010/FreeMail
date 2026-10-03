'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export function GlobalLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for full animation to finish
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#222527] z-50 flex items-center justify-center flex-col font-sans">
        
        {/* Animation */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96">
          <Image 
            src="/loading.gif" 
            alt="Loading FreeMail..." 
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>

        {/* Loading Text */}
        <h2 className="text-white/80 font-semibold text-lg tracking-widest flex items-baseline mt-4 -translate-y-8">
          LOADING
          <span className="inline-flex ml-1 w-6">
            <span className="animate-[bounce_1.4s_infinite] [animation-delay:-0.32s]">.</span>
            <span className="animate-[bounce_1.4s_infinite] [animation-delay:-0.16s]">.</span>
            <span className="animate-[bounce_1.4s_infinite]">.</span>
          </span>
        </h2>

        {/* Footer Text */}
        <div className="absolute bottom-12 flex flex-col items-center">
          <span className="text-white/40 text-[11px] font-medium tracking-widest uppercase mb-1">
            from
          </span>
          <span className="text-white/90 text-xl font-bold tracking-[0.2em] font-sans">
            x010
          </span>
        </div>

      </div>
    )
  }

  return <>{children}</>
}
