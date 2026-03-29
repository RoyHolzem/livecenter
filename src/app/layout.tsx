import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LiveCenter | Real-Time Call Center Operations Dashboard',
  description: 'Enterprise-grade supervisor dashboard for contact center operations',
  keywords: 'call center, dashboard, operations, supervisor, wallboard, contact center',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
