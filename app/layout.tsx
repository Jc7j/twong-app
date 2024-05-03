import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

import NavBar from '@/components/NavBar'

import './modern-normalize.css'
import './globals.css'

const robotoFont = localFont({
  src: [
    {
      path: './fonts/roboto/Roboto-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/roboto/Roboto-Medium.ttf',
      weight: '500',
      style: 'medium',
    },
  ],
})

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
      <body className={`${robotoFont.className} flex max-h-screen`}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
