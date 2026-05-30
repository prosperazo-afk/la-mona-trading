import { createClient } from '@/lib/supabase/server'
import { ProviderForm } from '@/components/ProviderForm'
import { notFound } from 'next/navigation'

export default async function EditProviderPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!provider) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-title text-marron text-3xl font-bold">Editar Proveedor</h1>
        <p className="text-marron/60 mt-1 truncate">{provider.name}</p>
      </div>
      <ProviderForm provider={provider} />
    </div>
  )
}
