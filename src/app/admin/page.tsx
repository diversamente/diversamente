'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getPsychologists, getBlogPosts } from '@/lib/store'
import { getAvatarColor, getInitials } from '@/lib/data'
import { Users, FileText, PlusCircle, Eye } from 'lucide-react'

export default function AdminDashboard() {
  const [psychCount, setPsychCount] = useState(0)
  const [blogCount,  setBlogCount]  = useState(0)
  const [recent,     setRecent]     = useState<ReturnType<typeof getPsychologists>>([])

  useEffect(() => {
    const p = getPsychologists()
    const b = getBlogPosts()
    setPsychCount(p.filter(x => x.activo).length)
    setBlogCount(b.length)
    setRecent(p.slice(-4).reverse())
  }, [])

  return (
    <div>
      <h1 className="font-serif text-3xl text-sage-900 mb-1">Dashboard</h1>
      <p className="text-sm text-sage-400 mb-8">Bienvenido al panel de administración de DiversaMente</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Psicólogos activos', value: psychCount, icon: Users,     color: 'bg-sage-100 text-sage-600' },
          { label: 'Artículos del blog', value: blogCount,  icon: FileText,  color: 'bg-amber-50 text-amber-600' },
          { label: 'Sesiones (mes)',     value: '—',        icon: Eye,       color: 'bg-blue-50 text-blue-600' },
          { label: 'Nuevos pacientes',   value: '—',        icon: Users,     color: 'bg-purple-50 text-purple-600' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-sage-100 rounded-xl p-5">
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="font-serif text-3xl text-sage-900 font-semibold">{s.value}</p>
              <p className="text-xs text-sage-400 mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-sage-200 rounded-2xl p-6">
          <h2 className="font-serif text-xl text-sage-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link href="/admin/nuevo" className="btn-primary text-sm w-full justify-center py-2.5">
              <PlusCircle size={15} /> Crear Nuevo Perfil
            </Link>
            <Link href="/admin/blog" className="btn-secondary text-sm w-full justify-center py-2.5">
              <FileText size={15} /> Nueva Entrada Blog
            </Link>
          </div>
        </div>

        <div className="bg-white border border-sage-200 rounded-2xl p-6">
          <h2 className="font-serif text-xl text-sage-900 mb-4">Psicólogos Recientes</h2>
          <div className="space-y-3">
            {recent.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-serif text-sm flex-shrink-0"
                  style={{ backgroundColor: getAvatarColor(p.id) }}
                >
                  {getInitials(p.nombre)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sage-900 truncate">{p.nombre}</p>
                  <p className="text-xs text-sage-400 truncate">{p.enfoque}</p>
                </div>
                <Link href={`/admin/psicologos/${p.id}`} className="text-xs text-sage-500 hover:text-sage-600">
                  Editar →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
