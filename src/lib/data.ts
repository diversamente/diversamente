import type { Approach, Category, Specialty, Psychologist, BlogPost, PriceItem, ServicioPrecio } from '@/types'

// ─── Enfoques ────────────────────────────────────────────────────────────────
export const ENFOQUES: Approach[] = [
  'Terapia con enfoque cognitivo conductual',
  'Terapia con enfoque psicoanalítico',
  'Terapia con enfoque sistémico',
  'Terapia con enfoque Narrativo',
  'Enfoque humanista',
  'Terapia Breve',
  'Enfoque gestaltico',
  'Constructivista',
  'Enfoque integrativo',
  'Logoterapia',
  'Enfoque sistémico centrado en narrativas',
  'Psicoterapia cognitiva posracionalista',
  'Terapia Junguiana',
  'Psicoterapía existencial',
  'Psicología analítica',
  'Perspectiva social y de género',
  'Psicología positiva y mindfulness',
  'EMDR',
  'Posracionalismo Fenomenológico Hermenéutico',
]

// ─── Categorías ───────────────────────────────────────────────────────────────
export const CATEGORIAS: Category[] = [
  'Adulto',
  'Infanto-Juvenil',
  'Pareja/Familia',
]

// ─── Especialidades ───────────────────────────────────────────────────────────
export const ESPECIALIDADES: Specialty[] = [
  'Abuso','Acoso laboral','Alcohol y drogas','Ansiedad','Autoestima',
  'Bullying','Celos','Competencias parentales','Crisis de pánico',
  'Dependencia emocional','Depresión','Depresión pos parto','Divorcio/separación',
  'Duelo','Estrategias de aprendizaje','Estrés laboral','Estrés pos traumático',
  'Fobias','Infertilidad','Infidelidad','Niño interior',
  'PNL (programación neurolenguistica)','Procesos de adopción','Psiconcologia',
  'Sexualidad y genero','Trastorno adaptativo','Trastorno bipolar tipo 1 y 2 (TAB)',
  'Trastorno de conducta alimentaria','Trastorno espectro autista (TEA)',
  'Trastorno limite de la personalidad/borderline (TLP)',
  'Trastorno obsesivo compulsivo (TOC)','Trastornos del sueño/insomnio',
  'Trauma','Vinculos y apegos','Violencia','Violencia de genero','Vulneracion de derechos',
]

// ─── Days & Hours ────────────────────────────────────────────────────────────
export const DAYS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'] as const
export const DAY_LABELS: Record<string, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miérc.',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
}
export const HORARIO_NORMAL = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']
export const HORARIO_PRIME  = ['20:00','21:00','22:00','23:00','00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00']

// ─── Avatar colors ────────────────────────────────────────────────────────────
export const AVATAR_COLORS = [
  '#4a6741','#6b8f62','#3d5c38','#5a7a52','#7a9e72','#8ab082',
  '#3e6e5c','#5f9e85','#2e5e4e','#4a8e72',
]

export function getAvatarColor(id: string): string {
  let hash = 0
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function getInitials(nombre: string): string {
  return nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

// ─── Price helpers ────────────────────────────────────────────────────────────
export function getPrecioDesde(psych: any): string {
  const svcs: ServicioPrecio[] = psych?.servicios || []
  const activos = svcs.filter((s: any) => s.precio > 0)
  if (activos.length === 0) return 'Sin servicios'
  const min = Math.min(...activos.map((s: any) => s.precio))
  return '$' + min.toLocaleString('es-CL')
}

// ─── Sample psychologists ─────────────────────────────────────────────────────
export const SAMPLE_PSYCHOLOGISTS: any[] = [
  {
    id: '1',
    nombre: 'Dominique Cárcamo',
    universidad: 'Universidad de Chile',
    correo: 'dominique@diversamente.cl',
    descripcion: 'Psicóloga clínica con 8 años de experiencia, especializada en terapia cognitivo-conductual para adultos y parejas.',
    enfoque: 'Terapia con enfoque cognitivo conductual',
    categorias: ['Adulto', 'Pareja/Familia'],
    especialidades: ['Ansiedad', 'Depresión', 'Autoestima', 'Dependencia emocional'],
    posgrados: [{ desde: '2019-03', hasta: '2020-12', institucion: 'U. de Chile', titulo: 'Magíster en Psicología Clínica' }],
    experiencia: [{ desde: '2020-01', hasta: '', institucion: 'DiversaMente', funciones: 'Psicóloga clínica online' }],
    horarioNormal: { lunes: ['09:00','10:00','11:00'], martes: ['09:00','10:00'], miercoles: ['14:00','15:00','16:00'], jueves: [], viernes: ['10:00','11:00'], sabado: [], domingo: [] },
    horarioPrime: { lunes: [], martes: ['20:00','21:00'], miercoles: [], jueves: [], viernes: [], sabado: [], domingo: [] },
    servicios: [
      { id: 'adulto-normal', nombre: 'Psicología Adultos', horario: 'normal', precio: 35000 },
      { id: 'pareja-normal', nombre: 'Pareja/Familia',     horario: 'normal', precio: 45000 },
      { id: 'adulto-prime',  nombre: 'Psicología Adultos', horario: 'prime',  precio: 45000 },
      { id: 'pareja-prime',  nombre: 'Pareja/Familia',     horario: 'prime',  precio: 55000 },
    ],
    activo: true, createdAt: '2024-01-15',
  },
  {
    id: '2',
    nombre: 'Francisco Herrera',
    universidad: 'Pontificia Universidad Católica',
    correo: 'francisco@diversamente.cl',
    descripcion: 'Psicólogo con enfoque humanista especializado en procesos de duelo, cambios vitales y bienestar.',
    enfoque: 'Enfoque humanista',
    categorias: ['Adulto'],
    especialidades: ['Duelo', 'Estrés laboral', 'Fobias', 'Trastornos del sueño/insomnio'],
    posgrados: [],
    experiencia: [{ desde: '2018-03', hasta: '', institucion: 'DiversaMente', funciones: 'Psicólogo adultos' }],
    horarioNormal: { lunes: ['10:00','11:00','12:00'], martes: [], miercoles: ['10:00','11:00','12:00'], jueves: ['14:00','15:00'], viernes: ['10:00','11:00'], sabado: ['09:00','10:00'], domingo: [] },
    horarioPrime: { lunes: ['20:00'], martes: [], miercoles: [], jueves: ['20:00','21:00'], viernes: [], sabado: [], domingo: [] },
    servicios: [
      { id: 'adulto-normal', nombre: 'Psicología Adultos', horario: 'normal', precio: 38000 },
      { id: 'adulto-prime',  nombre: 'Psicología Adultos', horario: 'prime',  precio: 48000 },
    ],
    activo: true, createdAt: '2024-01-15',
  },
  {
    id: '3',
    nombre: 'Josefa Silva',
    universidad: 'Universidad Autónoma',
    correo: 'josefa@diversamente.cl',
    descripcion: 'Especialista en psicología infanto-juvenil y familia. Trabajo con niños desde los 5 años hasta adolescentes.',
    enfoque: 'Terapia con enfoque sistémico',
    categorias: ['Infanto-Juvenil', 'Pareja/Familia'],
    especialidades: ['Ansiedad', 'Bullying', 'Trastorno espectro autista (TEA)', 'Estrategias de aprendizaje', 'Competencias parentales'],
    posgrados: [{ desde: '2020-03', hasta: '2021-12', institucion: 'UDP', titulo: 'Diplomado en Psicología Infanto-Juvenil' }],
    experiencia: [{ desde: '2021-01', hasta: '', institucion: 'DiversaMente', funciones: 'Psicóloga infanto-juvenil' }],
    horarioNormal: { lunes: ['14:00','15:00','16:00','17:00'], martes: ['14:00','15:00'], miercoles: ['14:00','15:00','16:00'], jueves: ['14:00','15:00','16:00'], viernes: [], sabado: ['10:00','11:00','12:00'], domingo: [] },
    horarioPrime: { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], domingo: [] },
    servicios: [
      { id: 'infanto-normal', nombre: 'Psicología Infanto-Juvenil', horario: 'normal', precio: 40000 },
      { id: 'pareja-normal',  nombre: 'Pareja/Familia',             horario: 'normal', precio: 45000 },
    ],
    activo: true, createdAt: '2024-02-01',
  },
  {
    id: '4',
    nombre: 'Maribel Arenas',
    universidad: 'Universidad de Valparaíso',
    correo: 'maribel@diversamente.cl',
    descripcion: 'Psicóloga con certificación en EMDR, especializada en el tratamiento del trauma y estrés postraumático.',
    enfoque: 'EMDR',
    categorias: ['Adulto', 'Pareja/Familia'],
    especialidades: ['Trauma', 'Estrés pos traumático', 'Infidelidad', 'Abuso', 'Violencia de genero'],
    posgrados: [{ desde: '2021-06', hasta: '2022-06', institucion: 'EMDR Chile', titulo: 'Certificación EMDR Nivel I y II' }],
    experiencia: [{ desde: '2022-01', hasta: '', institucion: 'DiversaMente', funciones: 'Psicóloga especialista en trauma' }],
    horarioNormal: { lunes: ['09:00','10:00'], martes: ['09:00','10:00','11:00','12:00'], miercoles: [], jueves: ['09:00','10:00'], viernes: ['09:00','10:00','11:00'], sabado: [], domingo: [] },
    horarioPrime: { lunes: ['20:00','21:00'], martes: [], miercoles: ['20:00','21:00','22:00'], jueves: [], viernes: [], sabado: ['20:00'], domingo: [] },
    servicios: [
      { id: 'adulto-normal', nombre: 'Psicología Adultos', horario: 'normal', precio: 42000 },
      { id: 'pareja-normal', nombre: 'Pareja/Familia',     horario: 'normal', precio: 50000 },
      { id: 'adulto-prime',  nombre: 'Psicología Adultos', horario: 'prime',  precio: 52000 },
      { id: 'pareja-prime',  nombre: 'Pareja/Familia',     horario: 'prime',  precio: 60000 },
    ],
    activo: true, createdAt: '2024-02-15',
  },
  {
    id: '5',
    nombre: 'Roceling Romero',
    universidad: 'Universidad Mayor',
    correo: 'roceling@diversamente.cl',
    descripcion: 'Psicóloga clínica con especialización en psicología positiva y mindfulness.',
    enfoque: 'Psicología positiva y mindfulness',
    categorias: ['Adulto', 'Infanto-Juvenil'],
    especialidades: ['Depresión', 'Crisis de pánico', 'Autoestima', 'Ansiedad', 'Estrés laboral'],
    posgrados: [{ desde: '2022-01', hasta: '2022-12', institucion: 'U. Mayor', titulo: 'Diplomado Mindfulness Clínico' }],
    experiencia: [{ desde: '2023-01', hasta: '', institucion: 'DiversaMente', funciones: 'Psicóloga clínica' }],
    horarioNormal: { lunes: ['11:00','12:00','13:00'], martes: ['11:00','12:00','13:00'], miercoles: ['11:00','12:00'], jueves: ['11:00','12:00','13:00'], viernes: ['11:00','12:00'], sabado: [], domingo: [] },
    horarioPrime: { lunes: [], martes: [], miercoles: ['20:00'], jueves: [], viernes: ['20:00','21:00'], sabado: [], domingo: [] },
    servicios: [
      { id: 'adulto-normal',  nombre: 'Psicología Adultos',         horario: 'normal', precio: 36000 },
      { id: 'infanto-normal', nombre: 'Psicología Infanto-Juvenil', horario: 'normal', precio: 38000 },
      { id: 'adulto-prime',   nombre: 'Psicología Adultos',         horario: 'prime',  precio: 46000 },
    ],
    activo: true, createdAt: '2024-03-01',
  },
  {
    id: '6',
    nombre: 'Camila Vega',
    universidad: 'Universidad Central',
    correo: 'camila@diversamente.cl',
    descripcion: 'Especialista en ciclos vitales y transiciones. Acompaño procesos de duelo, infertilidad y adopción.',
    enfoque: 'Constructivista',
    categorias: ['Adulto', 'Pareja/Familia'],
    especialidades: ['Depresión pos parto', 'Infertilidad', 'Duelo', 'Procesos de adopción', 'Sexualidad y genero'],
    posgrados: [],
    experiencia: [{ desde: '2019-06', hasta: '', institucion: 'DiversaMente', funciones: 'Psicóloga clínica y familiar' }],
    horarioNormal: { lunes: [], martes: ['09:00','10:00','11:00'], miercoles: ['09:00','10:00'], jueves: ['09:00','10:00','11:00'], viernes: [], sabado: ['11:00','12:00','13:00'], domingo: [] },
    horarioPrime: { lunes: ['21:00','22:00'], martes: [], miercoles: [], jueves: [], viernes: ['21:00','22:00'], sabado: [], domingo: [] },
    servicios: [
      { id: 'adulto-normal', nombre: 'Psicología Adultos', horario: 'normal', precio: 35000 },
      { id: 'pareja-normal', nombre: 'Pareja/Familia',     horario: 'normal', precio: 48000 },
      { id: 'adulto-prime',  nombre: 'Psicología Adultos', horario: 'prime',  precio: 45000 },
      { id: 'pareja-prime',  nombre: 'Pareja/Familia',     horario: 'prime',  precio: 58000 },
    ],
    activo: true, createdAt: '2024-03-15',
  },
]

// ─── Sample blog posts ────────────────────────────────────────────────────────
export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  { id: '1', slug: 'ansiedad-en-adolescentes', titulo: 'Ansiedad en adolescentes: ¿cuándo acudir al psicólogo?', resumen: 'La adolescencia es una etapa de transformación marcada por cambios hormonales, búsqueda de identidad y presión social.', contenido: 'Contenido completo del artículo...', categoria: 'Ansiedad', autor: 'Josefa Silva', fecha: '2025-05-15' },
  { id: '2', slug: 'que-es-el-tdah', titulo: '¿Qué es el TDAH y cómo se trata?', resumen: 'El TDAH es una condición del neurodesarrollo que puede afectar a niños, adolescentes y adultos.', contenido: 'Contenido completo del artículo...', categoria: 'Infanto-Juvenil', autor: 'Josefa Silva', fecha: '2025-05-08' },
  { id: '3', slug: 'como-saber-si-tengo-toc', titulo: '¿Cómo saber si tengo TOC?', resumen: 'El TOC se caracteriza por la presencia de obsesiones y compulsiones que generan angustia significativa.', contenido: 'Contenido completo del artículo...', categoria: 'TOC', autor: 'Dominique Cárcamo', fecha: '2025-05-01' },
  { id: '4', slug: 'comunicacion-saludable-pareja', titulo: 'Comunicación saludable en la pareja', resumen: 'Aprende herramientas concretas para fortalecer el vínculo y mejorar la comunicación con tu pareja.', contenido: 'Contenido completo del artículo...', categoria: 'Pareja', autor: 'Maribel Arenas', fecha: '2025-04-22' },
  { id: '5', slug: 'construyendo-autoestima-sana', titulo: 'Construyendo una autoestima sana', resumen: 'La autoestima es el pilar de nuestro bienestar emocional.', contenido: 'Contenido completo del artículo...', categoria: 'Autoestima', autor: 'Roceling Romero', fecha: '2025-04-14' },
  { id: '6', slug: 'mindfulness-presencia-bienestar', titulo: 'Mindfulness: presencia y bienestar', resumen: 'Practicar mindfulness puede transformar la relación que tienes contigo mismo y con el mundo.', contenido: 'Contenido completo del artículo...', categoria: 'Mindfulness', autor: 'Roceling Romero', fecha: '2025-04-05' },
]

// ─── Prices ───────────────────────────────────────────────────────────────────
export const PRICES: PriceItem[] = [
  { id: 'sn-adulto',    nombre: 'Sesión Normal · Adulto',          descripcion: 'Lunes a Viernes 08:00–20:00',    precio: 35000,  tipo: 'sesion' },
  { id: 'sn-infanto',   nombre: 'Sesión Normal · Infanto-Juvenil', descripcion: 'Lunes a Viernes 08:00–20:00',    precio: 40000,  tipo: 'sesion', destacado: true },
  { id: 'sp-adulto',    nombre: 'Sesión Prime · Adulto',           descripcion: 'Horario extendido 20:00–08:00',  precio: 45000,  tipo: 'sesion' },
  { id: 'sp-pareja',    nombre: 'Sesión Pareja',                   descripcion: 'Todos los horarios disponibles', precio: 50000,  tipo: 'sesion' },
  { id: 'pack-inicio',  nombre: 'Pack Inicio',                     descripcion: '3 sesiones · Validez 2 meses',  precio: 95000,  tipo: 'pack', sesiones: 3,  validezMeses: 2 },
  { id: 'pack-proceso', nombre: 'Pack Proceso',                    descripcion: '6 sesiones · Validez 4 meses',  precio: 180000, tipo: 'pack', sesiones: 6,  validezMeses: 4, destacado: true },
  { id: 'pack-trans',   nombre: 'Pack Transformación',             descripcion: '12 sesiones · Validez 6 meses', precio: 320000, tipo: 'pack', sesiones: 12, validezMeses: 6 },
]