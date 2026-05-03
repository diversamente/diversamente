'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PsychCard from '@/components/psychologist/PsychCard'
import { CATEGORIAS, ESPECIALIDADES, ENFOQUES } from '@/lib/data'
import { getPsychologists } from '@/lib/store'
import type { Psychologist } from '@/types'
import { Search, SlidersHorizontal, X } from 'lucide-react'

function PsicologosContent() {
  const searchParams = useSearchParams()
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [catFilter, setCatFilter]     = useState(searchParams.get('categoria') || '')
  const [specFilter, setSpecFilter]   = useState(searchParams.get('especialidad') || '')
  const [focusFilter, setFocusFilter] = useState('')
  const [nameFilter, setNameFilter]   = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setPsychologists(getPsychologists().filter(p => p.activo))
  }, [])

  const filtered = psychologists.filter(p => {
    if (catFilter   && !p.categorias.includes(catFilter as never))    return false
    if (specFilter  && !p.especialidades.includes(specFilter as never)) return false
    if (focusFilter && !p.enfoque.toLowerCase().includes(focusFilter.toLowerCase())) return false
    if (nameFilter  && !p.nombre.toLowerCase().includes(nameFilter.toLowerCase()))   return false
    return true
  })

  const clearFilters = () => {
    setCatFilter(''); setSpecFilter(''); setFocusFilter(''); setNameFilter('')
  }
  const hasFilters = catFilter || specFilter || focusFilter || nameFilter

  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="section-tag">Nuestros Profesionales</div>
        <h1 className="font-serif text-4xl text-sage-900 mt-2 mb-2">Encuentra tu Psicólogo</h1>
        <p className="text-sage-400 text-base">Todos nuestros profesionales están certificados y especializados</p>
      </div>

      <main className="container py-10">
        {/* Search bar */}
        <div className="bg-white border border-sage-200 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="label">Categoría</label>
              <select className="input" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                <option value="">Todas las categorías</option>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="label">Especialidad</label>
              <select className="input" value={specFilter} onChange={e => setSpecFilter(e.target.value)}>
                <option value="">Todas las especialidades</option>
                {ESPECIALIDADES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="label">Enfoque Terapéutico</label>
              <select className="input" value={focusFilter} onChange={e => setFocusFilter(e.target.value)}>
                <option value="">Todos los enfoques</option>
                {ENFOQUES.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="label">Nombre</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
                <input
                  type="text"
                  className="input pl-8"
                  placeholder="Buscar por nombre..."
                  value={nameFilter}
                  onChange={e => setNameFilter(e.target.value)}
                />
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost text-sm py-2 text-red-500 hover:bg-red-50">
                <X size={14} /> Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-sage-400">
            {filtered.length === 0
              ? 'Sin resultados'
              : `${filtered.length} psicólogo${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map(p => <PsychCard key={p.id} psych={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-serif text-2xl text-sage-900 mb-2">Sin resultados</h3>
            <p className="text-sage-400 mb-6">No hay profesionales con los filtros seleccionados.</p>
            <button onClick={clearFilters} className="btn-primary">Limpiar filtros</button>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default function PsicologosPage() {
  return (
    <Suspense>
      <PsicologosContent />
    </Suspense>
  )
}
