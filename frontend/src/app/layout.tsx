import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: {
    default: 'FreeMail — Email Marketing Platform',
    template: '%s | FreeMail',
  },
  description:
    'Professional email marketing platform for campaigns, automation, audience management, and analytics.',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
  manifest: '/manifest.json',
  applicationName: 'FreeMail',
  keywords: [
    'email marketing',
    'campaign management',
    'automation',
    'analytics',
    'newsletter',
  ],
  openGraph: {
    type: 'website',
    title: 'FreeMail — Email Marketing Platform',
    description:
      'Professional email marketing platform for campaigns, automation, audience management, and analytics.',
    siteName: 'FreeMail',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#22242A' },
  ],
  width: 'device-width',
  initialScale: 1,
}

import { GlobalLoader } from '@/components/shared/global-loader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          <GlobalLoader>{children}</GlobalLoader>
        </Providers>
      </body>
    </html>
  )
}
