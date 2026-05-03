import Link from 'next/link'
import type { Psychologist } from '@/types'
import { getAvatarColor, getInitials } from '@/lib/data'

interface Props {
  psych: Psychologist
  compact?: boolean
}

export default function PsychCard({ psych, compact = false }: Props) {
  const color = getAvatarColor(psych.id)
  const initials = getInitials(psych.nombre)

  return (
    <div className="card flex flex-col">
      {/* Header */}
      <div className="bg-sage-50 p-6 text-center">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center
                     text-white font-serif text-3xl font-semibold border-4 border-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
        <h3 className="font-serif text-base font-semibold text-sage-900 mb-0.5">{psych.nombre}</h3>
        <p className="text-xs text-sage-500 font-medium">{psych.enfoque}</p>
      </div>

      {/* Body */}
      <div className="p-4 flex-1">
        <p className="text-xs text-sage-400 mb-2">📚 {psych.universidad}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {psych.categorias.map(c => (
            <span key={c} className="badge-cat">{c}</span>
          ))}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5">
          {psych.especialidades.slice(0, 3).map(s => (
            <span key={s} className="badge">{s}</span>
          ))}
          {psych.especialidades.length > 3 && (
            <span className="badge text-sage-400">+{psych.especialidades.length - 3}</span>
          )}
        </div>

        {!compact && (
          <p className="text-xs text-sage-400 mt-3 leading-relaxed line-clamp-2">
            {psych.descripcion}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sage-100 flex items-center justify-between">
        <div className="text-xs text-sage-400">
          desde <strong className="text-sage-900 text-sm">$35.000</strong>
        </div>
        <Link
          href={`/psicologos/${psych.id}`}
          className="bg-sage-500 hover:bg-sage-600 text-white text-xs font-medium
                     px-4 py-1.5 rounded-full transition-colors"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  )
}
