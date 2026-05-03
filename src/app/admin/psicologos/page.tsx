'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPsychologists, deletePsychologist, savePsychologist } from '@/lib/store'
import { getAvatarColor, getInitials } from '@/lib/data'
import type { Psychologist } from '@/types'
import { PlusCircle, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react'

export default function AdminPsicologosPage() {
  const [psychs, setPsychs] = useState<Psychologist[]>([])
  const [search, setSearch] = useState('')

  const load = () => setPsychs(getPsychologists())
  useEffect(() => { load() }, [])

  const filtered = psychs.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = (p: Psychologist) => {
    savePsychologist({ ...p, activo: !p.activo })
    load()
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar el perfil de ${name}? Esta acción no se puede deshacer.`)) {
      deletePsychologist(id)
      load()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-sage-900 mb-1">Psicólogos</h1>
          <p className="text-sm text-sage-400">{psychs.length} perfiles registrados</p>
        </div>
        <Link href="/admin/nuevo" className="btn-primary text-sm">
          <PlusCircle size={15} /> Nuevo Perfil
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="input max-w-xs"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white border border-sage-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sage-50 border-b border-sage-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-sage-500">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-sage-500 hidden md:table-cell">Universidad</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-sage-500 hidden lg:table-cell">Enfoque</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-sage-500">Categorías</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-sage-500">Estado</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-sage-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-sage-100 hover:bg-sage-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                                 text-white font-serif text-xs font-semibold"
                      style={{ backgroundColor: getAvatarColor(p.id) }}
                    >
                      {getInitials(p.nombre)}
                    </div>
                    <span className="font-medium text-sage-900">{p.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sage-500 hidden md:table-cell">{p.universidad}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="badge text-xs">{p.enfoque.replace('Terapia con enfoque ', '').replace('Enfoque ', '')}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.categorias.slice(0, 2).map(c => (
                      <span key={c} className="badge-cat text-xs py-0.5">{c}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleActive(p)} className="inline-flex items-center gap-1 text-xs">
                    {p.activo
                      ? <><ToggleRight size={18} className="text-green-500" /><span className="text-green-600 hidden sm:inline">Activo</span></>
                      : <><ToggleLeft size={18} className="text-sage-300" /><span className="text-sage-400 hidden sm:inline">Inactivo</span></>
                    }
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/psicologos/${p.id}`}
                      target="_blank"
                      className="p-1.5 text-sage-400 hover:text-sage-600 rounded"
                      title="Ver perfil"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/admin/psicologos/${p.id}`}
                      className="p-1.5 text-sage-400 hover:text-sage-600 rounded"
                      title="Editar"
                    >
                      <Edit size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.nombre)}
                      className="p-1.5 text-sage-300 hover:text-red-500 rounded"
                      title="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sage-400 text-sm">
            {search ? 'Sin resultados para esa búsqueda.' : 'No hay psicólogos registrados.'}
          </div>
        )}
      </div>
    </div>
  )
}
