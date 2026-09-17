import Image from 'next/image'

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50 fixed inset-0">
      <div className="relative w-48 h-48 flex items-center justify-center rounded-xl bg-card shadow-lg border border-border p-4">
        <Image 
          src="/loading.gif" 
          alt="Loading..." 
          fill
          className="object-contain p-4"
          unoptimized
        />
      </div>
      <p className="mt-6 text-sm font-semibold text-muted-foreground animate-pulse">
        Loading FreeMail...
      </p>
    </div>
  )
}
