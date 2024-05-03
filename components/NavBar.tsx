'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { clsx } from 'clsx'

export default function NavBar() {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 640px)')

  if (!isMobile) {
    return (
      <div className="h-screen w-[250px] text-secondary text-xl border-r border-border">
        <ul className="border-t border-border mt-24">
          <div className="pl-8 pt-8">
            <li>
              <Link
                href="/"
                className={clsx(pathname === '/' && 'text-accent')}
              >
                Home
              </Link>
            </li>
            <li className="mt-8">
              <Link
                href="/supplies"
                className={clsx(pathname === '/supplies' && 'text-accent')}
              >
                Supplies
              </Link>
            </li>
          </div>
        </ul>
      </div>
    )
  }
}
