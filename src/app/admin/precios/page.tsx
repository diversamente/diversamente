'use client'

import { useState } from 'react'
import { PRICES } from '@/lib/data'
import { Check } from 'lucide-react'

type PriceMap = Record<string, number>

export default function AdminPreciosPage() {
  const [prices, setPrices] = useState<PriceMap>(
    Object.fromEntries(PRICES.map(p => [p.id, p.precio]))
  )
  const [saved, setSaved] = useState(false)

  const update = (id: string, val: string) => {
    const n = parseInt(val)
    if (!isNaN(n)) setPrices(prev => ({ ...prev, [id]: n }))
  }

  const handleSave = () => {
    // In a real app, persist to backend/DB
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const sesiones = PRICES.filter(p => p.tipo === 'sesion')
  const packs    = PRICES.filter(p => p.tipo === 'pack')

  return (
    <div>
      <h1 className="font-serif text-3xl text-sage-900 mb-1">Precios y Tarifas</h1>
      <p className="text-sm text-sage-400 mb-8">Actualiza los valores de sesiones y packs</p>

      <div className="bg-white border border-sage-200 rounded-2xl p-6 mb-6">
        <h2 className="font-serif text-xl text-sage-900 mb-4 pb-3 border-b border-sage-100">Sesiones Individuales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sesiones.map(item => (
            <div key={item.id}>
              <label className="label">{item.nombre}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 text-sm">$</span>
                <input
                  type="number"
                  className="input pl-7"
                  value={prices[item.id]}
                  onChange={e => update(item.id, e.target.value)}
                  step={1000}
                />
              </div>
              <p className="text-xs text-sage-400 mt-1">{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-sage-200 rounded-2xl p-6 mb-6">
        <h2 className="font-serif text-xl text-sage-900 mb-4 pb-3 border-b border-sage-100">Packs con Descuento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packs.map(item => {
            const perSes = Math.round(prices[item.id] / (item.sesiones || 1))
            const saving = (item.sesiones || 1) * (prices['sn-adulto'] || 35000) - prices[item.id]
            return (
              <div key={item.id}>
                <label className="label">{item.nombre} ({item.sesiones} sesiones)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 text-sm">$</span>
                  <input
                    type="number"
                    className="input pl-7"
                    value={prices[item.id]}
                    onChange={e => update(item.id, e.target.value)}
                    step={1000}
                  />
                </div>
                <p className="text-xs text-sage-400 mt-1">
                  ≈ ${perSes.toLocaleString('es-CL')} / sesión · Ahorro: ${Math.max(0, saving).toLocaleString('es-CL')}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary text-sm py-2.5">
          {saved ? <><Check size={14} /> Guardado</> : 'Guardar Precios'}
        </button>
      </div>
    </div>
  )
}
