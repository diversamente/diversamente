'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, PlusCircle, FileText, DollarSign, LayoutDashboard, ArrowLeft } from 'lucide-react'

const MENU = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/psicologos', icon: Users,           label: 'Psicólogos' },
  { href: '/admin/nuevo',    icon: PlusCircle,       label: 'Nuevo Perfil' },
  { href: '/admin/blog',     icon: FileText,         label: 'Blog' },
  { href: '/admin/precios',  icon: DollarSign,       label: 'Precios' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-sage-900 text-white h-14 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-sage-400 rounded flex items-center justify-center">
            <span className="font-serif text-xs font-semibold">DM</span>
          </div>
          <span className="font-serif text-sm text-white">DiversaMente</span>
          <span className="text-sage-400 text-sm">/ Admin</span>
        </div>
        <Link href="/" className="ml-auto flex items-center gap-1 text-sage-300 hover:text-white text-xs transition-colors">
          <ArrowLeft size={13} /> Ver sitio
        </Link>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-52 bg-sage-800 flex-shrink-0 py-6">
          <nav>
            <ul className="space-y-0.5 px-3">
              {MENU.map(item => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        active
                          ? 'bg-sage-500 text-white font-medium'
                          : 'text-sage-300 hover:bg-sage-700 hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
