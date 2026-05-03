'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPsychologistById } from '@/lib/store'
import type { Psychologist } from '@/types'
import PsychForm from '@/components/psychologist/PsychForm'

export default function EditPsicologoPage() {
  const { id } = useParams<{ id: string }>()
  const [psych, setPsych] = useState<Psychologist | null | undefined>(undefined)

  useEffect(() => {
    const p = getPsychologistById(id)
    setPsych(p ?? null)
  }, [id])

  if (psych === undefined) return <p className="text-sage-400 text-sm">Cargando...</p>
  if (psych === null)      return <p className="text-sage-400 text-sm">Perfil no encontrado.</p>

  return (
    <div>
      <h1 className="font-serif text-3xl text-sage-900 mb-1">Editar Perfil</h1>
      <p className="text-sm text-sage-400 mb-8">{psych.nombre}</p>
      <PsychForm initial={psych} />
    </div>
  )
}

export function generateStaticParams() {
  return []
}