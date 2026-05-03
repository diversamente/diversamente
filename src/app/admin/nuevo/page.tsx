import PsychForm from '@/components/psychologist/PsychForm'

export default function NuevoPsicologoPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-sage-900 mb-1">Nuevo Perfil de Psicólog@</h1>
      <p className="text-sm text-sage-400 mb-8">Completa la ficha profesional</p>
      <PsychForm />
    </div>
  )
}
