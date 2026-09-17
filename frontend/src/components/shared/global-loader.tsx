'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export function GlobalLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading animation for 1.5 seconds on initial mount
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
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
        <h2 className="text-white font-semibold text-xl mt-4 tracking-wider animate-pulse">Loading FreeMail...</h2>
      </div>
    )
  }

  return <>{children}</>
}
