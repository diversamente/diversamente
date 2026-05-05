import type { Psychologist, BlogPost } from '@/types'
import { SAMPLE_PSYCHOLOGISTS, SAMPLE_BLOG_POSTS } from './data'

const PSYCH_KEY = 'dm_psychologists'
const BLOG_KEY  = 'dm_blog_posts'

// ─── Psychologists ────────────────────────────────────────────────────────────

export function getPsychologists(): any[] {
  if (typeof window === 'undefined') return SAMPLE_PSYCHOLOGISTS
  try {
    const raw = localStorage.getItem(PSYCH_KEY)
    if (!raw) {
      // Primera vez: inicializa con los datos de muestra
      localStorage.setItem(PSYCH_KEY, JSON.stringify(SAMPLE_PSYCHOLOGISTS))
      return SAMPLE_PSYCHOLOGISTS
    }
    const stored: any[] = JSON.parse(raw)

    // Fusiona: si existe en localStorage usa esos datos (tienen prioridad)
    // Si hay psicólogos de muestra que no están en localStorage, los agrega
    const storedIds = new Set(stored.map((p: any) => p.id))
    const missing = SAMPLE_PSYCHOLOGISTS.filter((p: any) => !storedIds.has(p.id))
    if (missing.length > 0) {
      const merged = [...stored, ...missing]
      localStorage.setItem(PSYCH_KEY, JSON.stringify(merged))
      return merged
    }
    return stored
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
  const all = getPsychologists().filter((p: any) => p.id !== id)
  localStorage.setItem(PSYCH_KEY, JSON.stringify(all))
}

export function getPsychologistById(id: string): any | undefined {
  return getPsychologists().find((p: any) => p.id === id)
}

// ─── Forzar reinicio de datos de muestra ─────────────────────────────────────
// Llama esto desde el admin si los datos están desactualizados
export function resetSampleData(): void {
  if (typeof window === 'undefined') return
  const stored: any[] = JSON.parse(localStorage.getItem(PSYCH_KEY) || '[]')

  // Actualiza cada psicólogo de muestra con sus datos actuales si no han sido editados
  const updated = stored.map((p: any) => {
    const sample = SAMPLE_PSYCHOLOGISTS.find((s: any) => s.id === p.id)
    // Si tiene los servicios del sample original (sin editar por admin), actualiza
    if (sample && (!p.servicios || p.servicios.length === 0)) {
      return { ...p, servicios: sample.servicios }
    }
    return p
  })
  localStorage.setItem(PSYCH_KEY, JSON.stringify(updated))
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