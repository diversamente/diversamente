'use client'

import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { getAvatarColor, getInitials } from '@/lib/data'
import { getPsychologists } from '@/lib/store'
import type { Psychologist } from '@/types'
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react'

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAY_LABELS  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
const NORMAL_HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']
const PRIME_HOURS  = ['20:00','21:00','22:00','23:00','00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00']
const GENEROS      = ['Femenino','Masculino','No binario','Género fluido','Transgénero femenino','Transgénero masculino','Queer','Intersexual','Prefiero no responder']
const NACIONALIDADES = ['Chile','Argentina','Bolivia','Brasil','Colombia','Ecuador','España','México','Paraguay','Perú','Uruguay','Venezuela','Otro']

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay() }
function dayKey(d: Date) { return d.toISOString().slice(0, 10) }
function toDayName(d: Date) {
  return ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'][d.getDay()]
}

function getNextAvailableDate(psych: Psychologist): Date {
  const today = new Date()
  for (let i = 0; i < 60; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dayName = toDayName(date)
    const n = psych.horarioNormal[dayName as keyof typeof psych.horarioNormal] || []
    const r = psych.horarioPrime[dayName as keyof typeof psych.horarioPrime] || []
    if (n.length > 0 || r.length > 0) return date
  }
  return today
}

interface Props {
  psych: Psychologist
  onClose: () => void
}

export default function BookingModal({ psych, onClose }: Props) {
  const today = new Date()
  const nextAvail = getNextAvailableDate(psych)

  const [step, setStep] = useState(0)
  const [viewYear,  setViewYear]  = useState(nextAvail.getFullYear())
  const [viewMonth, setViewMonth] = useState(nextAvail.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date>(nextAvail)
  const [selectedHour, setSelectedHour] = useState<string | null>(null)
  const [enviando, setEnviando]   = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellido: '', rut: '', correo: '',
    telefono: '', nacionalidad: 'Chile', fechaNacimiento: '', genero: '',
  })
  const [formError, setFormError] = useState('')

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const getHours = (date: Date, type: 'normal' | 'prime'): string[] => {
    const dayName = toDayName(date)
    const source = type === 'normal' ? NORMAL_HOURS : PRIME_HOURS
    const sched = type === 'normal'
      ? (psych.horarioNormal[dayName as keyof typeof psych.horarioNormal] || [])
      : (psych.horarioPrime[dayName as keyof typeof psych.horarioPrime] || [])
    return source.filter(h => sched.includes(h))
  }

  const normalHours = getHours(selectedDate, 'normal')
  const primeHours  = getHours(selectedDate, 'prime')

  const hasAvail = (day: number): boolean => {
    const date = new Date(viewYear, viewMonth, day)
    const dn   = toDayName(date)
    const n = psych.horarioNormal[dn as keyof typeof psych.horarioNormal] || []
    const r = psych.horarioPrime[dn as keyof typeof psych.horarioPrime] || []
    return n.length > 0 || r.length > 0
  }

  const isPast = (day: number): boolean => {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0,0,0,0)
    const t = new Date(); t.setHours(0,0,0,0)
    return d < t
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const blanks      = (() => { const f = getFirstDay(viewYear, viewMonth); return f === 0 ? 6 : f - 1 })()

  const handleSelectDate = (date: Date) => { setSelectedDate(date); setSelectedHour(null) }

  const updateForm = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))

  const validateForm = () => {
    for (const f of ['nombre','apellido','rut','correo','telefono','fechaNacimiento']) {
      if (!form[f as keyof typeof form].trim()) { setFormError(`El campo "${f}" es obligatorio.`); return false }
    }
    if (!form.correo.includes('@')) { setFormError('Correo inválido.'); return false }
    setFormError(''); return true
  }

  const handleConfirm = async () => {
    if (!validateForm()) return
    setEnviando(true)
    try {
      await emailjs.send('service_0xphe5u', 'template_rpizgks', {
        nombre: form.nombre, apellido: form.apellido,
        correo_paciente: form.correo,
        fecha: selectedDate.toLocaleDateString('es-CL', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
        hora: selectedHour, psicologo: psych.nombre, email: form.correo,
      }, 'kz-6k1TsDkp6S2kxL')
    } catch (e) { console.error(e) }
    setEnviando(false)
    setConfirmed(true)
  }

  const color    = getAvatarColor(psych.id)
  const initials = getInitials(psych.nombre)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sage-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-serif text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: color }}>
              {initials}
            </div>
            <div>
              <p className="font-medium text-sage-900 text-sm">{psych.nombre}</p>
              <p className="text-xs text-sage-400">{psych.enfoque.replace('Terapia con enfoque ','').replace('Enfoque ','')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-sage-50 text-sage-400 hover:text-sage-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {['Fecha y hora','Tus datos','Confirmación'].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                  i === step ? 'bg-sage-500 text-white' :
                  i < step   ? 'bg-sage-100 text-sage-500' :
                               'text-sage-300'
                }`}>
                  {i < step && <Check size={11} />}
                  {s}
                </div>
                {i < 2 && <div className={`w-6 h-0.5 ${i < step ? 'bg-sage-400' : 'bg-sage-100'}`} />}
              </div>
            ))}
          </div>

          {/* STEP 0: Calendar + Hours */}
          {step === 0 && (
            <div className="flex gap-5">
              {/* Calendar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y=>y-1) } else setViewMonth(m=>m-1) }}
                    className="p-1.5 rounded-lg hover:bg-sage-50 text-sage-500">
                    <ChevronLeft size={15} />
                  </button>
                  <span className="font-serif text-sm text-sage-900">{MONTH_NAMES[viewMonth]} {viewYear}</span>
                  <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y=>y+1) } else setViewMonth(m=>m+1) }}
                    className="p-1.5 rounded-lg hover:bg-sage-50 text-sage-500">
                    <ChevronRight size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-1">
                  {DAY_LABELS.map(d => <div key={d} className="text-center text-xs text-sage-400 py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7">
                  {Array.from({ length: blanks }).map((_, i) => <div key={`b${i}`} className="aspect-square" />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day  = i + 1
                    const date = new Date(viewYear, viewMonth, day)
                    const past = isPast(day)
                    const avail = !past && hasAvail(day)
                    const sel  = dayKey(selectedDate) === dayKey(date)
                    return (
                      <button key={day} disabled={past || !avail} onClick={() => handleSelectDate(date)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all
                          ${sel   ? 'bg-sage-500 text-white' :
                            avail  ? 'hover:bg-sage-100 text-sage-900 cursor-pointer' :
                                     'text-sage-200 cursor-not-allowed'}`}>
                        <span>{day}</span>
                        {avail && !sel && <span className="w-1 h-1 rounded-full bg-sage-400 mt-0.5 block" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Hours */}
              <div className="w-48 flex-shrink-0 border-l border-sage-100 pl-5">
                <p className="text-xs font-medium text-sage-700 mb-3">
                  {selectedDate.toLocaleDateString('es-CL', { weekday:'long', day:'numeric', month:'short' })}
                </p>
                {normalHours.length === 0 && primeHours.length === 0 ? (
                  <p className="text-xs text-sage-400">Sin horarios disponibles.</p>
                ) : (
                  <div className="space-y-4">
                    {normalHours.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-sage-500 mb-2">Normal 08:00–20:00</p>
                        <div className="flex flex-wrap gap-1.5">
                          {normalHours.map(h => (
                            <button key={h} onClick={() => setSelectedHour(h)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                selectedHour === h ? 'bg-sage-500 text-white border-sage-500' : 'border-sage-200 text-sage-700 hover:border-sage-400'
                              }`}>{h}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {primeHours.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#c8a96e' }}>Prime desde 20:00</p>
                        <div className="flex flex-wrap gap-1.5">
                          {primeHours.map(h => (
                            <button key={h} onClick={() => setSelectedHour(h)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                selectedHour === h ? 'text-white border-transparent' : 'border-sage-200 text-sage-700 hover:border-amber-300'
                              }`}
                              style={selectedHour === h ? { backgroundColor: '#c8a96e' } : {}}>{h}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button disabled={!selectedHour} onClick={() => setStep(1)}
                  className="btn-primary w-full justify-center text-xs py-2 mt-6 disabled:opacity-40">
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Form */}
          {step === 1 && (
            <div>
              <div className="bg-sage-50 rounded-xl p-3 mb-4 flex flex-wrap gap-3 text-xs text-sage-500">
                <span>📅 {selectedDate.toLocaleDateString('es-CL', { weekday:'short', day:'numeric', month:'short' })}</span>
                <span>🕐 {selectedHour} hrs</span>
                <span>👤 {psych.nombre}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Nombre *</label><input className="input" value={form.nombre} onChange={e => updateForm('nombre', e.target.value)} placeholder="Tu nombre" /></div>
                <div><label className="label">Apellido *</label><input className="input" value={form.apellido} onChange={e => updateForm('apellido', e.target.value)} placeholder="Tu apellido" /></div>
                <div><label className="label">RUT / DNI *</label><input className="input" value={form.rut} onChange={e => updateForm('rut', e.target.value)} placeholder="12.345.678-9" /></div>
                <div><label className="label">Correo *</label><input type="email" className="input" value={form.correo} onChange={e => updateForm('correo', e.target.value)} placeholder="tu@email.com" /></div>
                <div><label className="label">Teléfono *</label><input className="input" value={form.telefono} onChange={e => updateForm('telefono', e.target.value)} placeholder="+56 9 1234 5678" /></div>
                <div><label className="label">Nacionalidad *</label>
                  <select className="input" value={form.nacionalidad} onChange={e => updateForm('nacionalidad', e.target.value)}>
                    {NACIONALIDADES.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div><label className="label">Fecha de nacimiento *</label><input type="date" className="input" value={form.fechaNacimiento} onChange={e => updateForm('fechaNacimiento', e.target.value)} /></div>
                <div><label className="label">Género <span className="text-sage-400 font-normal">(opcional)</span></label>
                  <select className="input" value={form.genero} onChange={e => updateForm('genero', e.target.value)}>
                    <option value="">No responde</option>
                    {GENEROS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              {formError && <p className="text-xs text-red-500 mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>}
              <div className="flex justify-between mt-5">
                <button onClick={() => setStep(0)} className="btn-ghost border border-sage-200 text-sm px-4 py-2">← Volver</button>
                <button onClick={handleConfirm} disabled={enviando} className="btn-primary text-sm py-2 disabled:opacity-60">
                  {enviando ? 'Enviando...' : 'Confirmar reserva ✓'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Confirmed */}
          {confirmed && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-sage-500" />
              </div>
              <h3 className="font-serif text-2xl text-sage-900 mb-2">¡Reserva confirmada!</h3>
              <p className="text-sm text-sage-400 mb-5">
                Recibirás un correo en <strong>{form.correo}</strong>
              </p>
              <div className="bg-sage-50 rounded-xl p-4 text-left space-y-2 text-sm mb-5">
                <div className="flex justify-between"><span className="text-sage-400">Psicólogo/a</span><span className="font-medium">{psych.nombre}</span></div>
                <div className="flex justify-between"><span className="text-sage-400">Fecha</span>
                  <span className="font-medium">{selectedDate.toLocaleDateString('es-CL', { weekday:'long', day:'numeric', month:'long' })}</span>
                </div>
                <div className="flex justify-between"><span className="text-sage-400">Hora</span><span className="font-medium">{selectedHour} hrs</span></div>
                <div className="flex justify-between"><span className="text-sage-400">Paciente</span><span className="font-medium">{form.nombre} {form.apellido}</span></div>
              </div>
              <button onClick={onClose} className="btn-primary text-sm">Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
