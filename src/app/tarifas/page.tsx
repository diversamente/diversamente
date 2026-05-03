import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { PRICES } from '@/lib/data'
import { Check } from 'lucide-react'

const SESSION_FEATURES: Record<string, string[]> = {
  'sn-adulto':  ['Psicólogo certificado', 'Videollamada HD', 'Lun–Vie 08:00–20:00', 'Resumen de sesión'],
  'sn-infanto': ['Especialista niños y adolescentes', 'Videollamada HD', 'Lun–Vie 08:00–20:00', 'Informe para padres'],
  'sp-adulto':  ['Psicólogo certificado', 'Videollamada HD', 'Horario extendido prime', 'Fines de semana disponible'],
  'sp-pareja':  ['Especialista en parejas', 'Videollamada grupal', 'Lun–Dom todos los horarios', 'Plan de seguimiento'],
}

const PACK_FEATURES: Record<string, string[]> = {
  'pack-inicio':  ['3 sesiones individuales', 'Validez 2 meses', 'Mismo psicólogo garantizado'],
  'pack-proceso': ['6 sesiones individuales', 'Validez 4 meses', 'Mismo psicólogo garantizado', 'Sesión de seguimiento gratis'],
  'pack-trans':   ['12 sesiones individuales', 'Validez 6 meses', 'Mismo psicólogo garantizado', '2 sesiones de seguimiento', 'Informe de progreso'],
}

function formatPrice(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

export default function TarifasPage() {
  const sesiones = PRICES.filter(p => p.tipo === 'sesion')
  const packs    = PRICES.filter(p => p.tipo === 'pack')

  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="section-tag">Transparencia Total</div>
        <h1 className="font-serif text-4xl text-sage-900 mt-2 mb-2">Planes y Tarifas</h1>
        <p className="text-sage-400 text-base">Sin costos ocultos. Invierte en tu bienestar mental.</p>
      </div>

      <main className="container py-12">
        {/* Sessions */}
        <div className="section-tag mb-2">Sesiones Individuales</div>
        <h2 className="font-serif text-3xl text-sage-900 mb-2">Elige tu sesión</h2>
        <p className="text-sage-400 mb-8">Horario Normal (08:00–20:00) y Horario Prime (20:00–08:00)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {sesiones.map(item => (
            <div
              key={item.id}
              className={`rounded-2xl p-6 border flex flex-col ${
                item.destacado
                  ? 'border-sage-500 bg-sage-50 ring-2 ring-sage-400 ring-offset-1'
                  : 'border-sage-200 bg-white'
              }`}
            >
              {item.destacado && (
                <span className="bg-sage-500 text-white text-xs font-medium px-3 py-1 rounded-full self-start mb-3">
                  Más solicitado
                </span>
              )}
              <p className="text-xs font-medium text-sage-500 mb-2">{item.nombre}</p>
              <p className="font-serif text-4xl text-sage-900 leading-none">
                <span className="text-xl">$</span>
                {(item.precio / 1000).toLocaleString('es-CL')}.000
              </p>
              <p className="text-xs text-sage-400 mb-5 mt-1">{item.descripcion}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {(SESSION_FEATURES[item.id] || []).map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-sage-500">
                    <Check size={13} className="text-sage-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/psicologos" className="btn-primary text-sm justify-center py-2">
                Reservar
              </Link>
            </div>
          ))}
        </div>

        {/* Packs */}
        <div className="section-tag mb-2">Packs con Descuento</div>
        <h2 className="font-serif text-3xl text-sage-900 mb-2">Ahorra con nuestros packs</h2>
        <p className="text-sage-400 mb-8">Compromiso con tu proceso terapéutico</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {packs.map(item => {
            const perSession = Math.round(item.precio / (item.sesiones || 1))
            const fullPrice  = (item.sesiones || 1) * 35000
            const saving     = fullPrice - item.precio

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-7 border flex flex-col ${
                  item.destacado
                    ? 'border-sage-500 bg-sage-50 ring-2 ring-sage-400 ring-offset-1'
                    : 'border-sage-200 bg-white'
                }`}
              >
                {item.destacado && (
                  <span className="bg-sage-500 text-white text-xs font-medium px-3 py-1 rounded-full self-start mb-3">
                    Mejor valor
                  </span>
                )}
                <p className="text-xs font-medium text-sage-500 mb-2">{item.nombre}</p>
                <p className="font-serif text-5xl text-sage-900 leading-none mb-1">
                  {formatPrice(item.precio)}
                </p>
                <p className="text-xs text-sage-400 mb-1">{item.descripcion}</p>
                <p className="text-xs text-sage-500 font-medium mb-1">
                  ≈ {formatPrice(perSession)} por sesión
                </p>
                <p className="text-xs text-green-600 font-medium mb-5">
                  Ahorras {formatPrice(saving)}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {(PACK_FEATURES[item.id] || []).map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-sage-500">
                      <Check size={13} className="text-sage-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary text-sm justify-center py-2.5">
                  Comprar Pack
                </button>
              </div>
            )
          })}
        </div>

        {/* Insurance banner */}
        <div className="bg-sage-50 border border-sage-200 rounded-2xl p-7 flex flex-col md:flex-row items-center gap-6">
          <div className="text-5xl">🏥</div>
          <div>
            <h3 className="font-serif text-xl text-sage-900 mb-1">Convenios con Isapres</h3>
            <p className="text-sm text-sage-400">
              Trabajamos con Banmédica, Cruz Blanca, Colmena, Consalud y Vida Tres.
              Consulta por reembolsos y cobertura de tu plan.
            </p>
          </div>
          <button className="btn-primary text-sm whitespace-nowrap md:ml-auto">
            Consultar Convenio
          </button>
        </div>

        {/* FAQ teaser */}
        <div className="mt-12 text-center">
          <h3 className="font-serif text-2xl text-sage-900 mb-6">Preguntas Frecuentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
            {[
              { q: '¿Cuánto dura cada sesión?', a: 'Las sesiones individuales duran 50 minutos y las de pareja 60 minutos.' },
              { q: '¿Cómo se realiza la sesión?', a: 'Por videollamada en la plataforma de tu elección: Zoom, Google Meet o Teams.' },
              { q: '¿Puedo cancelar o reprogramar?', a: 'Sí, con al menos 24 horas de anticipación sin costo adicional.' },
              { q: '¿Los packs tienen fecha de vencimiento?', a: 'Sí, cada pack tiene una validez indicada a partir de la fecha de compra.' },
            ].map(faq => (
              <div key={faq.q} className="bg-white border border-sage-200 rounded-xl p-5">
                <p className="text-sm font-medium text-sage-900 mb-1">{faq.q}</p>
                <p className="text-sm text-sage-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
