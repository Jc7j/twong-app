'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const activeLink = 'text-accent underline underline-offset-4 '

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="md:h-screen mb-8 border-b md:mr-8 md:w-[250px] bg-white text-secondary text-xl md:border-r border-border">
      <ul className="font-medium h-14 border-t border-border md:mt-24 flex justify-between items-center flex-row px-2 md:px-0 md:items-start md:flex-col md:pl-8 md:pt-8">
        <li>
          <Link href="/" className={clsx(pathname === '/' && activeLink)}>
            Home
          </Link>
        </li>
        <li className="md:mt-8">
          <Link
            href="/supplies"
            className={clsx(pathname === '/supplies' && activeLink)}
          >
            Supplies
          </Link>
        </li>
        <li className="md:mt-8">
          <Link
            href="/totals"
            className={clsx(pathname === '/totals' && activeLink)}
          >
            Totals
          </Link>
        </li>
      </ul>
    </nav>
  )
}
