# DiversaMente — Sitio Web

Plataforma de psicología online construida con **Next.js 14**, **TypeScript** y **Tailwind CSS**.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/diversamente.git
cd diversamente

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Página de inicio
│   ├── psicologos/           # Listado y perfiles
│   ├── tarifas/              # Precios y packs
│   ├── blog/                 # Blog de artículos
│   └── admin/                # Panel de administración
│       ├── page.tsx          # Dashboard
│       ├── psicologos/       # Gestión de psicólogos
│       ├── nuevo/            # Crear nuevo perfil
│       ├── blog/             # Gestión del blog
│       └── precios/          # Gestión de precios
├── components/
│   ├── layout/               # Navbar, Footer
│   └── psychologist/         # PsychCard, PsychForm
├── lib/
│   ├── data.ts               # Constantes y datos de muestra
│   └── store.ts              # Persistencia en localStorage
└── types/
    └── index.ts              # Tipos TypeScript
```

---

## 🌐 Despliegue en GitHub Pages

### Opción A — GitHub Pages (estático)

1. Asegúrate de que `next.config.js` tenga `output: 'export'`
2. Crea el archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

3. En GitHub: Settings → Pages → Source: `gh-pages`

### Opción B — Vercel (recomendado, más fácil)

```bash
npm i -g vercel
vercel --prod
```

O conecta tu repositorio en [vercel.com](https://vercel.com) para despliegue automático.

---

## 🗄️ Base de Datos (próximos pasos)

Actualmente usa **localStorage** para persistencia en el cliente.
Para producción, se recomienda:

### Supabase (gratuito)
1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea las tablas: `psychologists`, `blog_posts`, `prices`
3. Reemplaza las funciones en `src/lib/store.ts` con llamadas a Supabase
4. Agrega las variables de entorno:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_aqui
```

---

## 🎨 Personalización

### Colores
Edita `tailwind.config.js` → sección `colors.sage` para cambiar la paleta.

### Datos de muestra
Edita `src/lib/data.ts` → `SAMPLE_PSYCHOLOGISTS` para cambiar los psicólogos de ejemplo.

### Logo
Reemplaza el componente en `src/components/layout/Navbar.tsx`.

---

## 📄 Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/psicologos` | Listado con filtros |
| `/psicologos/[id]` | Perfil individual |
| `/tarifas` | Precios y packs |
| `/blog` | Blog de artículos |
| `/admin` | Dashboard admin |
| `/admin/psicologos` | Gestión psicólogos |
| `/admin/nuevo` | Crear perfil |
| `/admin/psicologos/[id]` | Editar perfil |
| `/admin/blog` | Gestión blog |
| `/admin/precios` | Gestión precios |

---

## 🔧 Tecnologías

- **Next.js 14** — Framework React con App Router
- **TypeScript** — Tipado estático
- **Tailwind CSS** — Estilos utilitarios
- **Lucide React** — Iconografía
- **LocalStorage** — Persistencia del lado cliente
