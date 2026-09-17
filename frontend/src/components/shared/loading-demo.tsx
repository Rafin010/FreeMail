import { useState, useEffect } from 'react'

export default function LoadingDemo() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Show the full screen loading state for 3 seconds on mount to demonstrate the GIF
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    // Return the global loading component manually to demonstrate it
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50 fixed inset-0">
        <div className="relative w-48 h-48 flex items-center justify-center rounded-xl bg-card shadow-lg border border-border p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/loading.gif" 
            alt="Loading FreeMail..." 
            className="object-contain p-4 w-full h-full"
          />
        </div>
        <p className="mt-6 text-sm font-semibold text-muted-foreground animate-pulse">
          Loading FreeMail...
        </p>
      </div>
    )
  }

  return null
}
