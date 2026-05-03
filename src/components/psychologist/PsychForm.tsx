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
  PostgradoEntry, ExperienciaEntry, WeekSchedule
} from '@/types'
import { Plus, Trash2, Save } from 'lucide-react'

function emptySchedule(): WeekSchedule {
  return { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], domingo: [] }
}

interface Props {
  initial?: Psychologist
}

export default function PsychForm({ initial }: Props) {
  const router = useRouter()

  // Personal data
  const [nombre,      setNombre]      = useState(initial?.nombre      || '')
  const [universidad, setUniversidad] = useState(initial?.universidad || '')
  const [rut,         setRut]         = useState(initial?.rut         || '')
  const [fechaNac,    setFechaNac]    = useState(initial?.fechaNacimiento || '')
  const [nac,         setNac]         = useState(initial?.nacionalidad || 'Chilena')
  const [tel,         setTel]         = useState(initial?.telefono    || '')
  const [dir,         setDir]         = useState(initial?.direccion   || '')
  const [civil,       setCivil]       = useState(initial?.estadoCivil || '')
  const [correo,      setCorreo]      = useState(initial?.correo      || '')
  const [desc,        setDesc]        = useState(initial?.descripcion || '')

  // Clinical data
  const [enfoque,       setEnfoque]       = useState<Approach | ''>(initial?.enfoque || '')
  const [categorias,    setCategorias]    = useState<Set<Category>>(new Set(initial?.categorias || []))
  const [especialidades, setEspecialidades] = useState<Set<Specialty>>(new Set(initial?.especialidades || []))

  // Dynamic lists
  const [posgrados, setPosgrados] = useState<PostgradoEntry[]>(
    initial?.posgrados || [{ desde: '', hasta: '', institucion: '', titulo: '' }]
  )
  const [experiencia, setExperiencia] = useState<ExperienciaEntry[]>(
    initial?.experiencia || [{ desde: '', hasta: '', institucion: '', funciones: '' }]
  )

  // Schedules
  const [normalSched, setNormalSched] = useState<WeekSchedule>(initial?.horarioNormal || emptySchedule())
  const [primeSched,  setPrimeSched]  = useState<WeekSchedule>(initial?.horarioPrime  || emptySchedule())

  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  // Toggle helpers
  const toggleCat = (c: Category) => {
    const s = new Set(categorias)
    s.has(c) ? s.delete(c) : s.add(c)
    setCategorias(s)
  }
  const toggleSpec = (s: Specialty) => {
    const set = new Set(especialidades)
    set.has(s) ? set.delete(s) : set.add(s)
    setEspecialidades(set)
  }
  const toggleCell = (
    sched: WeekSchedule, setSched: (w: WeekSchedule) => void,
    day: string, hour: string
  ) => {
    const arr = sched[day as keyof WeekSchedule] || []
    const next = arr.includes(hour) ? arr.filter(h => h !== hour) : [...arr, hour]
    setSched({ ...sched, [day]: next })
  }

  // Posgrado helpers
  const updatePosgrado = (i: number, field: keyof PostgradoEntry, val: string) => {
    const arr = [...posgrados]
    arr[i] = { ...arr[i], [field]: val }
    setPosgrados(arr)
  }
  const addPosgrado    = () => setPosgrados([...posgrados, { desde: '', hasta: '', institucion: '', titulo: '' }])
  const removePosgrado = (i: number) => setPosgrados(posgrados.filter((_, j) => j !== i))

  // Experiencia helpers
  const updateExp = (i: number, field: keyof ExperienciaEntry, val: string) => {
    const arr = [...experiencia]
    arr[i] = { ...arr[i], [field]: val }
    setExperiencia(arr)
  }
  const addExp    = () => setExperiencia([...experiencia, { desde: '', hasta: '', institucion: '', funciones: '' }])
  const removeExp = (i: number) => setExperiencia(experiencia.filter((_, j) => j !== i))

  const handleSubmit = () => {
    setError('')
    if (!nombre.trim())      { setError('El nombre es obligatorio.');       return }
    if (!universidad.trim()) { setError('La universidad es obligatoria.');  return }
    if (!enfoque)            { setError('Selecciona un enfoque terapéutico.'); return }
    if (categorias.size === 0) { setError('Selecciona al menos una categoría.'); return }

    setSaving(true)
    const psych: Psychologist = {
      id:            initial?.id || generateId(),
      nombre,
      universidad,
      rut,
      fechaNacimiento: fechaNac,
      nacionalidad:  nac,
      telefono:      tel,
      direccion:     dir,
      estadoCivil:   civil,
      correo,
      descripcion:   desc,
      enfoque:       enfoque as Approach,
      categorias:    [...categorias],
      especialidades: [...especialidades],
      posgrados:     posgrados.filter(p => p.institucion || p.titulo),
      experiencia:   experiencia.filter(e => e.institucion || e.funciones),
      horarioNormal: normalSched,
      horarioPrime:  primeSched,
      activo:        initial?.activo ?? true,
      createdAt:     initial?.createdAt || new Date().toISOString().slice(0, 10),
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

  const Grid2 = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  )

  const Field = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="label">{label}</label>
      {children}
    </div>
  )

  const ScheduleTable = ({
    hours, sched, setSched,
  }: {
    hours: string[]; sched: WeekSchedule; setSched: (w: WeekSchedule) => void
  }) => (
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
                return (
                  <td key={d} className="p-0.5">
                    <button
                      type="button"
                      onClick={() => toggleCell(sched, setSched, d, h)}
                      className={`w-full h-6 rounded transition-colors border ${
                        active
                          ? 'bg-sage-500 border-sage-600'
                          : 'bg-white border-sage-200 hover:bg-sage-100'
                      }`}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      {/* Datos Personales */}
      <Section title="Datos Personales">
        <Grid2>
          <Field label="Nombre Completo *">
            <input className="input" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="María García López" />
          </Field>
          <Field label="RUT">
            <input className="input" value={rut} onChange={e => setRut(e.target.value)} placeholder="12.345.678-9" />
          </Field>
          <Field label="Universidad *">
            <input className="input" value={universidad} onChange={e => setUniversidad(e.target.value)} placeholder="Ej: PUC, U. de Chile..." />
          </Field>
          <Field label="Fecha de Nacimiento">
            <input type="date" className="input" value={fechaNac} onChange={e => setFechaNac(e.target.value)} />
          </Field>
          <Field label="Nacionalidad">
            <input className="input" value={nac} onChange={e => setNac(e.target.value)} placeholder="Chilena" />
          </Field>
          <Field label="Estado Civil">
            <select className="input" value={civil} onChange={e => setCivil(e.target.value)}>
              <option value="">Seleccionar...</option>
              {['Soltero/a','Casado/a','Unión civil','Divorciado/a','Viudo/a'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Teléfono">
            <input className="input" value={tel} onChange={e => setTel(e.target.value)} placeholder="+56 9 1234 5678" />
          </Field>
          <Field label="Correo Electrónico *">
            <input type="email" className="input" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="psicologo@ejemplo.com" />
          </Field>
          <Field label="Dirección" full>
            <input className="input" value={dir} onChange={e => setDir(e.target.value)} placeholder="Calle, número, ciudad" />
          </Field>
          <Field label="Descripción / Presentación *" full>
            <textarea
              className="input min-h-[90px] resize-y"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Descripción profesional que se mostrará en el perfil público..."
            />
          </Field>
        </Grid2>
      </Section>

      {/* Enfoque */}
      <Section title="Enfoque Terapéutico (selección única) *">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {ENFOQUES.map(e => (
            <label
              key={e}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${
                enfoque === e ? 'border-sage-500 bg-sage-50 text-sage-700' : 'border-sage-200 hover:border-sage-400'
              }`}
            >
              <input
                type="radio"
                name="enfoque"
                value={e}
                checked={enfoque === e}
                onChange={() => setEnfoque(e)}
                className="accent-sage-500"
              />
              {e}
            </label>
          ))}
        </div>
      </Section>

      {/* Categorías */}
      <Section title="Categorías de Atención (selección múltiple) *">
        <div className="flex flex-wrap gap-3">
          {CATEGORIAS.map(c => (
            <label
              key={c}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer text-sm transition-colors ${
                categorias.has(c) ? 'border-sage-500 bg-sage-500 text-white' : 'border-sage-200 hover:border-sage-400'
              }`}
            >
              <input type="checkbox" className="sr-only" checked={categorias.has(c)} onChange={() => toggleCat(c)} />
              {c}
            </label>
          ))}
        </div>
      </Section>

      {/* Especialidades */}
      <Section title="Especialidades (selección múltiple)">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {ESPECIALIDADES.map(s => (
            <label
              key={s}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${
                especialidades.has(s) ? 'border-sage-500 bg-sage-50 text-sage-700' : 'border-sage-200 hover:border-sage-400'
              }`}
            >
              <input
                type="checkbox"
                checked={especialidades.has(s)}
                onChange={() => toggleSpec(s)}
                className="accent-sage-500 flex-shrink-0"
              />
              <span className="text-xs">{s}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Posgrados */}
      <Section title="Posgrados / Postítulos">
        <div className="space-y-4">
          {posgrados.map((pg, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-sage-50 rounded-lg relative">
              <div>
                <label className="label">Desde (mes/año)</label>
                <input type="month" className="input" value={pg.desde} onChange={e => updatePosgrado(i, 'desde', e.target.value)} />
              </div>
              <div>
                <label className="label">Hasta (mes/año)</label>
                <input type="month" className="input" value={pg.hasta} onChange={e => updatePosgrado(i, 'hasta', e.target.value)} />
              </div>
              <div>
                <label className="label">Institución</label>
                <input className="input" value={pg.institucion} onChange={e => updatePosgrado(i, 'institucion', e.target.value)} placeholder="Institución" />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="label">Posgrado / Postítulo</label>
                  <input className="input" value={pg.titulo} onChange={e => updatePosgrado(i, 'titulo', e.target.value)} placeholder="Nombre del título" />
                </div>
                {posgrados.length > 1 && (
                  <button onClick={() => removePosgrado(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addPosgrado}
          className="mt-3 text-sm text-sage-500 border border-dashed border-sage-300 px-4 py-2 rounded-lg hover:border-sage-500 transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> Agregar Posgrado
        </button>
      </Section>

      {/* Experiencia */}
      <Section title="Experiencia">
        <div className="space-y-4">
          {experiencia.map((exp, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-sage-50 rounded-lg">
              <div>
                <label className="label">Desde (mes/año)</label>
                <input type="month" className="input" value={exp.desde} onChange={e => updateExp(i, 'desde', e.target.value)} />
              </div>
              <div>
                <label className="label">Hasta (mes/año)</label>
                <input type="month" className="input" value={exp.hasta} onChange={e => updateExp(i, 'hasta', e.target.value)} />
              </div>
              <div>
                <label className="label">Institución</label>
                <input className="input" value={exp.institucion} onChange={e => updateExp(i, 'institucion', e.target.value)} placeholder="Institución" />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="label">Funciones</label>
                  <input className="input" value={exp.funciones} onChange={e => updateExp(i, 'funciones', e.target.value)} placeholder="Descripción del rol" />
                </div>
                {experiencia.length > 1 && (
                  <button onClick={() => removeExp(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addExp}
          className="mt-3 text-sm text-sage-500 border border-dashed border-sage-300 px-4 py-2 rounded-lg hover:border-sage-500 transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> Agregar Experiencia
        </button>
      </Section>

      {/* Schedules */}
      <Section title="Agenda — Horario Normal (08:00–20:00)">
        <p className="text-xs text-sage-400 mb-3">Haz clic en los bloques para marcar disponibilidad</p>
        <ScheduleTable hours={HORARIO_NORMAL} sched={normalSched} setSched={setNormalSched} />
      </Section>

      <Section title="Agenda — Horario Prime (20:00–08:00)">
        <p className="text-xs text-sage-400 mb-3">Haz clic en los bloques para marcar disponibilidad</p>
        <ScheduleTable hours={HORARIO_PRIME} sched={primeSched} setSched={setPrimeSched} />
      </Section>

      {/* Error & Actions */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 mt-2">
        <button
          onClick={() => router.push('/admin/psicologos')}
          className="btn-ghost text-sm border border-sage-200 px-5 py-2.5"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary text-sm py-2.5 disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? 'Guardando...' : (initial ? 'Guardar Cambios' : 'Crear Perfil')}
        </button>
      </div>
    </div>
  )
}
