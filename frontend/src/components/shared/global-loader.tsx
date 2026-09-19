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
        <Image 
          src="/loading_transparent.gif" 
          alt="Loading FreeMail..." 
          width={400} 
          height={300}
          unoptimized
          priority
        />
        <h2 className="text-white font-semibold text-xl mt-4 tracking-widest flex items-baseline">
          Loading
          <span className="inline-flex ml-1 w-6">
            <span className="animate-[bounce_1.4s_infinite] [animation-delay:-0.32s]">.</span>
            <span className="animate-[bounce_1.4s_infinite] [animation-delay:-0.16s]">.</span>
            <span className="animate-[bounce_1.4s_infinite]">.</span>
          </span>
        </h2>
      </div>
    )
  }

  return <>{children}</>
}
