import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** Show text next to the icon */
  showText?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Additional class names */
  className?: string
}

const sizeMap = {
  sm: { icon: 24, text: 'text-sm' },
  md: { icon: 32, text: 'text-lg' },
  lg: { icon: 40, text: 'text-xl' },
  xl: { icon: 56, text: 'text-3xl' },
}

export function Logo({ showText = true, size = 'md', className }: LogoProps) {
  const s = sizeMap[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Image
        src="/images/logo.png"
        alt="FreeMail"
        width={s.icon}
        height={s.icon}
        className="flex-shrink-0"
        priority
      />
      {showText && (
        <span
          className={cn(
            'font-semibold tracking-tight text-foreground',
            s.text
          )}
        >
          Free
          <span className="text-primary">Mail</span>
        </span>
      )}
    </div>
  )
}

/** Compact icon-only logo for collapsed sidebar */
export function LogoIcon({
  size = 'md',
  className,
}: Omit<LogoProps, 'showText'>) {
  const s = sizeMap[size]

  return (
    <Image
      src="/images/logo.png"
      alt="FreeMail"
      width={s.icon}
      height={s.icon}
      className={cn('flex-shrink-0', className)}
      priority
    />
  )
}
