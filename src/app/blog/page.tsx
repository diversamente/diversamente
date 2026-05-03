'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getBlogPosts } from '@/lib/store'
import type { BlogPost } from '@/types'

const BLOG_ICONS: Record<string, string> = {
  'Ansiedad': '🧠',
  'Depresión': '💙',
  'Infanto-Juvenil': '🌟',
  'TOC': '🔄',
  'Pareja': '❤️',
  'Autoestima': '🌱',
  'Mindfulness': '🧘',
  'Trauma': '🌿',
  'Default': '📝',
}

const BG_COLORS = ['#e8f0e6','#f0ede8','#e6e8f0','#f0e8ed','#e8f0ea','#ede8f0']

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [catFilter, setCatFilter] = useState('')

  useEffect(() => { setPosts(getBlogPosts()) }, [])

  const categories = Array.from(new Set(posts.map(p => p.categoria)))
  const filtered = catFilter ? posts.filter(p => p.categoria === catFilter) : posts

  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="section-tag">Recursos y Bienestar</div>
        <h1 className="font-serif text-4xl text-sage-900 mt-2 mb-2">Blog de Salud Mental</h1>
        <p className="text-sage-400 text-base">Artículos de nuestros psicólogos para tu bienestar</p>
      </div>

      <main className="container py-10">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCatFilter('')}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              !catFilter ? 'bg-sage-500 text-white border-sage-500' : 'border-sage-200 text-sage-500 hover:border-sage-400'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                catFilter === cat ? 'bg-sage-500 text-white border-sage-500' : 'border-sage-200 text-sage-500 hover:border-sage-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <article key={post.id} className="card overflow-hidden cursor-pointer">
              <div
                className="h-40 flex items-center justify-center text-5xl"
                style={{ backgroundColor: BG_COLORS[i % BG_COLORS.length] }}
              >
                {BLOG_ICONS[post.categoria] || BLOG_ICONS['Default']}
              </div>
              <div className="p-5">
                <p className="text-xs font-medium text-sage-500 uppercase tracking-wide mb-2">
                  {post.categoria}
                </p>
                <h2 className="font-serif text-lg text-sage-900 leading-tight mb-2 line-clamp-2">
                  {post.titulo}
                </h2>
                <p className="text-xs text-sage-400 leading-relaxed line-clamp-3">{post.resumen}</p>
              </div>
              <div className="px-5 py-3 border-t border-sage-100 flex items-center justify-between">
                <span className="text-xs text-sage-400">
                  {post.autor} · {new Date(post.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="text-xs text-sage-500 font-medium">Leer →</span>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sage-400">No hay artículos en esta categoría.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
