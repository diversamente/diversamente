import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-sage-900 text-sage-200 py-12 px-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-sage-400 rounded-lg flex items-center justify-center">
                <span className="font-serif text-white text-base font-semibold">DM</span>
              </div>
              <span className="font-serif text-lg text-white">
                Diversa<span className="text-sage-400">Mente</span>
              </span>
            </div>
            <p className="text-sm text-sage-300 leading-relaxed max-w-xs">
              Psicología online en Chile. Conectamos con profesionales certificados para
              acompañarte en tu camino al bienestar.
            </p>
          </div>

          <div>
            <h4 className="font-sans font-medium text-white text-sm mb-4">Navegación</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/psicologos', label: 'Psicólogos' },
                { href: '/tarifas', label: 'Tarifas' },
                { href: '/blog', label: 'Blog' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-sage-300 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-medium text-white text-sm mb-4">Convenios</h4>
            <ul className="space-y-2 text-sm text-sage-300">
              <li>Banmédica</li>
              <li>Cruz Blanca</li>
              <li>Colmena</li>
              <li>Consalud</li>
              <li>Vida Tres</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sage-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-sage-400">
          <span>© {new Date().getFullYear()} DiversaMente. Todos los derechos reservados.</span>
          <span>Psicología Online · Chile</span>
        </div>
      </div>
    </footer>
  )
}
