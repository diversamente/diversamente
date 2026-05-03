'use client'

import { useEffect, useState } from 'react'
import BookingModal from '@/components/psychologist/BookingModal'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getPsychologistById } from '@/lib/store'
import { getAvatarColor, getInitials, DAY_LABELS, HORARIO_NORMAL } from '@/lib/data'
import type { Psychologist } from '@/types'
import { ArrowLeft, GraduationCap, MapPin, Globe, CheckCircle, Clock } from 'lucide-react'

export default function PsychProfileClient() {
  const { id } = useParams<{ id: string }>()
  const [psych, setPsych] = useState<Psychologist | null>(null)
const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const p = getPsychologistById(id)
    if (p) setPsych(p)
  }, [id])

  if (!psych) {
    return (
      <>
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-sage-400 text-lg">Perfil no encontrado.</p>
          <Link href="/psicologos" className="btn-primary mt-4">← Volver</Link>
        </div>
        <Footer />
      </>
    )
  }

  const color    = getAvatarColor(psych.id)
  const initials = getInitials(psych.nombre)

  return (
    <>
      <Navbar />
      <main className="container py-8">
        <Link href="/psicologos" className="btn-ghost text-sm mb-6 inline-flex">
          <ArrowLeft size={16} /> Volver a Psicólogos
        </Link>
        <div className="bg-sage-50 border border-sage-200 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start mb-8">
          <div
            className="w-28 h-28 rounded-full flex-shrink-0 flex items-center justify-center
                       text-white font-serif text-5xl font-semibold border-4 border-white shadow"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-3xl text-sage-900 mb-1">{psych.nombre}</h1>
            <p className="text-sage-500 text-sm font-medium mb-3">Psicólog@ Clínic@</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge text-sm py-1">{psych.enfoque}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {psych.categorias.map(c => <span key={c} className="badge-cat">{c}</span>)}
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-sm text-sage-400 mb-1">Desde</p>
            <p className="font-serif text-4xl text-sage-900 font-semibold">$35.000</p>
            <p className="text-xs text-sage-400 mb-4">por sesión · 50 min</p>
            <button onClick={() => setShowModal(true)} className="btn-primary text-sm">Reservar Sesión</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-sage-200 rounded-2xl p-6">
              <h2 className="font-serif text-xl text-sage-900 mb-3 pb-3 border-b border-sage-100">Sobre mí</h2>
              <p className="text-sm text-sage-500 leading-relaxed">{psych.descripcion}</p>
            </div>
            <div className="bg-white border border-sage-200 rounded-2xl p-6">
              <h2 className="font-serif text-xl text-sage-900 mb-3 pb-3 border-b border-sage-100">Especialidades</h2>
              <div className="flex flex-wrap gap-2">
                {psych.especialidades.map(s => <span key={s} className="badge py-1">{s}</span>)}
              </div>
            </div>
            {psych.posgrados.length > 0 && (
              <div className="bg-white border border-sage-200 rounded-2xl p-6">
                <h2 className="font-serif text-xl text-sage-900 mb-3 pb-3 border-b border-sage-100">Formación Adicional</h2>
                <div className="space-y-3">
                  {psych.posgrados.map((pg, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-sage-400 mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sage-900">{pg.titulo}</p>
                        <p className="text-sage-400">{pg.institucion} · {pg.desde} – {pg.hasta || 'Actualidad'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-sage-200 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-sage-500 mb-4 pb-3 border-b border-sage-100">Información</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-sage-500"><GraduationCap size={15} className="text-sage-400" />{psych.universidad}</div>
                <div className="flex items-center gap-2 text-sage-500"><MapPin size={15} className="text-sage-400" />Online (videollamada)</div>
                <div className="flex items-center gap-2 text-sage-500"><Globe size={15} className="text-sage-400" />Español</div>
                <div className="flex items-center gap-2 text-sage-500"><CheckCircle size={15} className="text-sage-400" />Acepta Isapres</div>
                <div className="flex items-center gap-2 text-sage-500"><Clock size={15} className="text-sage-400" />Sesiones de 50 min</div>
              </div>
            </div>
            <div className="bg-sage-500 rounded-2xl p-5 text-white text-center">
              <p className="font-serif text-2xl font-semibold mb-1">$35.000</p>
              <p className="text-sage-100 text-xs mb-4">por sesión · Horario Normal</p>
              <button onClick={() => setShowModal(true)} className="bg-white text-sage-600 hover:bg-sage-50 text-sm font-medium px-5 py-2 rounded-full transition-colors block w-full">
               Reservar Sesión
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showModal && psych && (
  <BookingModal psych={psych} onClose={() => setShowModal(false)} />
)}
    </>
  )
}