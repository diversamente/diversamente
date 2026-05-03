'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/',           label: 'Inicio' },
  { href: '/psicologos', label: 'Psicólogos' },
  { href: '/tarifas',    label: 'Tarifas' },
  { href: '/blog',       label: 'Blog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-sage-200 sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-sage-500 rounded-lg flex items-center justify-center">
            <span className="font-serif text-white text-base font-semibold">DM</span>
          </div>
          <span className="font-serif text-lg text-sage-900">
            Diversa<span className="text-sage-500">Mente</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-sm transition-colors ${
                  pathname === l.href
                    ? 'text-sage-500 font-medium'
                    : 'text-sage-400 hover:text-sage-500'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/admin"
              className={`text-sm transition-colors ${
                pathname.startsWith('/admin')
                  ? 'text-amber-600 font-medium'
                  : 'text-amber-500 hover:text-amber-600'
              }`}
            >
              Admin
            </Link>
          </li>
        </ul>

        {/* CTA */}
	<Link href="/reservar" className="hidden md:inline-flex btn-primary text-sm py-2">
	  Reservar Cita
	</Link>
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-sage-500"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-sage-100 px-6 py-4 space-y-3">
          {[...links, { href: '/admin', label: 'Admin ⚙️' }].map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-sm text-sage-500 hover:text-sage-600 py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
	<Link href="/reservar" className="hidden md:inline-flex btn-primary text-sm py-2">
	  Reservar Cita
	</Link>
        </div>
      )}
    </nav>
  )
}
