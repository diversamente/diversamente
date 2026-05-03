import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PsychCard from '@/components/psychologist/PsychCard'
import { AVATAR_COLORS, getInitials, getAvatarColor } from '@/lib/data'

const SPECIALTIES = [
  { icon: '🧠', name: 'Ansiedad',       filter: 'Ansiedad' },
  { icon: '💙', name: 'Depresión',      filter: 'Depresión' },
  { icon: '👨‍👩‍👧', name: 'Infanto-Juvenil', filter: '' },
  { icon: '❤️', name: 'Pareja',         filter: '' },
  { icon: '🌱', name: 'Autoestima',     filter: 'Autoestima' },
  { icon: '😴', name: 'Sueño',          filter: 'Trastornos del sueño/insomnio' },
  { icon: '🌿', name: 'Trauma',         filter: 'Trauma' },
  { icon: '👥', name: 'Familia',        filter: '' },
]

const INSURANCES = ['Banmédica', 'Cruz Blanca', 'Colmena', 'Consalud', 'Vida Tres']

'use client'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [psychologists, setPsychologists] = useState<any[]>([])

  useEffect(() => {
    const { getPsychologists } = require('@/lib/store')
    setPsychologists(getPsychologists().filter((p: any) => p.activo))
  }, [])

  const featured = psychologists.slice(0, 3)

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="bg-sage-50">
        <div className="container py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-tag">🌿 Psicología Online en Chile</div>
            <h1 className="font-serif text-5xl text-sage-900 leading-tight mt-2 mb-4">
              Tu bienestar mental<br />
              en <em className="text-sage-500 not-italic">buenas manos</em>
            </h1>
            <p className="text-sage-400 text-lg leading-relaxed mb-8 max-w-md">
              Conectamos con psicólogos certificados especializados en lo que necesitas.
              Sesiones online, flexibles y accesibles para ti y tu familia.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/psicologos" className="btn-primary">
                Encontrar mi Psicólogo
              </Link>
              <Link href="/tarifas" className="btn-secondary">
                Ver Tarifas
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-sage-200">
              {[
                { num: '20+', lab: 'Psicólogos' },
                { num: '500+', lab: 'Pacientes' },
                { num: '5', lab: 'Especialidades' },
              ].map(s => (
                <div key={s.lab}>
                  <div className="font-serif text-3xl text-sage-500 font-semibold">{s.num}</div>
                  <div className="text-xs text-sage-400 mt-0.5">{s.lab}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini cards */}
          <div className="grid grid-cols-2 gap-3">
            {psychologists.slice(0, 4).map((p, i) => (
              <div key={p.id} className="bg-white border border-sage-200 rounded-2xl p-4 text-center">
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center
                             text-white font-serif text-xl font-semibold"
                  style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {getInitials(p.nombre)}
                </div>
                <p className="text-xs font-medium text-sage-900">{p.nombre.split(' ')[0]}</p>
                <p className="text-xs text-sage-400">{p.categorias[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 text-center">
        <div className="container">
          <div className="section-tag">¿Cómo funciona?</div>
          <h2 className="font-serif text-4xl text-sage-900 mt-2 mb-2">Tres pasos hacia tu bienestar</h2>
          <p className="text-sage-400 mb-12">Simple, rápido y sin complicaciones</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', title: 'Busca tu Psicólogo', desc: 'Filtra por especialidad, categoría y enfoque terapéutico para encontrar el profesional ideal para ti.' },
              { icon: '📅', title: 'Reserva tu Sesión', desc: 'Elige el día y hora que mejor se adapte a tu agenda. Horarios flexibles de lunes a domingo.' },
              { icon: '💬', title: 'Inicia tu Terapia', desc: 'Sesiones por videollamada desde la comodidad de tu hogar. Seguro y completamente confidencial.' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center text-3xl mb-4">
                  {step.icon}
                </div>
                <h3 className="font-serif text-xl text-sage-900 mb-2">{step.title}</h3>
                <p className="text-sm text-sage-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PSYCHOLOGISTS ── */}
      <section className="bg-sage-50 py-20 px-6">
        <div className="container">
          <div className="section-tag">Nuestro Equipo</div>
          <h2 className="font-serif text-4xl text-sage-900 mt-2 mb-2">Psicólogos Destacados</h2>
          <p className="text-sage-400 mb-8">Conoce a algunos de nuestros profesionales</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(p => <PsychCard key={p.id} psych={p} />)}
          </div>
          <div className="text-center mt-8">
            <Link href="/psicologos" className="btn-primary">
              Ver todos los profesionales →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES ── */}
      <section className="py-20 px-6">
        <div className="container">
          <div className="section-tag">Especialidades</div>
          <h2 className="font-serif text-4xl text-sage-900 mt-2 mb-2">¿Con qué te podemos ayudar?</h2>
          <p className="text-sage-400 mb-8">Cubrimos una amplia gama de áreas de la salud mental</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SPECIALTIES.map(s => (
              <Link
                key={s.name}
                href={`/psicologos${s.filter ? `?especialidad=${encodeURIComponent(s.filter)}` : `?categoria=${encodeURIComponent(s.name)}`}`}
                className="bg-sage-50 border border-sage-200 rounded-2xl p-5 text-center
                           hover:bg-sage-100 hover:border-sage-400 transition-all duration-200 group"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-sm font-medium text-sage-900">{s.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSURANCE ── */}
      <section className="bg-sage-50 py-14 px-6">
        <div className="container text-center">
          <p className="text-sm text-sage-400 mb-6 font-medium uppercase tracking-wide">Convenios con Isapres</p>
          <div className="flex flex-wrap justify-center gap-6">
            {INSURANCES.map(ins => (
              <div key={ins} className="bg-white border border-sage-200 rounded-xl px-6 py-3 text-sm font-medium text-sage-600">
                {ins}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6">
        <div className="container">
          <div className="bg-sage-500 rounded-3xl p-12 text-center text-white">
            <h2 className="font-serif text-4xl mb-4">¿Listo para comenzar?</h2>
            <p className="text-sage-100 text-lg mb-8 max-w-md mx-auto">
              Da el primer paso hacia tu bienestar mental. Encuentra tu psicólogo ideal hoy.
            </p>
            <Link
              href="/psicologos"
              className="bg-white text-sage-600 hover:bg-sage-50 font-medium
                         px-8 py-3 rounded-full transition-colors inline-flex items-center gap-2"
            >
              Buscar Psicólogo →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
