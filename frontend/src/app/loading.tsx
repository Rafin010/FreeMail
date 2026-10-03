import Image from 'next/image'

export default function Loading() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center bg-[#222527] z-50 fixed inset-0">
      
      {/* Animation */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex flex-col items-center justify-center">
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
      <h2 className="text-white/80 font-semibold text-lg tracking-widest flex items-baseline mt-4">
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
