import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import NavBar from '@/components/NavBar'

import './modern-normalize.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Taylor Wong Invoice Tracker',
  description: 'Dashboard created by Strip Creative Design',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex max-h-screen`}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
