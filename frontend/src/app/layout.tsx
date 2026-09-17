import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import './globals.css'

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
      { url: '/favicon.ico', type: 'image/x-icon' },
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
      <body className={`font-sans antialiased`}>
        <Providers>
          <GlobalLoader>{children}</GlobalLoader>
        </Providers>
      </body>
    </html>
  )
}
