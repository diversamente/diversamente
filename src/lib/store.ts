import type { Psychologist, BlogPost } from '@/types'
import { SAMPLE_PSYCHOLOGISTS, SAMPLE_BLOG_POSTS } from './data'

const PSYCH_KEY   = 'dm_psychologists'
const DELETED_KEY = 'dm_deleted_ids'
const BLOG_KEY    = 'dm_blog_posts'

// ─── Deleted IDs tracking ─────────────────────────────────────────────────────

function getDeletedIds(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(DELETED_KEY) || '[]') } catch { return [] }
}

function addDeletedId(id: string): void {
  const ids = getDeletedIds()
  if (!ids.includes(id)) {
    ids.push(id)
    localStorage.setItem(DELETED_KEY, JSON.stringify(ids))
  }
}

// ─── Psychologists ────────────────────────────────────────────────────────────

export function getPsychologists(): any[] {
  if (typeof window === 'undefined') return SAMPLE_PSYCHOLOGISTS
  try {
    const deletedIds = getDeletedIds()
    const raw = localStorage.getItem(PSYCH_KEY)

    if (!raw) {
      const initial = SAMPLE_PSYCHOLOGISTS.filter((p: any) => !deletedIds.includes(p.id))
      localStorage.setItem(PSYCH_KEY, JSON.stringify(initial))
      return initial
    }

    const stored: any[] = JSON.parse(raw)

    // Agrega psicólogos de muestra que no están en localStorage ni fueron eliminados
    const storedIds = new Set(stored.map((p: any) => p.id))
    const missing = SAMPLE_PSYCHOLOGISTS.filter(
      (p: any) => !storedIds.has(p.id) && !deletedIds.includes(p.id)
    )
    if (missing.length > 0) {
      const merged = [...stored, ...missing]
      localStorage.setItem(PSYCH_KEY, JSON.stringify(merged))
      return merged
    }

    // Filtra los eliminados por si acaso
    return stored.filter((p: any) => !deletedIds.includes(p.id))
  } catch {
    return SAMPLE_PSYCHOLOGISTS
  }
}

export function savePsychologist(psych: any): void {
  const all = getPsychologists()
  const idx = all.findIndex((p: any) => p.id === psych.id)
  if (idx >= 0) {
    all[idx] = psych
  } else {
    all.push(psych)
  }
  localStorage.setItem(PSYCH_KEY, JSON.stringify(all))
}

export function deletePsychologist(id: string): void {
  // Registra el ID como eliminado para que no vuelva de SAMPLE_PSYCHOLOGISTS
  addDeletedId(id)
  // Elimina del array almacenado
  const all = getPsychologists().filter((p: any) => p.id !== id)
  localStorage.setItem(PSYCH_KEY, JSON.stringify(all))
}

export function getPsychologistById(id: string): any | undefined {
  return getPsychologists().find((p: any) => p.id === id)
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export function getBlogPosts(): BlogPost[] {
  if (typeof window === 'undefined') return SAMPLE_BLOG_POSTS
  try {
    const raw = localStorage.getItem(BLOG_KEY)
    if (!raw) {
      localStorage.setItem(BLOG_KEY, JSON.stringify(SAMPLE_BLOG_POSTS))
      return SAMPLE_BLOG_POSTS
    }
    return JSON.parse(raw) as BlogPost[]
  } catch {
    return SAMPLE_BLOG_POSTS
  }
}

export function saveBlogPost(post: BlogPost): void {
  const all = getBlogPosts()
  const idx = all.findIndex(p => p.id === post.id)
  if (idx >= 0) {
    all[idx] = post
  } else {
    all.push(post)
  }
  localStorage.setItem(BLOG_KEY, JSON.stringify(all))
}

export function deleteBlogPost(id: string): void {
  const all = getBlogPosts().filter(p => p.id !== id)
  localStorage.setItem(BLOG_KEY, JSON.stringify(all))
}

// ─── ID generator ─────────────────────────────────────────────────────────────

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}