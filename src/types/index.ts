// ─── Psychologist Types ─────────────────────────────────────────────────────

export type Category = 'Adulto' | 'Adulto Mayor' | 'Infanto-Juvenil' | 'Pareja' | 'Familia'

export type Approach =
  | 'Terapia con enfoque cognitivo conductual'
  | 'Terapia con enfoque psicoanalítico'
  | 'Terapia con enfoque sistémico'
  | 'Terapia con enfoque Narrativo'
  | 'Enfoque humanista'
  | 'Terapia Breve'
  | 'Enfoque gestaltico'
  | 'Constructivista'
  | 'Enfoque integrativo'
  | 'Logoterapia'
  | 'Enfoque sistémico centrado en narrativas'
  | 'Psicoterapia cognitiva posracionalista'
  | 'Terapia Junguiana'
  | 'Psicoterapía existencial'
  | 'Psicología analítica'
  | 'Perspectiva social y de género'
  | 'Psicología positiva y mindfulness'
  | 'EMDR'
  | 'Posracionalismo Fenomenológico Hermenéutico'

export type Specialty =
  | 'Abuso'
  | 'Acoso laboral'
  | 'Alcohol y drogas'
  | 'Ansiedad'
  | 'Autoestima'
  | 'Bullying'
  | 'Celos'
  | 'Competencias parentales'
  | 'Crisis de pánico'
  | 'Dependencia emocional'
  | 'Depresión'
  | 'Depresión pos parto'
  | 'Divorcio/separación'
  | 'Duelo'
  | 'Estrategias de aprendizaje'
  | 'Estrés laboral'
  | 'Estrés pos traumático'
  | 'Fobias'
  | 'Infertilidad'
  | 'Infidelidad'
  | 'Niño interior'
  | 'PNL (programación neurolenguistica)'
  | 'Procesos de adopción'
  | 'Psiconcologia'
  | 'Sexualidad y genero'
  | 'Trastorno adaptativo'
  | 'Trastorno bipolar tipo 1 y 2 (TAB)'
  | 'Trastorno de conducta alimentaria'
  | 'Trastorno espectro autista (TEA)'
  | 'Trastorno limite de la personalidad/borderline (TLP)'
  | 'Trastorno obsesivo compulsivo (TOC)'
  | 'Trastornos del sueño/insomnio'
  | 'Trauma'
  | 'Vinculos y apegos'
  | 'Violencia'
  | 'Violencia de genero'
  | 'Vulneracion de derechos'

export interface PostgradoEntry {
  desde: string   // "YYYY-MM"
  hasta: string
  institucion: string
  titulo: string
}

export interface ExperienciaEntry {
  desde: string
  hasta: string
  institucion: string
  funciones: string
}

export type WeekSchedule = {
  [day in 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo']: string[]
}

export interface Psychologist {
  id: string
  nombre: string
  universidad: string
  rut?: string
  fechaNacimiento?: string
  nacionalidad?: string
  telefono?: string
  direccion?: string
  estadoCivil?: string
  correo?: string
  descripcion: string
  foto?: string
  enfoque: Approach
  categorias: Category[]
  especialidades: Specialty[]
  posgrados: PostgradoEntry[]
  experiencia: ExperienciaEntry[]
  horarioNormal: WeekSchedule
  horarioPrime: WeekSchedule
  activo: boolean
  createdAt: string
}

// ─── Blog Types ──────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  titulo: string
  resumen: string
  contenido: string
  categoria: string
  autor: string
  fecha: string
  slug: string
}

// ─── Pricing Types ───────────────────────────────────────────────────────────

export interface PriceItem {
  id: string
  nombre: string
  descripcion: string
  precio: number
  tipo: 'sesion' | 'pack'
  sesiones?: number
  validezMeses?: number
  destacado?: boolean
}
