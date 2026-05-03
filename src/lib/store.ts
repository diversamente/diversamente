import type { Psychologist, BlogPost } from '@/types'
import { SAMPLE_PSYCHOLOGISTS, SAMPLE_BLOG_POSTS } from './data'

const PSYCH_KEY = 'dm_psychologists'
const BLOG_KEY  = 'dm_blog_posts'

// ─── Psychologists ────────────────────────────────────────────────────────────

export function getPsychologists(): Psychologist[] {
  if (typeof window === 'undefined') return SAMPLE_PSYCHOLOGISTS
  try {
    const raw = localStorage.getItem(PSYCH_KEY)
    if (!raw) {
      localStorage.setItem(PSYCH_KEY, JSON.stringify(SAMPLE_PSYCHOLOGISTS))
      return SAMPLE_PSYCHOLOGISTS
    }
    return JSON.parse(raw) as Psychologist[]
  } catch {
    return SAMPLE_PSYCHOLOGISTS
  }
}

export function savePsychologist(psych: Psychologist): void {
  const all = getPsychologists()
  const idx = all.findIndex(p => p.id === psych.id)
  if (idx >= 0) {
    all[idx] = psych
  } else {
    all.push(psych)
  }
  localStorage.setItem(PSYCH_KEY, JSON.stringify(all))
}

export function deletePsychologist(id: string): void {
  const all = getPsychologists().filter(p => p.id !== id)
  localStorage.setItem(PSYCH_KEY, JSON.stringify(all))
}

export function getPsychologistById(id: string): Psychologist | undefined {
  return getPsychologists().find(p => p.id === id)
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
