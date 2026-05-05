'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { savePsychologist, generateId } from '@/lib/store'
import {
  ENFOQUES, CATEGORIAS, ESPECIALIDADES,
  DAYS, DAY_LABELS, HORARIO_NORMAL, HORARIO_PRIME
} from '@/lib/data'
import type {
  Psychologist, Approach, Category, Specialty,
  PostgradoEntry, ExperienciaEntry, WeekSchedule, ServicioPrecio
} from '@/types'
import { SERVICIOS_BASE } from '@/types'
import { Plus, Trash2, Save } from 'lucide-react'

function emptySchedule(): WeekSchedule {
  return { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], domingo: [] }
}

interface Props { initial?: Psychologist }

export default function PsychForm({ initial }: Props) {
  const router = useRouter()

  const [nombre,      setNombre]      = useState(initial?.nombre      || '')
  const [universidad, setUniversidad] = useState(initial?.universidad || '')
  const [rut,         setRut]         = useState(initial?.rut         || '')
  const [registroSIS, setRegistroSIS] = useState((initial as any)?.registroSIS || '')
  const [fechaNac,    setFechaNac]    = useState(initial?.fechaNacimiento || '')
  const [nac,         setNac]         = useState(initial?.nacionalidad || 'Chilena')
  const [tel,         setTel]         = useState(initial?.telefono    || '')
  const [dir,         setDir]         = useState(initial?.direccion   || '')
  const [civil,       setCivil]       = useState(initial?.estadoCivil || '')
  const [correo,      setCorreo]      = useState(initial?.correo      || '')
  const [desc,        setDesc]        = useState(initial?.descripcion || '')

  const [enfoque,        setEnfoque]        = useState<Approach | ''>(initial?.enfoque || '')
  const [categorias,     setCategorias]     = useState<Set<Category>>(new Set(initial?.categorias || []))
  const [especialidades, setEspecialidades] = useState<Set<Specialty>>(new Set(initial?.especialidades || []))

  const [posgrados,   setPosgrados]   = useState<PostgradoEntry[]>(initial?.posgrados   || [{ desde: '', hasta: '', institucion: '', titulo: '' }])
  const [experiencia, setExperiencia] = useState<ExperienciaEntry[]>(initial?.experiencia || [{ desde: '', hasta: '', institucion: '', funciones: '' }])

  const [normalSched, setNormalSched] = useState<WeekSchedule>(initial?.horarioNormal || emptySchedule())
  const [primeSched,  setPrimeSched]  = useState<WeekSchedule>(initial?.horarioPrime  || emptySchedule())

  const [servicios, setServicios] = useState<ServicioPrecio[]>(
    (initial as any)?.servicios || SERVICIOS_BASE.map(s => ({ ...s, precio: s.horario === 'normal' ? 35000 : 45000 }))
  )

  const [cellServices,    setCellServices]    = useState<Record<string, string[]>>((initial as any)?.cellServices || {})
  const [activeCellMenu,  setActiveCellMenu]  = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  // Estado local de texto para inputs de precio (evita perder foco al re-renderizar)
  const [precioTexto, setPrecioTexto] = useState<Record<string, string>>(() => {
    const svcs = (initial as any)?.servicios || SERVICIOS_BASE.map((s: any) => ({ ...s, precio: s.horario === 'normal' ? 35000 : 45000 }))
    return Object.fromEntries(svcs.map((s: any) => [s.id, String(s.precio || 0)]))
  })

  const toggleCat = (c: Category) => {
    const s = new Set(categorias); s.has(c) ? s.delete(c) : s.add(c); setCategorias(s)
  }
  const toggleSpec = (s: Specialty) => {
    const set = new Set(especialidades); set.has(s) ? set.delete(s) : set.add(s); setEspecialidades(set)
  }

  const toggleCell = (sched: WeekSchedule, setSched: (w: WeekSchedule) => void, day: string, hour: string) => {
    const arr  = sched[day as keyof WeekSchedule] || []
    const next = arr.includes(hour) ? arr.filter(h => h !== hour) : [...arr, hour]
    setSched({ ...sched, [day]: next })
    const key = `${day}-${hour}`
    if (!next.includes(hour)) {
      const nc = { ...cellServices }; delete nc[key]; setCellServices(nc)
      if (activeCellMenu === key) setActiveCellMenu(null)
    }
  }

  const toggleCellService = (day: string, hour: string, serviceId: string) => {
    const key  = `${day}-${hour}`
    const curr = cellServices[key] || []
    const next = curr.includes(serviceId) ? curr.filter(id => id !== serviceId) : [...curr, serviceId]
    setCellServices({ ...cellServices, [key]: next })
  }

  const updateServicioPrecio = (id: string, precio: number) => {
    setServicios(prev => prev.map(s => s.id === id ? { ...s, precio } : s))
  }

  const updatePosgrado = (i: number, field: keyof PostgradoEntry, val: string) => {
    const arr = [...posgrados]; arr[i] = { ...arr[i], [field]: val }; setPosgrados(arr)
  }
  const addPosgrado    = () => setPosgrados([...posgrados, { desde: '', hasta: '', institucion: '', titulo: '' }])
  const removePosgrado = (i: number) => setPosgrados(posgrados.filter((_, j) => j !== i))

  const updateExp = (i: number, field: keyof ExperienciaEntry, val: string) => {
    const arr = [...experiencia]; arr[i] = { ...arr[i], [field]: val }; setExperiencia(arr)
  }
  const addExp    = () => setExperiencia([...experiencia, { desde: '', hasta: '', institucion: '', funciones: '' }])
  const removeExp = (i: number) => setExperiencia(experiencia.filter((_, j) => j !== i))

  const handleSubmit = () => {
    setError('')
    if (!nombre.trim())        { setError('El nombre es obligatorio.');          return }
    if (!universidad.trim())   { setError('La universidad es obligatoria.');     return }
    if (!enfoque)              { setError('Selecciona un enfoque terapéutico.'); return }
    if (categorias.size === 0) { setError('Selecciona al menos una categoría.'); return }
    setSaving(true)
    const psych: any = {
      id: initial?.id || generateId(),
      nombre, universidad, rut, registroSIS,
      fechaNacimiento: fechaNac, nacionalidad: nac,
      telefono: tel, direccion: dir, estadoCivil: civil, correo,
      descripcion: desc,
      enfoque: enfoque as Approach,
      categorias: [...categorias],
      especialidades: [...especialidades],
      posgrados:   posgrados.filter(p => p.institucion || p.titulo),
      experiencia: experiencia.filter(e => e.institucion || e.funciones),
      horarioNormal: normalSched,
      horarioPrime:  primeSched,
      servicios, cellServices,
      activo:    initial?.activo ?? true,
      createdAt: initial?.createdAt || new Date().toISOString().slice(0, 10),
    }
    savePsychologist(psych)
    setSaving(false)
    router.push('/admin/psicologos')
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white border border-sage-200 rounded-2xl p-6 mb-5">
      <h3 className="text-sm font-medium text-sage-500 pb-3 mb-4 border-b border-sage-100">{title}</h3>
      {children}
    </div>
  )

  const ScheduleTable = ({ hours, sched, setSched, type }: {
    hours: string[]; sched: WeekSchedule; setSched: (w: WeekSchedule) => void; type: 'normal' | 'prime'
  }) => {
    const relevantServices = servicios.filter(s => s.horario === type && isEnabled(s.id.includes('adulto') ? 'Adulto' : s.id.includes('infanto') ? 'Infanto-Juvenil' : 'Pareja/Familia'))
    return (
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse" style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th className="text-sage-400 text-right pr-3 pb-1 w-14" />
              {DAYS.map(d => (
                <th key={d} className="bg-sage-50 rounded px-1 pb-1 text-sage-500 font-medium text-center w-16">
                  {DAY_LABELS[d]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(h => (
              <tr key={h}>
                <td className="text-sage-400 text-right pr-3 py-0.5">{h}</td>
                {DAYS.map(d => {
                  const active = (sched[d as keyof WeekSchedule] || []).includes(h)
                  const key    = `${d}-${h}`
                  const isOpen = activeCellMenu === key
                  const selectedSvcs = cellServices[key] || []
                  return (
                    <td key={d} className="p-0.5 relative">
                      <button type="button"
                        onClick={() => {
                          toggleCell(sched, setSched, d, h)
                          if (!active) setActiveCellMenu(key)
                          else setActiveCellMenu(null)
                        }}
                        className={`w-full h-6 rounded transition-colors border ${active ? 'bg-sage-500 border-sage-600' : 'bg-white border-sage-200 hover:bg-sage-100'}`}
                      />
                      {active && (
                        <button type="button"
                          onClick={() => setActiveCellMenu(isOpen ? null : key)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full text-white flex items-center justify-center z-10 text-xs font-bold"
                        >
                          {selectedSvcs.length > 0 ? selectedSvcs.length : '+'}
                        </button>
                      )}
                      {active && isOpen && (
                        <div className="absolute top-7 left-0 z-50 bg-white border border-sage-200 rounded-xl shadow-lg p-2 w-52">
                          <p className="text-xs font-medium text-sage-500 mb-2">Servicios en {DAY_LABELS[d]} {h}</p>
                          {relevantServices.map(svc => (
                            <label key={svc.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-sage-50 rounded px-1">
                              <input type="checkbox" checked={selectedSvcs.includes(svc.id)} onChange={() => toggleCellService(d, h, svc.id)} className="accent-sage-500" />
                              <span className="text-xs text-sage-700">{svc.nombre}</span>
                            </label>
                          ))}
                          <button onClick={() => setActiveCellMenu(null)} className="mt-2 text-xs text-sage-400 hover:text-sage-600 w-full text-right">Cerrar ✕</button>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const PRECIO_ITEMS = [
    { id: 'adulto-normal',  nombre: 'Adulto',          cat: 'Adulto',           horario: 'normal' as const },
    { id: 'infanto-normal', nombre: 'Infanto-Juvenil', cat: 'Infanto-Juvenil',  horario: 'normal' as const },
    { id: 'pareja-normal',  nombre: 'Pareja/Familia',  cat: 'Pareja/Familia',   horario: 'normal' as const },
    { id: 'adulto-prime',   nombre: 'Adulto',          cat: 'Adulto',           horario: 'prime'  as const },
    { id: 'infanto-prime',  nombre: 'Infanto-Juvenil', cat: 'Infanto-Juvenil',  horario: 'prime'  as const },
    { id: 'pareja-prime',   nombre: 'Pareja/Familia',  cat: 'Pareja/Familia',   horario: 'prime'  as const },
  ]

  const isEnabled = (cat: string) =>
    categorias.has(cat as Category)

  return (
    <div>
      {/* Datos Personales */}
      <Section title="Datos Personales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="label">Nombre Completo *</label><input className="input" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="María García López" /></div>
          <div><label className="label">RUT</label><input className="input" value={rut} onChange={e => setRut(e.target.value)} placeholder="12.345.678-9" /></div>
          <div><label className="label">Número Registro SIS</label><input className="input" value={registroSIS} onChange={e => setRegistroSIS(e.target.value)} placeholder="Ej: SIS-12345" /></div>
          <div><label className="label">Universidad *</label><input className="input" value={universidad} onChange={e => setUniversidad(e.target.value)} placeholder="Ej: PUC, U. de Chile..." /></div>
          <div><label className="label">Fecha de Nacimiento</label><input type="date" className="input" value={fechaNac} onChange={e => setFechaNac(e.target.value)} /></div>
          <div><label className="label">Nacionalidad</label><input className="input" value={nac} onChange={e => setNac(e.target.value)} placeholder="Chilena" /></div>
          <div><label className="label">Estado Civil</label>
            <select className="input" value={civil} onChange={e => setCivil(e.target.value)}>
              <option value="">Seleccionar...</option>
              {['Soltero/a','Casado/a','Unión civil','Divorciado/a','Viudo/a'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div><label className="label">Teléfono</label><input className="input" value={tel} onChange={e => setTel(e.target.value)} placeholder="+56 9 1234 5678" /></div>
          <div><label className="label">Correo Electrónico *</label><input type="email" className="input" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="psicologo@ejemplo.com" /></div>
          <div className="md:col-span-2"><label className="label">Dirección</label><input className="input" value={dir} onChange={e => setDir(e.target.value)} placeholder="Calle, número, ciudad" /></div>
          <div className="md:col-span-2"><label className="label">Descripción / Presentación *</label><textarea className="input min-h-[90px] resize-y" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción profesional..." /></div>
        </div>
      </Section>

      {/* Enfoque */}
      <Section title="Enfoque Terapéutico (selección única) *">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {ENFOQUES.map(e => (
            <label key={e} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${enfoque === e ? 'border-sage-500 bg-sage-50 text-sage-700' : 'border-sage-200 hover:border-sage-400'}`}>
              <input type="radio" name="enfoque" value={e} checked={enfoque === e} onChange={() => setEnfoque(e)} className="accent-sage-500" />
              {e}
            </label>
          ))}
        </div>
      </Section>

      {/* Categorías */}
      <Section title="Categorías de Atención (selección múltiple) *">
        <div className="flex flex-wrap gap-3">
          {CATEGORIAS.map(c => (
            <label key={c} className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer text-sm transition-colors ${categorias.has(c) ? 'border-sage-500 bg-sage-500 text-white' : 'border-sage-200 hover:border-sage-400'}`}>
              <input type="checkbox" className="sr-only" checked={categorias.has(c)} onChange={() => toggleCat(c)} />
              {c}
            </label>
          ))}
        </div>
      </Section>

      {/* Servicios y Precios */}
      <Section title="Servicios y Precios por Sesión">
        <p className="text-xs text-sage-400 mb-4">Los precios se habilitan según las categorías seleccionadas arriba.</p>
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sage-400 inline-block" /> Horario Normal (08:00–20:00)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRECIO_ITEMS.filter(i => i.horario === 'normal').map(item => {
                const enabled = isEnabled(item.cat)
                const svc = servicios.find(s => s.id === item.id)
                return (
                  <div key={item.id} className={`border rounded-xl p-3 transition-all ${enabled ? 'border-sage-200 bg-white' : 'border-sage-100 bg-sage-50 opacity-50'}`}>
                    <label className="label mb-2">{item.nombre}</label>
                    {enabled ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 text-sm">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          className="input pl-7"
                          value={precioTexto[item.id] ?? String(svc?.precio || '')}
                          onChange={e => {
                            const val = e.target.value.replace(/[^0-9]/g, '')
                            setPrecioTexto(prev => ({ ...prev, [item.id]: val }))
                            updateServicioPrecio(item.id, parseInt(val) || 0)
                          }}
                        />
                      </div>
                    ) : (
                      <div className="input bg-sage-100 text-sage-300 text-sm cursor-not-allowed">Servicio no habilitado</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: '#c8a96e' }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#c8a96e' }} /> Horario Prime (20:00–08:00)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRECIO_ITEMS.filter(i => i.horario === 'prime').map(item => {
                const enabled = isEnabled(item.cat)
                const svc = servicios.find(s => s.id === item.id)
                return (
                  <div key={item.id} className={`border rounded-xl p-3 transition-all ${enabled ? 'border-sage-200 bg-white' : 'border-sage-100 bg-sage-50 opacity-50'}`}>
                    <label className="label mb-2">{item.nombre}</label>
                    {enabled ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 text-sm">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          className="input pl-7"
                          value={precioTexto[item.id] ?? String(svc?.precio || '')}
                          onChange={e => {
                            const val = e.target.value.replace(/[^0-9]/g, '')
                            setPrecioTexto(prev => ({ ...prev, [item.id]: val }))
                            updateServicioPrecio(item.id, parseInt(val) || 0)
                          }}
                        />
                      </div>
                    ) : (
                      <div className="input bg-sage-100 text-sage-300 text-sm cursor-not-allowed">Servicio no habilitado</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* Especialidades */}
      <Section title="Especialidades (selección múltiple)">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {ESPECIALIDADES.map(s => (
            <label key={s} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${especialidades.has(s) ? 'border-sage-500 bg-sage-50 text-sage-700' : 'border-sage-200 hover:border-sage-400'}`}>
              <input type="checkbox" checked={especialidades.has(s)} onChange={() => toggleSpec(s)} className="accent-sage-500 flex-shrink-0" />
              <span className="text-xs">{s}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Posgrados */}
      <Section title="Posgrados / Postítulos">
        <div className="space-y-4">
          {posgrados.map((pg, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-sage-50 rounded-lg">
              <div><label className="label">Desde</label><input type="month" className="input" value={pg.desde} onChange={e => updatePosgrado(i, 'desde', e.target.value)} /></div>
              <div><label className="label">Hasta</label><input type="month" className="input" value={pg.hasta} onChange={e => updatePosgrado(i, 'hasta', e.target.value)} /></div>
              <div><label className="label">Institución</label><input className="input" value={pg.institucion} onChange={e => updatePosgrado(i, 'institucion', e.target.value)} placeholder="Institución" /></div>
              <div className="flex gap-2 items-end">
                <div className="flex-1"><label className="label">Título</label><input className="input" value={pg.titulo} onChange={e => updatePosgrado(i, 'titulo', e.target.value)} placeholder="Nombre del título" /></div>
                {posgrados.length > 1 && <button onClick={() => removePosgrado(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5"><Trash2 size={15} /></button>}
              </div>
            </div>
          ))}
        </div>
        <button onClick={addPosgrado} className="mt-3 text-sm text-sage-500 border border-dashed border-sage-300 px-4 py-2 rounded-lg hover:border-sage-500 transition-colors flex items-center gap-1">
          <Plus size={14} /> Agregar Posgrado
        </button>
      </Section>

      {/* Experiencia */}
      <Section title="Experiencia">
        <div className="space-y-4">
          {experiencia.map((exp, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-sage-50 rounded-lg">
              <div><label className="label">Desde</label><input type="month" className="input" value={exp.desde} onChange={e => updateExp(i, 'desde', e.target.value)} /></div>
              <div><label className="label">Hasta</label><input type="month" className="input" value={exp.hasta} onChange={e => updateExp(i, 'hasta', e.target.value)} /></div>
              <div><label className="label">Institución</label><input className="input" value={exp.institucion} onChange={e => updateExp(i, 'institucion', e.target.value)} placeholder="Institución" /></div>
              <div className="flex gap-2 items-end">
                <div className="flex-1"><label className="label">Funciones</label><input className="input" value={exp.funciones} onChange={e => updateExp(i, 'funciones', e.target.value)} placeholder="Descripción del rol" /></div>
                {experiencia.length > 1 && <button onClick={() => removeExp(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5"><Trash2 size={15} /></button>}
              </div>
            </div>
          ))}
        </div>
        <button onClick={addExp} className="mt-3 text-sm text-sage-500 border border-dashed border-sage-300 px-4 py-2 rounded-lg hover:border-sage-500 transition-colors flex items-center gap-1">
          <Plus size={14} /> Agregar Experiencia
        </button>
      </Section>

      {/* Horario Normal */}
      <Section title="Agenda — Horario Normal (08:00–20:00)">
        <p className="text-xs text-sage-400 mb-2">Haz clic para marcar disponibilidad. Luego haz clic en <span className="bg-amber-400 text-white px-1 rounded text-xs">+</span> para asignar servicios a cada bloque.</p>
        <ScheduleTable hours={HORARIO_NORMAL} sched={normalSched} setSched={setNormalSched} type="normal" />
      </Section>

      {/* Horario Prime */}
      <Section title="Agenda — Horario Prime (20:00–08:00)">
        <p className="text-xs text-sage-400 mb-2">Haz clic para marcar disponibilidad. Luego haz clic en <span className="bg-amber-400 text-white px-1 rounded text-xs">+</span> para asignar servicios a cada bloque.</p>
        <ScheduleTable hours={HORARIO_PRIME} sched={primeSched} setSched={setPrimeSched} type="prime" />
      </Section>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

      <div className="flex items-center justify-end gap-3 mt-2">
        <button onClick={() => router.push('/admin/psicologos')} className="btn-ghost text-sm border border-sage-200 px-5 py-2.5">Cancelar</button>
        <button onClick={handleSubmit} disabled={saving} className="btn-primary text-sm py-2.5 disabled:opacity-60">
          <Save size={15} />
          {saving ? 'Guardando...' : (initial ? 'Guardar Cambios' : 'Crear Perfil')}
        </button>
      </div>
    </div>
  )
}
