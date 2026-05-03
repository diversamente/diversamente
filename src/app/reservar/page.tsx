'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getPsychologists } from '@/lib/store'
import { getAvatarColor, getInitials, HORARIO_NORMAL, HORARIO_PRIME, DAY_LABELS } from '@/lib/data'
import type { Psychologist } from '@/types'
import { ChevronLeft, ChevronRight, Check, Calendar, Clock, User, ClipboardList } from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function toDayName(date: Date): string {
  const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  return days[date.getDay()]
}

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const GENEROS = [
  'Femenino','Masculino','No binario','Género fluido','Transgénero femenino',
  'Transgénero masculino','Queer','Intersexual','Prefiero no responder',
]

const NACIONALIDADES = [
  'Chile','Argentina','Bolivia','Brasil','Colombia','Ecuador','España','México',
  'Paraguay','Perú','Uruguay','Venezuela','Otro',
]

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { icon: Calendar,     label: 'Fecha' },
  { icon: Clock,        label: 'Horario' },
  { icon: User,         label: 'Psicólogo' },
  { icon: ClipboardList,label: 'Tus datos' },
]

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const done    = i < current
        const active  = i === current
        return (
          <div key={i} className="flex items-center">
            <div className={`flex flex-col items-center gap-1`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                done   ? 'bg-sage-500 text-white' :
                active ? 'bg-sage-500 text-white ring-4 ring-sage-100' :
                         'bg-sage-100 text-sage-400'
              }`}>
                {done ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <span className={`text-xs font-medium ${active ? 'text-sage-600' : 'text-sage-400'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 h-0.5 mb-5 mx-1 ${i < current ? 'bg-sage-500' : 'bg-sage-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ReservarPage() {
  const [step, setStep]         = useState(0)
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])

  // Step 1 — date
  const today  = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Step 2 — time
  const [selectedHour, setSelectedHour] = useState<string | null>(null)

  // Step 3 — psychologist
  const [selectedPsych, setSelectedPsych] = useState<Psychologist | null>(null)
  const [hoveredPsych,  setHoveredPsych]  = useState<string | null>(null)

  // Step 4 — patient data
  const [form, setForm] = useState({
    nombre: '', apellido: '', rut: '', correo: '',
    telefono: '', nacionalidad: 'Chile',
    fechaNacimiento: '', genero: '',
  })
  const [formError, setFormError] = useState('')

  // Confirmation
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    setPsychologists(getPsychologists().filter(p => p.activo))
  }, [])

  // ── Available hours for selected date ──
  const availableHours: string[] = (() => {
    if (!selectedDate) return []
    const dayName = toDayName(selectedDate)
    const hours = new Set<string>()
    psychologists.forEach(p => {
      const normal = p.horarioNormal[dayName as keyof typeof p.horarioNormal] || []
      const prime  = p.horarioPrime[dayName as keyof typeof p.horarioPrime]   || []
      normal.forEach(h => hours.add(h))
      prime.forEach(h => hours.add(h))
    })
    return [...hours].sort()
  })()

  // ── Psychologists available at selected hour ──
  const availablePsychs: Psychologist[] = (() => {
    if (!selectedDate || !selectedHour) return []
    const dayName = toDayName(selectedDate)
    return psychologists.filter(p => {
      const normal = p.horarioNormal[dayName as keyof typeof p.horarioNormal] || []
      const prime  = p.horarioPrime[dayName as keyof typeof p.horarioPrime]   || []
      return normal.includes(selectedHour) || prime.includes(selectedHour)
    })
  })()

  // ── Calendar ──
  const daysInMonth  = getDaysInMonth(viewYear, viewMonth)
  const firstDayOfMonth = getFirstDayOfMonth(viewYear, viewMonth)
  const blanks = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const hasAvailability = (day: number): boolean => {
    const date    = new Date(viewYear, viewMonth, day)
    const dayName = toDayName(date)
    return psychologists.some(p => {
      const n = p.horarioNormal[dayName as keyof typeof p.horarioNormal] || []
      const r = p.horarioPrime[dayName as keyof typeof p.horarioPrime]   || []
      return n.length > 0 || r.length > 0
    })
  }

  const isPast = (day: number): boolean => {
    const date = new Date(viewYear, viewMonth, day)
    date.setHours(0,0,0,0)
    const t = new Date(); t.setHours(0,0,0,0)
    return date < t
  }

  // ── Form helpers ──
  const updateForm = (field: string, val: string) => setForm(prev => ({ ...prev, [field]: val }))

  const validateForm = () => {
    const req = ['nombre','apellido','rut','correo','telefono','fechaNacimiento']
    for (const f of req) {
      if (!form[f as keyof typeof form].trim()) {
        setFormError(`El campo "${f}" es obligatorio.`)
        return false
      }
    }
    if (!form.correo.includes('@')) { setFormError('Correo inválido.'); return false }
    setFormError('')
    return true
  }

  const handleConfirm = () => {
    if (!validateForm()) return
    setConfirmed(true)
  }

  // ── Confirmation screen ──
  if (confirmed) {
    return (
      <>
        <Navbar />
        <div className="container py-20 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-sage-500" />
          </div>
          <h1 className="font-serif text-3xl text-sage-900 mb-3">¡Reserva confirmada!</h1>
          <p className="text-sage-400 mb-6 leading-relaxed">
            Tu sesión ha sido reservada exitosamente. Recibirás un correo de confirmación en <strong>{form.correo}</strong>.
          </p>
          <div className="bg-sage-50 border border-sage-200 rounded-2xl p-6 text-left mb-8 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-sage-400">Psicólogo/a</span>
              <span className="font-medium text-sage-900">{selectedPsych?.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sage-400">Fecha</span>
              <span className="font-medium text-sage-900">
                {selectedDate?.toLocaleDateString('es-CL', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sage-400">Hora</span>
              <span className="font-medium text-sage-900">{selectedHour} hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sage-400">Paciente</span>
              <span className="font-medium text-sage-900">{form.nombre} {form.apellido}</span>
            </div>
          </div>
          <a href="/" className="btn-primary inline-flex">Volver al inicio</a>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="page-hero">
        <div className="section-tag">Agenda tu sesión</div>
        <h1 className="font-serif text-4xl text-sage-900 mt-2 mb-2">Reservar Cita</h1>
        <p className="text-sage-400 text-base">Elige tu fecha, horario y psicólogo/a ideal</p>
      </div>

      <main className="container py-10 max-w-3xl mx-auto">
        <StepBar current={step} />

        {/* ── STEP 0: Calendar ── */}
        {step === 0 && (
          <div className="bg-white border border-sage-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y=>y-1) } else setViewMonth(m=>m-1) }}
                className="p-2 rounded-lg hover:bg-sage-50 text-sage-500 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="font-serif text-xl text-sage-900">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              <button
                onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y=>y+1) } else setViewMonth(m=>m+1) }}
                className="p-2 rounded-lg hover:bg-sage-50 text-sage-500 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-sage-400 py-2">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: blanks }).map((_, i) => <div key={`b${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day  = i + 1
                const date = new Date(viewYear, viewMonth, day)
                const past = isPast(day)
                const avail = !past && hasAvailability(day)
                const sel  = selectedDate && dayKey(selectedDate) === dayKey(date)
                return (
                  <button
                    key={day}
                    disabled={past || !avail}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square rounded-xl text-sm font-medium transition-all flex items-center justify-center relative
                      ${sel   ? 'bg-sage-500 text-white' :
                        avail  ? 'hover:bg-sage-100 text-sage-900 cursor-pointer' :
                                 'text-sage-300 cursor-not-allowed'}
                    `}
                  >
                    {day}
                    {avail && !sel && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sage-400" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-sage-400">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sage-400 inline-block" /> Disponible</div>
              <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-lg bg-sage-500 inline-block" /> Seleccionado</div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                disabled={!selectedDate}
                onClick={() => setStep(1)}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Hours ── */}
        {step === 1 && (
          <div className="bg-white border border-sage-200 rounded-2xl p-6">
            <h2 className="font-serif text-xl text-sage-900 mb-1">Selecciona un horario</h2>
            <p className="text-sm text-sage-400 mb-6">
              {selectedDate?.toLocaleDateString('es-CL', { weekday:'long', day:'numeric', month:'long' })}
            </p>

            {availableHours.length === 0 ? (
              <p className="text-sage-400 text-sm py-8 text-center">No hay horarios disponibles para este día.</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {availableHours.map(h => (
                  <button
                    key={h}
                    onClick={() => setSelectedHour(h)}
                    className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                      selectedHour === h
                        ? 'bg-sage-500 text-white border-sage-500'
                        : 'border-sage-200 text-sage-700 hover:border-sage-400 hover:bg-sage-50'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(0)} className="btn-ghost border border-sage-200 text-sm px-5">
                ← Volver
              </button>
              <button
                disabled={!selectedHour}
                onClick={() => setStep(2)}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Psychologist ── */}
        {step === 2 && (
          <div className="bg-white border border-sage-200 rounded-2xl p-6">
            <h2 className="font-serif text-xl text-sage-900 mb-1">Elige tu psicólogo/a</h2>
            <p className="text-sm text-sage-400 mb-6">
              Profesionales disponibles el{' '}
              {selectedDate?.toLocaleDateString('es-CL', { weekday:'long', day:'numeric', month:'long' })} a las {selectedHour} hrs
            </p>

            {availablePsychs.length === 0 ? (
              <p className="text-sage-400 text-sm py-8 text-center">No hay psicólogos disponibles en ese horario.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {availablePsychs.map(p => {
                  const color    = getAvatarColor(p.id)
                  const initials = getInitials(p.nombre)
                  const sel      = selectedPsych?.id === p.id
                  const hov      = hoveredPsych === p.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPsych(p)}
                      onMouseEnter={() => setHoveredPsych(p.id)}
                      onMouseLeave={() => setHoveredPsych(null)}
                      className={`rounded-2xl p-4 text-center border transition-all ${
                        sel
                          ? 'border-sage-500 bg-sage-50 ring-2 ring-sage-400 ring-offset-1'
                          : 'border-sage-200 hover:border-sage-400 hover:bg-sage-50'
                      }`}
                    >
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center
                                   text-white font-serif text-2xl font-semibold border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      >
                        {initials}
                      </div>
                      <p className="text-sm font-medium text-sage-900 mb-1">{p.nombre}</p>
                      {hov || sel ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {p.categorias.map(c => (
                            <span key={c} className="badge-cat text-xs">{c}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-sage-400">{p.enfoque.replace('Terapia con enfoque ','').replace('Enfoque ','')}</p>
                      )}
                      {sel && <div className="mt-2"><Check size={16} className="text-sage-500 mx-auto" /></div>}
                    </button>
                  )
                })}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(1)} className="btn-ghost border border-sage-200 text-sm px-5">
                ← Volver
              </button>
              <button
                disabled={!selectedPsych}
                onClick={() => setStep(3)}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Patient data ── */}
        {step === 3 && (
          <div className="bg-white border border-sage-200 rounded-2xl p-6">
            <h2 className="font-serif text-xl text-sage-900 mb-1">Tus datos</h2>
            <p className="text-sm text-sage-400 mb-6">Completa tu información para confirmar la reserva</p>

            {/* Summary */}
            <div className="bg-sage-50 rounded-xl p-4 mb-6 flex flex-wrap gap-4 text-xs text-sage-500">
              <span>📅 {selectedDate?.toLocaleDateString('es-CL', { weekday:'short', day:'numeric', month:'short' })}</span>
              <span>🕐 {selectedHour} hrs</span>
              <span>👤 {selectedPsych?.nombre}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre *</label>
                <input className="input" value={form.nombre} onChange={e => updateForm('nombre', e.target.value)} placeholder="Tu nombre" />
              </div>
              <div>
                <label className="label">Apellido *</label>
                <input className="input" value={form.apellido} onChange={e => updateForm('apellido', e.target.value)} placeholder="Tu apellido" />
              </div>
              <div>
                <label className="label">Cédula / RUT / DNI *</label>
                <input className="input" value={form.rut} onChange={e => updateForm('rut', e.target.value)} placeholder="12.345.678-9" />
              </div>
              <div>
                <label className="label">Correo electrónico *</label>
                <input type="email" className="input" value={form.correo} onChange={e => updateForm('correo', e.target.value)} placeholder="tu@email.com" />
              </div>
              <div>
                <label className="label">Teléfono *</label>
                <input className="input" value={form.telefono} onChange={e => updateForm('telefono', e.target.value)} placeholder="+56 9 1234 5678" />
              </div>
              <div>
                <label className="label">Nacionalidad *</label>
                <select className="input" value={form.nacionalidad} onChange={e => updateForm('nacionalidad', e.target.value)}>
                  {NACIONALIDADES.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Fecha de nacimiento *</label>
                <input type="date" className="input" value={form.fechaNacimiento} onChange={e => updateForm('fechaNacimiento', e.target.value)} />
              </div>
              <div>
                <label className="label">Género <span className="text-sage-400 font-normal">(opcional)</span></label>
                <select className="input" value={form.genero} onChange={e => updateForm('genero', e.target.value)}>
                  <option value="">No responde</option>
                  {GENEROS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {formError && (
              <p className="text-xs text-red-500 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{formError}</p>
            )}

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(2)} className="btn-ghost border border-sage-200 text-sm px-5">
                ← Volver
              </button>
              <button onClick={handleConfirm} className="btn-primary">
                Confirmar reserva ✓
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}