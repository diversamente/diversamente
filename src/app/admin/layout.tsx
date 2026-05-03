'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, PlusCircle, FileText, DollarSign, LayoutDashboard, ArrowLeft, LogOut } from 'lucide-react'

const ADMIN_USER = 'gabriel.godoy.dv@gmail.com'
const ADMIN_PASS = 'GGF@divermente2023'

const MENU = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/psicologos', icon: Users,           label: 'Psicólogos' },
  { href: '/admin/nuevo',      icon: PlusCircle,      label: 'Nuevo Perfil' },
  { href: '/admin/blog',       icon: FileText,        label: 'Blog' },
  { href: '/admin/precios',    icon: DollarSign,      label: 'Precios' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [autenticado, setAutenticado] = useState(false)
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const ok = sessionStorage.getItem('dm_admin_auth')
    if (ok === 'true') setAutenticado(true)
  }, [])

  const handleLogin = () => {
    if (usuario === ADMIN_USER && clave === ADMIN_PASS) {
      sessionStorage.setItem('dm_admin_auth', 'true')
      setAutenticado(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('dm_admin_auth')
    setAutenticado(false)
    setUsuario('')
    setClave('')
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="bg-white border border-sage-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-sage-500 rounded-lg flex items-center justify-center">
              <span className="font-serif text-white text-base font-semibold">DM</span>
            </div>
            <span className="font-serif text-lg text-sage-900">Panel Admin</span>
          </div>
          <h2 className="font-serif text-2xl text-sage-900 mb-1">Iniciar sesión</h2>
          <p className="text-sm text-sage-400 mb-6">Acceso restringido a administradores</p>
          <div className="space-y-4">
            <div>
              <label className="label">Usuario</label>
              <input
                className="input"
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="admin"
                autoFocus
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input
                className="input"
                type="password"
                value={clave}
                onChange={e => setClave(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-xs text-red-500">Usuario o contraseña incorrectos.</p>
            )}
            <button onClick={handleLogin} className="btn-primary w-full justify-center py-2.5">
              Ingresar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-sage-900 text-white h-14 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-sage-400 rounded flex items-center justify-center">
            <span className="font-serif text-xs font-semibold">DM</span>
          </div>
          <span className="font-serif text-sm text-white">DiversaMente</span>
          <span className="text-sage-400 text-sm">/ Admin</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 text-sage-300 hover:text-white text-xs transition-colors">
            <ArrowLeft size={13} /> Ver sitio
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sage-300 hover:text-red-400 text-xs transition-colors"
          >
            <LogOut size={13} /> Cerrar sesión
          </button>
        </div>
      </header>

      <div className="flex flex-1">
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
                        active ? 'bg-sage-500 text-white font-medium' : 'text-sage-300 hover:bg-sage-700 hover:text-white'
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

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}