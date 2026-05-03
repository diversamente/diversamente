import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DiversaMente · Psicología Online',
  description: 'Conectamos con psicólogos certificados especializados en lo que necesitas. Sesiones online, flexibles y accesibles.',
  keywords: 'psicología online, psicólogos Chile, terapia online, salud mental',
  openGraph: {
    title: 'DiversaMente · Psicología Online',
    description: 'Encuentra tu psicólogo ideal y reserva tu sesión online.',
    locale: 'es_CL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-white text-sage-900">
        {children}
      </body>
    </html>
  )
}
