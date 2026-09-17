import { Logo } from '@/components/shared/logo'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Logo size="lg" className="mb-8" />
      <h1 className="text-6xl font-semibold text-foreground">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
