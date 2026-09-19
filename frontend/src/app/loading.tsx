import { LogoIcon } from '@/components/shared/logo'

export default function Loading() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center bg-background z-50 fixed inset-0">
      <div className="flex flex-col items-center justify-center animate-pulse">
        <LogoIcon size="lg" />
        <p className="mt-6 text-sm font-bold tracking-widest text-muted-foreground uppercase">
          Loading FreeMail...
        </p>
      </div>
    </div>
  )
}
