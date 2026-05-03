'use client'

import { useEffect, useState } from 'react'
import { getBlogPosts, saveBlogPost, deleteBlogPost, generateId } from '@/lib/store'
import { getPsychologists } from '@/lib/store'
import type { BlogPost } from '@/types'
import { PlusCircle, Trash2, Edit, Check } from 'lucide-react'

const CATEGORIES = ['Ansiedad','Depresión','Infanto-Juvenil','Pareja','Autoestima','Mindfulness','Trauma','TOC','Duelo','Estrés']

export default function AdminBlogPage() {
  const [posts,      setPosts]      = useState<BlogPost[]>([])
  const [psychNames, setPsychNames] = useState<string[]>([])
  const [editing,    setEditing]    = useState<BlogPost | null>(null)
  const [saved,      setSaved]      = useState(false)

  const load = () => { setPosts(getBlogPosts()); setPsychNames(getPsychologists().map(p => p.nombre)) }
  useEffect(() => { load() }, [])

  const blank = (): BlogPost => ({
    id: generateId(),
    titulo: '', resumen: '', contenido: '',
    categoria: CATEGORIES[0],
    autor: psychNames[0] || 'Equipo DiversaMente',
    fecha: new Date().toISOString().slice(0, 10),
    slug: '',
  })

  const handleNew  = () => setEditing(blank())
  const handleEdit = (p: BlogPost) => setEditing({ ...p })
  const handleSave = () => {
    if (!editing) return
    const slug = editing.slug || editing.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    saveBlogPost({ ...editing, slug })
    load()
    setEditing(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  const handleDelete = (id: string, titulo: string) => {
    if (confirm(`¿Eliminar "${titulo}"?`)) { deleteBlogPost(id); load() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-sage-900 mb-1">Blog</h1>
          <p className="text-sm text-sage-400">{posts.length} artículos publicados</p>
        </div>
        <button onClick={handleNew} className="btn-primary text-sm">
          <PlusCircle size={15} /> Nueva Entrada
        </button>
      </div>

      {/* Editor */}
      {editing && (
        <div className="bg-white border border-sage-200 rounded-2xl p-6 mb-8">
          <h2 className="font-serif text-xl text-sage-900 mb-4">{editing.id ? 'Editar' : 'Nueva'} Entrada</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="label">Título *</label>
              <input className="input" value={editing.titulo} onChange={e => setEditing({...editing, titulo: e.target.value})} placeholder="Título del artículo" />
            </div>
            <div>
              <label className="label">Categoría</label>
              <select className="input" value={editing.categoria} onChange={e => setEditing({...editing, categoria: e.target.value})}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Autor</label>
              <select className="input" value={editing.autor} onChange={e => setEditing({...editing, autor: e.target.value})}>
                <option>Equipo DiversaMente</option>
                {psychNames.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Fecha</label>
              <input type="date" className="input" value={editing.fecha} onChange={e => setEditing({...editing, fecha: e.target.value})} />
            </div>
            <div>
              <label className="label">Slug (URL)</label>
              <input className="input" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} placeholder="se-genera-automatico" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Resumen *</label>
              <textarea className="input min-h-[70px] resize-y" value={editing.resumen} onChange={e => setEditing({...editing, resumen: e.target.value})} placeholder="Breve descripción del artículo..." />
            </div>
            <div className="md:col-span-2">
              <label className="label">Contenido</label>
              <textarea className="input min-h-[160px] resize-y" value={editing.contenido} onChange={e => setEditing({...editing, contenido: e.target.value})} placeholder="Contenido completo del artículo..." />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setEditing(null)} className="btn-ghost border border-sage-200 text-sm px-5 py-2">Cancelar</button>
            <button onClick={handleSave} className="btn-primary text-sm">
              {saved ? <><Check size={14} /> Guardado</> : 'Publicar'}
            </button>
          </div>
        </div>
      )}

      {/* Posts table */}
      <div className="bg-white border border-sage-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sage-50 border-b border-sage-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-sage-500">Título</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-sage-500 hidden md:table-cell">Categoría</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-sage-500 hidden md:table-cell">Autor</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-sage-500 hidden lg:table-cell">Fecha</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-sage-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-sage-100 hover:bg-sage-50 transition-colors">
                <td className="px-4 py-3 font-medium text-sage-900">{post.titulo}</td>
                <td className="px-4 py-3 hidden md:table-cell"><span className="badge">{post.categoria}</span></td>
                <td className="px-4 py-3 text-sage-500 hidden md:table-cell">{post.autor}</td>
                <td className="px-4 py-3 text-sage-400 hidden lg:table-cell">{post.fecha}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(post)} className="p-1.5 text-sage-400 hover:text-sage-600">
                      <Edit size={15} />
                    </button>
                    <button onClick={() => handleDelete(post.id, post.titulo)} className="p-1.5 text-sage-300 hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <div className="text-center py-12 text-sage-400 text-sm">No hay artículos.</div>}
      </div>
    </div>
  )
}
