import { ProviderForm } from '@/components/ProviderForm'

export default function NewProviderPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-title text-marron text-3xl font-bold">Nuevo Proveedor</h1>
        <p className="text-marron/60 mt-1">Agrega un nuevo proveedor a la base de datos.</p>
      </div>
      <ProviderForm />
    </div>
  )
}
